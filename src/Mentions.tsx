import classNames from 'classnames';
import omit from 'omit.js';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import KeywordTrigger from './KeywordTrigger';
import Option, { OptionProps } from './Option';

interface MentionsProps {
  value?: string;
  onChange?: (text: string) => void;
  prefixCls?: string;
  prefix?: string;
  className?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
}
interface MentionsState {
  value: string;
  measuring: boolean;
  measureText: string;
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

  public state = {
    value: '',
    measuring: false,
    measureText: '',
    activeIndex: 0,
  };

  public textarea?: HTMLTextAreaElement;

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
    const { key, which } = event;
    const { value, activeIndex, measuring, measureText } = this.state;
    const { prefix } = this.props;
    if (prefix === key) {
      // Trigger measure
      const startLoc = this.textarea!.selectionStart;
      this.setState({
        measuring: true,
        measureText: `${value.slice(0, startLoc)}`,
      });
      return;
    }

    // Measure logic
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
    } else if ([KeyCode.LEFT, KeyCode.RIGHT, KeyCode.ESC].indexOf(which) !== -1) {
      this.setState({
        measuring: false,
      });
    } else if (which === KeyCode.ENTER) {
      const { value: mentionValue = '' } = this.getOptions()[activeIndex] || {};
      this.triggerChange(`${measureText} ${prefix}${mentionValue} `);
      this.setState({
        measuring: false,
      });
      event.preventDefault();
    }
  };

  public setTextAreaRef = (element: HTMLTextAreaElement) => {
    this.textarea = element;
  };

  public getOptions = (): OptionProps[] => {
    const { children } = this.props;
    const list = toArray(children).map(({ props: { value } }: { props: OptionProps }) => ({
      value,
    }));
    return list;
  };

  public render() {
    const { value, measureText, measuring, activeIndex } = this.state;
    const { prefix, prefixCls, className, style, ...restProps } = this.props;

    const props = omit(restProps, ['onChange']);

    return (
      <div className={classNames(prefixCls, className)} style={style}>
        <textarea
          {...props}
          ref={this.setTextAreaRef}
          value={value}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        {measuring && (
          <div className={`${prefixCls}-measure`}>
            {measureText}
            <KeywordTrigger
              prefixCls={prefixCls}
              options={this.getOptions()}
              activeIndex={activeIndex}
              visible={true}
            >
              <span>{prefix}</span>
            </KeywordTrigger>
          </div>
        )}
      </div>
    );
  }
}

polyfill(Mentions);

export default Mentions;
