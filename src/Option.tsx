import * as React from 'react';

export interface OptionProps {
  value?: string;
  label?: string | React.ReactNode;
  key?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Option: React.FC<OptionProps> = () => null;

export default Option;
