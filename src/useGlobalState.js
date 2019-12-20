import React from 'react';
import { GlobalStateContext } from './GlobalStateProvider';

// not desctructuring for easier mocking
const useGlobalState = () => React.useContext(GlobalStateContext);

export default useGlobalState;
