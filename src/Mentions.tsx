import classNames from 'classnames';
import omit from 'omit.js';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import KeywordTrigger from './KeywordTrigger';
import Option, { OptionProps } from './Option';
import {
  getBeforeSelectionText,
  getLastMeasureIndex,
  replaceWithMeasure,
  setInputSelection,
} from './util';

interface MentionsProps {
  defaultValue?: string;
  value?: string;
  onChange?: (text: string) => void;
  onSearch?: (text: string) => void;
  prefixCls?: string;
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}
interface MentionsState {
  value: string;
  measuring: boolean;
  measureText: string | null;
  measureLocation: number;
  activeIndex: number;
}
class Mentions extends React.Component<MentionsProps, MentionsState> {
  public static Option = Option;

  public static defaultProps = {
    prefixCls: 'rc-mentions',
    prefix: '@',
  };

  public static getDerivedStateFromProps(props: MentionsProps, prevState: MentionsState) {
    const newState: Partial<MentionsState> = {};

    if ('value' in props && props.value !== prevState.value) {
      newState.value = props.value;
    }

    return newState;
  }

  public textarea?: HTMLTextAreaElement;
  public measure?: HTMLDivElement;

  constructor(props: MentionsProps) {
    super(props);
    this.state = {
      value: props.defaultValue || props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      activeIndex: 0,
    };
  }

  public componentDidUpdate() {
    const { measuring } = this.state;

    // Sync measure div top with textarea for rc-trigger usage
    if (measuring) {
      this.measure!.scrollTop = this.textarea!.scrollTop;
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
    const { which, key } = event;
    const { value, activeIndex, measuring, measureLocation } = this.state;
    const { prefix = '' } = this.props;

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
      return;
    } else if (which === KeyCode.ENTER) {
      // Measure hit
      const { value: mentionValue = '' } = this.getOptions()[activeIndex] || {};
      const { text, selectionLocation } = replaceWithMeasure(value, {
        measureLocation,
        prefix,
        targetText: mentionValue,
      });
      this.triggerChange(text);
      this.stopMeasure(() => {
        // We need restore the selection position
        setInputSelection(this.textarea!, selectionLocation);
      });
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
    const { prefix = '', onSearch } = this.props;
    const selectionStartText = getBeforeSelectionText(event.target as HTMLTextAreaElement);
    const measureIndex = getLastMeasureIndex(selectionStartText, prefix);

    // Skip if match the white key list
    if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN].indexOf(which) !== -1) {
      return;
    }

    if (measureIndex !== -1) {
      const measureText = selectionStartText.slice(measureIndex + prefix.length);
      const validateMeasure = measureText.indexOf(' ') === -1;
      const matchOption: boolean = !!this.getOptions(measureText).length;

      if (key === prefix || measuring || (measureText !== prevMeasureText && matchOption)) {
        this.startMeasure(measureText, measureIndex);
      }

      // Stop if measureText is invalidate
      if (measuring && !validateMeasure) {
        this.stopMeasure();
      }

      /**
       * We will trigger `onSearch` to developer since they may use for async update.
       * If met `space` means user finished searching.
       */
      if (onSearch && validateMeasure) {
        onSearch(measureText);
      }
    } else if (measuring) {
      this.stopMeasure();
    }
  };

  public setTextAreaRef = (element: HTMLTextAreaElement) => {
    this.textarea = element;
  };

  public setMeasureRef = (element: HTMLDivElement) => {
    this.measure = element;
  };

  public getOptions = (measureText?: string): OptionProps[] => {
    const targetMeasureText = (measureText || this.state.measureText || '').toLocaleLowerCase();
    const { children } = this.props;
    const list = toArray(children)
      .map(({ props: { value } }: { props: OptionProps }) => ({
        value,
      }))
      .filter(({ value = '' }: OptionProps) => {
        return value.toLowerCase().indexOf(targetMeasureText) !== -1;
      });
    return list;
  };

  public startMeasure(measureText: string, measureLocation: number) {
    this.setState({
      measuring: true,
      measureText,
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

  public render() {
    const { value, measureLocation, measuring, activeIndex } = this.state;
    const { prefix = '', prefixCls, className, style, ...restProps } = this.props;

    const props = omit(restProps, ['onChange']);

    return (
      <div className={classNames(prefixCls, className)} style={style}>
        <textarea
          {...props}
          ref={this.setTextAreaRef}
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
        />
        {measuring && (
          <div ref={this.setMeasureRef} className={`${prefixCls}-measure`}>
            {value.slice(0, measureLocation)}
            <KeywordTrigger
              prefixCls={prefixCls}
              options={this.getOptions()}
              activeIndex={activeIndex}
              visible={true}
            >
              <span>{prefix}</span>
            </KeywordTrigger>
            {value.slice(measureLocation + prefix.length)}
          </div>
        )}
      </div>
    );
  }
}

polyfill(Mentions);

export default Mentions;
