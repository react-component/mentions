import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
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
import calculateNodeHeight from './calculateNodeHeight';
import raf from './raf';

type BaseTextareaAttrs = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'prefix' | 'onChange' | 'onSelect'
>;

export type Placement = 'top' | 'bottom';

const RESIZE_STATUS_NONE = 0;
const RESIZE_STATUS_RESIZING = 1;
const RESIZE_STATUS_RESIZED = 2;

export interface AutoSizeType {
  minRows?: number;
  maxRows?: number;
}

export interface MentionsProps extends BaseTextareaAttrs {
  autoFocus?: boolean;
  className?: string;
  defaultValue?: string;
  notFoundContent?: React.ReactNode;
  split?: string;
  style?: React.CSSProperties;
  transitionName?: string;
  placement?: Placement;
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
  autoSize?: boolean | AutoSizeType;
  onResize?: (size: { width: number; height: number }) => void;
}
interface MentionsState {
  value: string;
  measuring: boolean;
  measureText: string | null;
  measurePrefix: string;
  measureLocation: number;
  activeIndex: number;
  isFocus: boolean;
  textareaStyles?: React.CSSProperties;
  resizeStatus?:
    | typeof RESIZE_STATUS_NONE
    | typeof RESIZE_STATUS_RESIZING
    | typeof RESIZE_STATUS_RESIZED;
}
class Mentions extends React.Component<MentionsProps, MentionsState> {
  // eslint-disable-next-line react/sort-comp
  public static Option = Option;

  public textarea?: HTMLTextAreaElement;

  public measure?: HTMLDivElement;

  public focusId: number | undefined = undefined;

  public nextFrameActionId: number;

  public resizeFrameId: number;

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
      textareaStyles: {},
      resizeStatus: RESIZE_STATUS_NONE,
    };
  }

  public componentDidMount() {
    this.resizeTextarea();
  }

  public componentDidUpdate(prevProps: MentionsProps, prevState: MentionsState) {
    const { measuring, value } = this.state;
    const { value: propsValue } = this.props;

    // Sync measure div top with textarea for rc-trigger usage
    if (measuring) {
      this.measure.scrollTop = this.textarea.scrollTop;
    }
    // Re-render with the new content then recalculate the height as required.
    if (prevState.value !== value || prevProps.value !== propsValue) {
      this.resizeTextarea();
    }
  }

  public handleResize = (size: { width: number; height: number }) => {
    const { resizeStatus } = this.state;
    const { autoSize, onResize } = this.props;
    if (resizeStatus !== RESIZE_STATUS_NONE) {
      return;
    }
    if (typeof onResize === 'function') {
      onResize(size);
    }
    if (autoSize) {
      this.resizeOnNextFrame();
    }
  };

  public resizeOnNextFrame = () => {
    raf.cancel(this.nextFrameActionId);
    this.nextFrameActionId = raf(this.resizeTextarea);
  };

  public resizeTextarea = () => {
    const { autoSize } = this.props;
    if (!autoSize || !this.textarea) {
      return;
    }
    const { minRows, maxRows } = autoSize as AutoSizeType;
    const textareaStyles = calculateNodeHeight(this.textarea, false, minRows, maxRows);
    this.setState({ textareaStyles, resizeStatus: RESIZE_STATUS_RESIZING }, () => {
      raf.cancel(this.resizeFrameId);
      this.resizeFrameId = raf(() => {
        this.setState({ resizeStatus: RESIZE_STATUS_RESIZED }, () => {
          this.resizeFrameId = raf(() => {
            this.setState({ resizeStatus: RESIZE_STATUS_NONE });
            this.fixFirefoxAutoScroll();
          });
        });
      });
    });
  };

  // https://github.com/ant-design/ant-design/issues/21870
  fixFirefoxAutoScroll() {
    try {
      if (document.activeElement === this.textarea) {
        const currentStart = this.textarea.selectionStart;
        const currentEnd = this.textarea.selectionEnd;
        this.textarea.setSelectionRange(currentStart, currentEnd);
      }
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
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
  public onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = event => {
    const { which } = event;
    const { activeIndex, measuring } = this.state;

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
      const option = this.getOptions()[activeIndex];
      this.selectOption(option);
      event.preventDefault();
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
  public onKeyUp: React.KeyboardEventHandler<HTMLTextAreaElement> = event => {
    const { key, which } = event;
    const { measureText: prevMeasureText, measuring } = this.state;
    const { prefix = '', onSearch, validateSearch } = this.props;
    const target = event.target as HTMLTextAreaElement;
    const selectionStartText = getBeforeSelectionText(target);
    const { location: measureIndex, prefix: measurePrefix } = getLastMeasureIndex(
      selectionStartText,
      prefix,
    );

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

  public onInputFocus: React.FocusEventHandler<HTMLTextAreaElement> = event => {
    this.onFocus(event);
  };

  public onInputBlur: React.FocusEventHandler<HTMLTextAreaElement> = event => {
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

  public setTextAreaRef = (element: HTMLTextAreaElement) => {
    this.textarea = element;
  };

  public setMeasureRef = (element: HTMLDivElement) => {
    this.measure = element;
  };

  public getOptions = (measureText?: string): OptionProps[] => {
    const targetMeasureText = measureText || this.state.measureText || '';
    const { children, filterOption } = this.props;
    const list = toArray(children)
      .map(({ props }: { props: OptionProps }) => props)
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
    const {
      value,
      measureLocation,
      measurePrefix,
      measuring,
      activeIndex,
      textareaStyles,
      resizeStatus,
    } = this.state;
    const {
      prefixCls,
      placement,
      transitionName,
      className,
      style,
      autoFocus,
      notFoundContent,
      getPopupContainer,
      autoSize,
      onResize,
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
        <ResizeObserver onResize={this.handleResize} disabled={!(autoSize || onResize)}>
          <textarea
            autoFocus={autoFocus}
            ref={this.setTextAreaRef}
            value={value}
            {...inputProps}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onKeyUp={this.onKeyUp}
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            style={{
              ...textareaStyles,
              ...(resizeStatus === RESIZE_STATUS_RESIZING
                ? // React will warning when mix `overflow` & `overflowY`.
                  // We need to define this separately.
                  { overflowX: 'hidden', overflowY: 'hidden' }
                : null),
            }}
          />
        </ResizeObserver>
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
