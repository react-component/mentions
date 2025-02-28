import * as React from 'react';

export interface UnstableContextProps {
  /** Only used for antd site v6 preview usage. */
  open?: boolean;
}

export const UnstableContext = React.createContext<UnstableContextProps>({});
