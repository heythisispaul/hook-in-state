// eslint-disable-next-line no-unused-vars
import React, { createContext, useReducer } from 'react';
import { produce } from 'immer';
import GlobalContext, { GlobalStateProvider } from './context';
import { getInStateBuilder } from './helpers';

export const useSetupGlobalState = (providedActions = {}, initialState = {}) => {
  const getNextState = (state = initialState, action) => (
    produce(state, (draft) => {
      const { type, value } = action;
      const matchingReducer = providedActions[type];
      if (matchingReducer) {
        matchingReducer(draft, value);
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

  const getInState = getInStateBuilder(state);
  const contextValues = { state, dispatch, actions, getInState };

  const getGlobalStateProvider = GlobalStateProvider(contextValues);

  return {
    ...contextValues,
    GlobalStateProvider: getGlobalStateProvider,
  };
};

const useGlobalState = () => {
  // not desctructuring for easier mocking
  const globalContextValue = React.useContext(GlobalContext);
  return globalContextValue;
};

export default useGlobalState;
