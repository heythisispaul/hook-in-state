import React, { useReducer } from 'react';
import { produce } from 'immer';
import GlobalContext, { GlobalStateProvider as getGlobalStateProvider } from './context';
import { getInStateBuilder } from './helpers';

export const useSetupGlobalState = (providedActions = {}, initialState = {}) => {
  const getNextState = (state, action) => (
    produce(state, (draft) => {
      const { type, value, reducer } = action;
      const matchingReducer = providedActions[type];
      if (matchingReducer) {
        matchingReducer(draft, value);
      } 
      if (reducer) {
        reducer(draft, value);
      }
    })
  );
  const [state, dispatch] = useReducer(getNextState, initialState);
  const actions = {};
  Object.entries(providedActions).forEach((currentAction) => {
    const [name] = currentAction;
    const type = name.toString();
    actions[type] = (value) => dispatch({ type, value });
  });

  const customDispatch = (value, reducer) => dispatch({ value, reducer });

  const getInState = getInStateBuilder(state);
  const contextValues = { state, dispatch: customDispatch, actions, getInState };

  const GlobalStateProvider = getGlobalStateProvider(contextValues);

  return {
    ...contextValues,
    GlobalStateProvider,
  };
};

const useGlobalState = () => {
  // not desctructuring for easier mocking
  const globalContextValue = React.useContext(GlobalContext);
  return globalContextValue;
};

export default useGlobalState;
