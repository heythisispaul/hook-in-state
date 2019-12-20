import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { createMockState } from './testHelpers/createMockState';
import {
  getInStateBuilder,
  mapDispatchToReducers,
  buildMemoCache,
  useSelectorBuilder,
  getNextStateBuilder,
  customDispatchBuilder,
} from '../src/helpers';

const mockState = createMockState();

describe('getInStateBuilder', () => {
  it('returns a function', () => {
    const result = getInStateBuilder();
    expect(result).toBeInstanceOf(Function);
  });

  it('can return a value at a stringified path', () => {
    const getInState = getInStateBuilder(mockState);
    const testValue = getInState('example');
    expect(testValue).toEqual(100);
  });

  it('can traverse multiple levels', () => {
    const getInState = getInStateBuilder(mockState);
    const testValue = getInState('deeply.nested.value');
    expect(testValue).toEqual('You found me!');
  });

  it('can find elements in an array', () => {
    const getInState = getInStateBuilder(mockState);
    const testValue = getInState('different.path[0].value');
    expect(testValue).toEqual('You found me too!');
  });

  it('can handle a path that is an array', () => {
    const getInState = getInStateBuilder(mockState);
    const testValue = getInState(['different', 'path', 0, 'value']);
    expect(testValue).toEqual('You found me too!');
  });

  it('uses the fallback value when the path is invalid', () => {
    const getInState = getInStateBuilder(mockState);
    const testValue = getInState('not.a.real.path', 'fallback time!');
    expect(testValue).toEqual('fallback time!');
  });
});

describe('mapDispatchToReducers', () => {
  it('returns a map of all propvided reducers', () => {
    const dispatch = jest.fn((a, b) => (a, b));
    const providedActions = {
      test: (state) => state,
      test2: (state) => state.hello
    };
    const actions = mapDispatchToReducers(dispatch, providedActions);
    expect(actions).toMatchSnapshot();
  });

  it('returns an empty object if no actions are provided', () => {
    const dispatch = jest.fn();
    const actions = mapDispatchToReducers(dispatch);
    expect(actions).toEqual({});
  });

  it('provides actions that call dispatch', () => {
    expect.assertions(2);
    const dispatch = jest.fn((b) => (b));
    const providedActions = { test: (state) => state };
    const actions = mapDispatchToReducers(dispatch, providedActions);
    const testResult = actions.test('what!');
    expect(dispatch).toHaveBeenCalled();
    expect(testResult).toEqual({ type: "test", value: "what!" });
  });
});

describe('buildMemoCache', () => {
  const memoTest = ['hello', 5, 'what'];

  it('returns an array of the provided values', () => {
    const memoMap = buildMemoCache(memoTest, mockState);
    expect(memoMap).toEqual(memoTest);
  });

  it('calls provided functions with the state value', () => {
    const newMemoTest = [...memoTest, (state) => state.foo];
    const memoMap = buildMemoCache(newMemoTest, mockState);
    expect(memoMap).toEqual([...memoTest, 'bar']);
  });
});

// TODO: Test that covers the memoization
describe('useSelectorBuilder', () => {
  it('calls the selector with the state value', () => {
    const mockSelector = jest.fn((a) => a);
    const useSelector = useSelectorBuilder(mockState);
    renderHook(() => useSelector(mockSelector));
    expect(mockSelector).toHaveBeenCalledWith(mockState);
  });
});

describe('customDispatchBuilder', () => {
  it('creates a function that calls dispatch with the provided action', () => {
    const dispatch = jest.fn(a => a);
    const customReducer = { value: 'meow', reducer: () => {} };
    const customDispatch = customDispatchBuilder(dispatch);
    customDispatch(customReducer);
    expect(dispatch).toHaveBeenCalled();
  });
});

describe('getNextStateBuilder', () => {
  it('returns a function that can compute the next state', () => {
    expect.assertions(2);
    const testReducer = {
      test: (state) => state.hello++,
      test2: (state, value) => state.foo = value,
    };
    const getNextState = getNextStateBuilder(testReducer);
    const testState = getNextState(mockState, { type: 'test' });
    expect(testState.hello).toEqual(6);
    const nextTestSTate = getNextState(testState, { type: 'test2', value: 'meow' });
    expect(nextTestSTate.foo).toEqual('meow');
  });

  it('returns the state if no reducers match', () => {
    const getNextState = getNextStateBuilder();
    const testState = getNextState(mockState, { type: 'test' });
    expect(testState).toEqual(mockState);
  });

  it('can call a custom dispatch if provided', () => {
    const getNextState = getNextStateBuilder({});
    const testState = getNextState(mockState, {
      reducer: (state, value) => state.foo = value,
      value: 'bonjour',
    });
    expect(testState.foo).toEqual('bonjour');
  });
});