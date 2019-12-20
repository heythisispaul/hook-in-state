/* eslint-disable no-unused-vars */
import React, { createContext, useReducer } from 'react';
import {
  mapDispatchToReducers,
  getNextStateBuilder,
  getInStateBuilder,
  useSelectorBuilder,
  customDispatchBuilder,
} from './helpers'; 

export const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children, reducers, initialState = {} }) => {
  const getNextState = getNextStateBuilder(reducers);
  const [state, dispatch] = useReducer(getNextState, initialState);
  const actions = mapDispatchToReducers(dispatch, reducers);
  const customDispatch = customDispatchBuilder(dispatch);
  const useSelector = useSelectorBuilder(state);
  const selectInState = getInStateBuilder(state);

  return (
    <GlobalStateContext.Provider
      value={{
        dispatch: customDispatch,
        actions,
        selectInState,
        useSelector,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export default GlobalStateProvider;

