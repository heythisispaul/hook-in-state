/* eslint-disable no-unused-vars */
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import useGlobalState, { useSetupGlobalState } from '../src/useGlobalState';
import GlobalState from '../src/context';
import { createMockState } from './testHelpers/createMockState';

configure({ adapter: new Adapter() });

describe('useGlobalState', () => {
  describe('useSetupGlobalState', () => {
    const mockProvidedActions = {
      increment: (state) => state.count++,
      updateExample: (state, value) => state.anotherExample = value,
    };

    it('maps the provided actions to dispatches', () => {
      expect.assertions(2);
      const state = createMockState();
      const { result } = renderHook(() => useSetupGlobalState(mockProvidedActions, state));
      expect(result.current.actions).toMatchSnapshot();
      act(() => {
        result.current.actions.increment();
      });
      expect(result.current.state.count).toBe(1);
    });

    it('provides actions that dispatch with their provided argument', () => {
      const state = createMockState();
      const { result } = renderHook(() => useSetupGlobalState(mockProvidedActions, state));
      const exampleText = 'example updated!';
      act(() => {
        result.current.actions.updateExample(exampleText);
      });
      expect(result.current.getInState('anotherExample')).toEqual(exampleText);
    });

    it('calls the provided fuction when using a custom dispatch', () => {
      const state = createMockState();
      const { result } = renderHook(() => useSetupGlobalState(mockProvidedActions, state));
      const customDispatchText = 'updated from custom dispatch!';
      act(() => {
        result.current.dispatch(customDispatchText, (state, value) => state.anotherExample = value);
      });
      expect(result.current.state.anotherExample).toEqual(customDispatchText);
    });

    it('uses an empt object for state if none provided', () => {
      const { result } = renderHook(() => useSetupGlobalState(mockProvidedActions));
      expect(result.current.state).toEqual({});
    });

    it('provides the context providing component and it renders its children', () => {
      const state = createMockState();
      const { result } = renderHook(() => useSetupGlobalState(mockProvidedActions, state));
      const { GlobalStateProvider } = result.current;
      const render = mount(
        <GlobalStateProvider>
          <div>I'll render!</div>
          <div>So will I!</div>
        </GlobalStateProvider>
      );
      expect(render.html()).toMatchSnapshot();
    });

    describe('useGlobalState', () => {
      it('should provide the global context', () => {
        const useContextMock = React.useContext = jest.fn();
        renderHook(() => useGlobalState());
        expect(useContextMock).toHaveBeenCalled();
      });
    });
  });
});
