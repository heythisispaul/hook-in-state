# hook-in-state

React hooks-based global state management.

Inspired by the quick-start format of [Redux Toolkit](https://redux-toolkit.js.org/), this React hook provides [immutable](https://immerjs.github.io/immer/docs/introduction) application state management using React's out-of-the-box functionality.

## Getting Set Up

### Install
```
npm install hook-in-state
```

### Configuring

In the highest level of your React application you would like state access, import `useSetupGlobalState`. This function takes in two parameters:

1. A **required** 'reducer' object where each key is a function performing some predicatble, synchronous state mutation.
2. An **optional** object that represents the initial state of your application.

The return value is an object containing `GlobalStateProvider`, a context-providing React component that provides the needed context to all `children`, as well as the 
values provided by calling `useGlobalState` which are covered below.

```javascript
import React from 'react';
import { useSetupGlobalState } from 'hook-in-state';

const reducers = {
  increment: (state) => state.count++,
  decrement: (state) => state.count--,
  updateGreeting: (state, value) => state.conversation.greeting = value,
};

const initialState = {
  count: 0,
  conversation: {
    greeting: 'hello!',
    thank: 'Thank you!',
  },
};

function App() {
  const { GlobalStateProvider } = useSetupGlobalState(reducers, initialState);
  return (
    <GlobalStateProvider>
      {/* .. The rest of your application */}
    </GlobalStateProvider>
  );
}

export default App;
```

### Accessing and Updating State

Any component further in the component tree will now have the needed context, and can gain access to it by calling `useGlobalState`. The return value is an object containing
the following properties:

| Name         | Type        | Description                                                                                                                           |
| -----------  | ----------- | -------------------------------------------------------------------------------------------------------------------------------------
| `actions`    | `object`    | A map of what was provided to `useSetupGlobalState`. Each key is now a function that will dispatch updates to the state.
| `getInState` | `function`  | Similar to [lodash's get](https://lodash.com/docs/4.17.15#get). Takes in a stringified object path and an optional fallback value. 
| `state`      | `object`    | The full state object.
| `dispatch`   | `function`  | A wrapper around [React's](https://reactjs.org/docs/hooks-reference.html#usereducer) `dispatch` to send unconfigured state updates.

A simple example of any given child component of our `App` component where the global state was set up:

```javascript
import React from 'react';
import useGlobalState from 'hook-in-state';

const SomeChildComponent = () => {
  const { actions, getInState, state } = useGlobalState();
  const { updateGreeting, increment, decrement } = actions;
  const greeting = getInState('conversation.greeting');
  const thankYou = getInState('conversation.thank');

  return (
    <div>
      <h1>{greeting}</h1>
      <h1>Current Count: {state.count}</h1>
      <button type="button" onClick={increment}>
        Add
      </button>
      <button type="button" onClick={decrement}>
        Remove
      </button>
      <button type="button" onClick={() => updateGreeting('Howdy!')}>
        Update Greeting
      </button>
      <h1>{thankYou}</h1>
    </div>
  );
};

export default SomeChildComponent;
```

## Examples

### Custom Dispatches

Even if a reducing action was not provided when originally configuring the state, you can provide custom dispatches by using the provided `dispatch` function.
If we would like to update our 'Thank You!' text, we can do so here by providing a reference to the new value and the function to perform the update.

```javascript
import React from 'react';
import useGlobalState from 'hook-in-state';

const SomeChildComponent = () => {
  const { actions, getInState, state, dispatch } = useGlobalState();
  const { updateGreeting, increment, decrement } = actions;
  const greeting = getInState('conversation.greeting');
  const thankYou = getInState('conversation.thank');

  const updateThankYou = (value) => dispatch(value, (state, value) => state.conversation.thank = value);

  return (
    <div>
      <h1>{greeting}</h1>
      <h1>Current Count: {state.count}</h1>
      <button type="button" onClick={increment}>
        Add
      </button>
      <button type="button" onClick={decrement}>
        Remove
      </button>
      <button type="button" onClick={() => updateGreeting('Howdy!')}>
        Update Greeting
      </button>
      <button type="button" onClick={() => updateThankYou('Much Appreciated!')}>
        Update thank You
      </button>
      <h1>{thankYou}</h1>
    </div>
  );
};

export default SomeChildComponent;
```

### Handling State

Even though the changes we set up in our reducing functions appear to be mutating the state, due to the `produce` function provided by [Immer](https://immerjs.github.io/immer/docs/produce) the state is never directly manipulated. Directly attempting to change the state will not work.

The `getInState` function can also be very handy for trying to locate deeply nested properties. It will traverse the stringified path provided and if at any point comes across an
`undefined` value it will return the second parameter as a fallback value.

```javascript
const reducers = {
  increment: (state) => state.count++,
  decrement: (state) => state.count--,
};

const initialState = {
  count: 0,
  some: {
    deeply: {
      nested: {
        value: 'You found me!',
      },
    },
  },
  this: {
    one: [
      {
        too: 'Hello out there!',
      },
    ],
  },
};

const {
  state,
  getInState,
} = useSetupGlobalState(reducers, initialState);

const updateStateDirectly = () => state.count = 5; 
// TypeError: Cannot assign to read only property 'count'

const deepStateOne = getInState('some.deeply.nested.value');
// 'You found me!'

const deepStateTwo = getInState('this.one[0].too');
// 'Hello out there!'

const deepStateThree = getInState('not.a.path', 'Fallback time!');
// 'Fallback time!'
```

## Contributing

Contributions and feedback are welcome.
