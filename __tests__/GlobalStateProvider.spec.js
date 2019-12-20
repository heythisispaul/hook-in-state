/* eslint-disable no-unused-vars */
import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GlobalStateProvider from '../src/GlobalStateProvider';
import { createMockState } from './testHelpers/createMockState';
import { getInStateBuilder, mapDispatchToReducers } from '../src/helpers';

jest.mock('../src/helpers');

const dispatch = jest.fn();

configure({ adapter: new Adapter() });

beforeEach(() => {
  [getInStateBuilder, mapDispatchToReducers, dispatch]
    .forEach((mock) => mock.mockReset());
});

describe('GlobalStateProvider', () => {
  const ProviderRender = (reducers, state) => {
    const render = mount(
      <GlobalStateProvider reducers={reducers} initialState={state}>
        <div>I'll render!</div>
        <div>So will I!</div>
      </GlobalStateProvider>
    );
    return render;
  }
  const state = createMockState();
  const reducer = { test: (state) => state.count++ };
  it('provides the context providing component and it renders its children', () => {
    const render = ProviderRender(reducer, state);
    expect(render.html()).toMatchSnapshot();
  });

  it('should not error if no initialState is provided', () => {
    expect.assertions(2);
    const render = ProviderRender(reducer);
    expect(getInStateBuilder).toHaveBeenCalledWith({});
    expect(render.html()).toMatchSnapshot();
  });

  it('should map the provided reducers to dispatch', () => {
    ProviderRender(reducer);
    expect(mapDispatchToReducers.mock.calls[0][1]).toEqual(reducer);
  });
});
