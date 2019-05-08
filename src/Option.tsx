import * as React from 'react';

export interface OptionProps {
  value?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Option: React.SFC<OptionProps> = () => null;

export default Option;
