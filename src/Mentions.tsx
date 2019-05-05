import classNames from 'classnames';
import omit from 'omit.js';
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import Option from './Option';

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
  };

  public textarea?: HTMLTextAreaElement;

  public onChange: React.ChangeEventHandler<HTMLTextAreaElement> = ({ target: { value } }) => {
    const { onChange } = this.props;
    this.setState({ value });
    if (onChange) {
      onChange(value);
    }
  };

  // Check if hit the measure keyword
  public onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = ({ key }) => {
    const { value } = this.state;
    const { prefix } = this.props;
    if (prefix === key) {
      const startLoc = this.textarea!.selectionStart;
      this.setState({
        measureText: `${value.slice(0, startLoc)}`,
      });
    }
  };

  public setTextAreaRef = (element: HTMLTextAreaElement) => {
    this.textarea = element;
  };

  public render() {
    const { value, measureText } = this.state;
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
        <div className={`${prefixCls}-measure`}>
          {measureText}
          <span>{prefix}</span>
        </div>
      </div>
    );
  }
}

polyfill(Mentions);

export default Mentions;
