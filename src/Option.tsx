import type * as React from 'react';

export interface OptionProps {
  value?: string;
  key?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Option: React.FC<OptionProps> = () => null;

export default Option;
