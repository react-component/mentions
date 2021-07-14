import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import TextArea, { TextAreaProps } from 'rc-textarea';
import KeywordTrigger from './KeywordTrigger';
import { MentionsContextProvider } from './MentionsContext';
import Option, { OptionProps } from './Option';
import {
  filterOption as defaultFilterOption,
  getBeforeSelectionText,
  getLastMeasureIndex,
  omit,
  Omit,
  replaceWithMeasure,
  setInputSelection,
  validateSearch as defaultValidateSearch,
} from './util';

type BaseTextareaAttrs = Omit<TextAreaProps, 'prefix' | 'onChange' | 'onSelect'>;

export type Placement = 'top' | 'bottom';
export type Direction = 'ltr' | 'rtl';

export interface MentionsProps extends BaseTextareaAttrs {
  autoFocus?: boolean;
  className?: string;
  defaultValue?: string;
  notFoundContent?: React.ReactNode;
  split?: string;
  style?: React.CSSProperties;
  transitionName?: string;
  placement?: Placement;
  direction?: Direction;
  prefix?: string | string[];
  prefixCls?: string;
  value?: string;
  filterOption?: false | typeof defaultFilterOption;
  validateSearch?: typeof defaultValidateSearch;
  onChange?: (text: string) => void;
  onSelect?: (option: OptionProps, prefix: string) => void;
  onSearch?: (text: string, prefix: string) => void;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  getPopupContainer?: () => HTMLElement;
}
interface MentionsState {
  value: string;
  measuring: boolean;
  measureText: string | null;
  measurePrefix: string;
  measureLocation: number;
  activeIndex: number;
  isFocus: boolean;
}
class Mentions extends React.Component<MentionsProps, MentionsState> {
  public static Option = Option;

  public textarea?: HTMLTextAreaElement;

  public measure?: HTMLDivElement;

  public focusId: number | undefined = undefined;

  public static defaultProps = {
    prefixCls: 'rc-mentions',
    prefix: '@',
    split: ' ',
    validateSearch: defaultValidateSearch,
    filterOption: defaultFilterOption,
    notFoundContent: 'Not Found',
    rows: 1,
  };

  public static getDerivedStateFromProps(props: MentionsProps, prevState: MentionsState) {
    const newState: Partial<MentionsState> = {};

    if ('value' in props && props.value !== prevState.value) {
      newState.value = props.value || '';
    }

    return newState;
  }

  constructor(props: MentionsProps) {
    super(props);
    this.state = {
      value: props.defaultValue || props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false,
    };
  }

  public componentDidUpdate() {
    const { measuring } = this.state;

    // Sync measure div top with textarea for rc-trigger usage
    if (measuring) {
      this.measure.scrollTop = this.textarea.scrollTop;
    }
  }

  public triggerChange = (value: string) => {
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({ value });
    }

    if (onChange) {
      onChange(value);
    }
  };

  public onChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target: { value } }) => {
    this.triggerChange(value);
  };

  // Check if hit the measure keyword
  public onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { which } = event;
    const { activeIndex, measuring } = this.state;
    const { onKeyDown: clientOnKeyDown } = this.props;

    if (clientOnKeyDown) {
      clientOnKeyDown(event);
    }

    // Skip if not measuring
    if (!measuring) {
      return;
    }

    if (which === KeyCode.UP || which === KeyCode.DOWN) {
      // Control arrow function
      const optionLen = this.getOptions().length;
      const offset = which === KeyCode.UP ? -1 : 1;
      const newActiveIndex = (activeIndex + offset + optionLen) % optionLen;
      this.setState({
        activeIndex: newActiveIndex,
      });
      event.preventDefault();
    } else if (which === KeyCode.ESC) {
      this.stopMeasure();
    } else if (which === KeyCode.ENTER) {
      // Measure hit
      event.preventDefault();
      const options = this.getOptions();
      if (!options.length) {
        this.stopMeasure();
        return;
      }
      const option = options[activeIndex];
      this.selectOption(option);
    }
  };

  /**
   * When to start measure:
   * 1. When user press `prefix`
   * 2. When measureText !== prevMeasureText
   *  - If measure hit
   *  - If measuring
   *
   * When to stop measure:
   * 1. Selection is out of range
   * 2. Contains `space`
   * 3. ESC or select one
   */
  public onKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { key, which } = event;
    const { measureText: prevMeasureText, measuring } = this.state;
    const { prefix = '', onKeyUp: clientOnKeyUp, onSearch, validateSearch } = this.props;
    const target = event.target as HTMLTextAreaElement;
    const selectionStartText = getBeforeSelectionText(target);
    const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
      selectionStartText,
      prefix,
    );

    // If the client implements an onKeyUp handler, call it
    if (clientOnKeyUp) {
      clientOnKeyUp(event);
    }

    // Skip if match the white key list
    if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
      return;
    }

    if (measureIndex !== -1) {
      const measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
      const validateMeasure: boolean = validateSearch(measureText, this.props);
      const matchOption = !!this.getOptions(measureText).length;

      if (validateMeasure) {
        if (
          key === measurePrefix ||
          key === 'Shift' ||
          measuring ||
          (measureText !== prevMeasureText && matchOption)
        ) {
          this.startMeasure(measureText, measurePrefix, measureIndex);
        }
      } else if (measuring) {
        // Stop if measureText is invalidate
        this.stopMeasure();
      }

      /**
       * We will trigger `onSearch` to developer since they may use for async update.
       * If met `space` means user finished searching.
       */
      if (onSearch && validateMeasure) {
        onSearch(measureText, measurePrefix);
      }
    } else if (measuring) {
      this.stopMeasure();
    }
  };

  public onPressEnter: React.KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    const { measuring } = this.state;
    const { onPressEnter } = this.props;
    if (!measuring && onPressEnter) {
      onPressEnter(event);
    }
  };

  public onInputFocus: React.FocusEventHandler<HTMLTextAreaElement> = (event) => {
    this.onFocus(event);
  };

  public onInputBlur: React.FocusEventHandler<HTMLTextAreaElement> = (event) => {
    this.onBlur(event);
  };

  public onDropdownFocus = () => {
    this.onFocus();
  };

  public onDropdownBlur = () => {
    this.onBlur();
  };

  public onFocus = (event?: React.FocusEvent<HTMLTextAreaElement>) => {
    window.clearTimeout(this.focusId);
    const { isFocus } = this.state;
    const { onFocus } = this.props;
    if (!isFocus && event && onFocus) {
      onFocus(event);
    }
    this.setState({ isFocus: true });
  };

  public onBlur = (event?: React.FocusEvent<HTMLTextAreaElement>) => {
    this.focusId = window.setTimeout(() => {
      const { onBlur } = this.props;
      this.setState({ isFocus: false });
      this.stopMeasure();
      if (onBlur) {
        onBlur(event);
      }
    }, 0);
  };

  public selectOption = (option: OptionProps) => {
    const { value, measureLocation, measurePrefix } = this.state;
    const { split, onSelect } = this.props;

    const { value: mentionValue = '' } = option;
    const { text, selectionLocation } = replaceWithMeasure(value, {
      measureLocation,
      targetText: mentionValue,
      prefix: measurePrefix,
      selectionStart: this.textarea.selectionStart,
      split,
    });
    this.triggerChange(text);
    this.stopMeasure(() => {
      // We need restore the selection position
      setInputSelection(this.textarea, selectionLocation);
    });

    if (onSelect) {
      onSelect(option, measurePrefix);
    }
  };

  public setActiveIndex = (activeIndex: number) => {
    this.setState({
      activeIndex,
    });
  };

  public setTextAreaRef = (element: TextArea) => {
    this.textarea = element?.resizableTextArea?.textArea;
  };

  public setMeasureRef = (element: HTMLDivElement) => {
    this.measure = element;
  };

  public getOptions = (measureText?: string): OptionProps[] => {
    const targetMeasureText = measureText || this.state.measureText || '';
    const { children, filterOption } = this.props;
    const list = toArray(children)
      .map(({ props, key }: { props: OptionProps; key: React.Key }) => ({
        ...props,
        key: (key || props.value) as string,
      }))
      .filter((option: OptionProps) => {
        /** Return all result if `filterOption` is false. */
        if (filterOption === false) {
          return true;
        }
        return filterOption(targetMeasureText, option);
      });
    return list;
  };

  public startMeasure(measureText: string, measurePrefix: string, measureLocation: number) {
    this.setState({
      measuring: true,
      measureText,
      measurePrefix,
      measureLocation,
      activeIndex: 0,
    });
  }

  public stopMeasure(callback?: () => void) {
    this.setState(
      {
        measuring: false,
        measureLocation: 0,
        measureText: null,
      },
      callback,
    );
  }

  public focus() {
    this.textarea.focus();
  }

  public blur() {
    this.textarea.blur();
  }

  public render() {
    const { value, measureLocation, measurePrefix, measuring, activeIndex } = this.state;
    const {
      prefixCls,
      placement,
      direction,
      transitionName,
      className,
      style,
      autoFocus,
      notFoundContent,
      getPopupContainer,
      ...restProps
    } = this.props;

    const inputProps = omit(
      restProps,
      'value',
      'defaultValue',
      'prefix',
      'split',
      'children',
      'validateSearch',
      'filterOption',
      'onSelect',
      'onSearch',
    );

    const options = measuring ? this.getOptions() : [];

    return (
      <div className={classNames(prefixCls, className)} style={style}>
        <TextArea
          autoFocus={autoFocus}
          ref={this.setTextAreaRef}
          value={value}
          {...inputProps}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onPressEnter={this.onPressEnter}
          onFocus={this.onInputFocus}
          onBlur={this.onInputBlur}
        />
        {measuring && (
          <div ref={this.setMeasureRef} className={`${prefixCls}-measure`}>
            {value.slice(0, measureLocation)}
            <MentionsContextProvider
              value={{
                notFoundContent,
                activeIndex,
                setActiveIndex: this.setActiveIndex,
                selectOption: this.selectOption,
                onFocus: this.onDropdownFocus,
                onBlur: this.onDropdownBlur,
              }}
            >
              <KeywordTrigger
                prefixCls={prefixCls}
                transitionName={transitionName}
                placement={placement}
                direction={direction}
                options={options}
                visible
                getPopupContainer={getPopupContainer}
              >
                <span>{measurePrefix}</span>
              </KeywordTrigger>
            </MentionsContextProvider>
            {value.slice(measureLocation + measurePrefix.length)}
          </div>
        )}
      </div>
    );
  }
}

export default Mentions;
