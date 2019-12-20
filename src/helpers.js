import React from 'react';
import { produce } from 'immer';

export const getInStateBuilder = (state = {}) => (path, defaultValue) => {
  const parsedPath = Array.isArray(path) 
    ? path
    : path 
      .replace(/\[/g, '.')
      .replace(/]/g, '')
      .split('.')
      .filter(Boolean);
  let current = { ...state };
  const isValidPath = parsedPath.every((step) => {
    const stepIsValid = current[step] !== undefined;
    if (stepIsValid) {
      current = current[step];
    }
    return stepIsValid;
  });
  return isValidPath ? current : defaultValue;
};

export const mapDispatchToReducers = (dispatch, providedReducers = {}) => {
  const actions = {};
  Object.entries(providedReducers).forEach((currentAction) => {
    const [name] = currentAction;
    const type = name.toString();
    actions[type] = (value) => dispatch({ type, value });
  });
  return actions;
};

// const value =  useSelector((state) => state.count, []);
export const buildMemoCache = (memoArray, state) => memoArray.map((memoValue) => {
  return typeof memoValue === 'function' ? memoValue(state) : memoValue;
});

export const useSelectorBuilder = (state) => (selector, memoArray = []) => React.useMemo(
  () => selector(state), 
  buildMemoCache(memoArray, state)
);

export const customDispatchBuilder = (dispatch) => (value, reducer) => dispatch({ value, reducer });

export const getNextStateBuilder = (reducers = {}) => (state, action) => (
  produce(state, (draft) => {
    const { type, value, reducer } = action;
    const matchingReducer = reducers[type];
    if (matchingReducer) {
      matchingReducer(draft, value);
    } 
    if (reducer) {
      reducer(draft, value);
    }
  })
);