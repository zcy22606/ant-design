import * as React from 'react';

/** 尺寸 */
export type SizeType = 'small' | 'middle' | 'large' | undefined;

const SizeContext = React.createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: React.ReactNode;
}

export const SizeContextProvider: React.FC<SizeContextProps> = ({ children, size }) => (
  <SizeContext.Consumer>
    {(originSize) => (
      <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>
    )}
  </SizeContext.Consumer>
);

export default SizeContext;
