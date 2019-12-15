/* eslint-disable no-unused-vars */
import React, { createContext } from 'react';

const GlobalState = createContext();

export const GlobalStateProvider = (contextValues) => ({ children }) => (
  <GlobalState.Provider value={contextValues}>
    {children}
  </GlobalState.Provider>
);

GlobalStateProvider.displayName = 'useGlobalState';

export default GlobalState;
