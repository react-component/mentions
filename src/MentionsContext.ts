import createReactContext, { Context } from '@ant-design/create-react-context';
import { OptionProps } from './Option';

export interface MentionsContextProps {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  selectOption: (option: OptionProps) => void;
  onFocus: () => void;
}

const MentionsContext: Context<MentionsContextProps> = createReactContext({
  activeIndex: 0,
  setActiveIndex: (_: number) => {
    /* Do nothing */
  },
  selectOption: (_: OptionProps) => {
    /* Do nothing */
  },
  onFocus: () => {
    /* Do nothing */
  },
});

export const MentionsContextProvider = MentionsContext.Provider;
export const MentionsContextConsumer = MentionsContext.Consumer;
