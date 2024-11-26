/* tslint:disable: no-object-literal-type-assertion */
import * as React from 'react';
import type { OptionProps } from './Option';

export interface MentionsContextProps {
  notFoundContent: React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  selectOption: (option: OptionProps) => void;
  onFocus: React.FocusEventHandler<HTMLElement>;
  onBlur: React.FocusEventHandler<HTMLElement>;
  onScroll: React.UIEventHandler<HTMLElement>;
}

// We will never use default, here only to fix TypeScript warning
const MentionsContext: React.Context<MentionsContextProps> =
  React.createContext(null);

export default MentionsContext;
