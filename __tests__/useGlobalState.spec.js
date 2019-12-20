/* eslint-disable no-unused-vars */
import React from 'react';
import { renderHook } from '@testing-library/react-hooks';

import useGlobalState from '../src/useGlobalState';

describe('useGlobalState', () => {
  it('should provide the global context', () => {
    const useContextMock = React.useContext = jest.fn();
    renderHook(() => useGlobalState());
    expect(useContextMock).toHaveBeenCalled();
  });
});
