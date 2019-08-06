/* tslint:disable: no-object-literal-type-assertion */
import createReactContext, { Context } from '@ant-design/create-react-context';
import * as React from 'react';
import { OptionProps } from './Option';

export interface MentionsContextProps {
  notFoundContent: React.ReactNode;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  selectOption: (option: OptionProps) => void;
  onFocus: () => void;
}

// We will never use default, here only to fix TypeScript warning
const MentionsContext: Context<MentionsContextProps> = createReactContext(null);

export const MentionsContextProvider = MentionsContext.Provider;
export const MentionsContextConsumer = MentionsContext.Consumer;
