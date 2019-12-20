# hook-in-state

React hooks-based global state management.

Inspired by the quick-start format of [Redux Toolkit](https://redux-toolkit.js.org/), this React hook provides [immutable](https://immerjs.github.io/immer/docs/introduction) application state management using React's out-of-the-box functionality.

## Getting Set Up

### Install
```
npm install hook-in-state
```

### Configuring

In the highest level of your React application you would like state access, import `GlobalStateProvider`. This function takes in two parameters:

1. A **required** 'reducer' object where each key is a function performing some predicatble, synchronous state mutation.
2. An **optional** object that represents the initial state of your application.

The return value is a context-providing React component that provides the needed context to all `children`.

```javascript
import React from 'react';
import { GlobalStateProvider } from 'hook-in-state';

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
  return (
    <GlobalStateProvider reducers={reducers} initialState={initialState}>
      {/* .. The rest of your application */}
    </GlobalStateProvider>
  );
}

export default App;
```

### Accessing and Updating State

Any component further in the component tree will now have the needed context, and can gain access to it by calling `useGlobalState`. The return value is an object containing
the following properties:

| Name            | Type        | Description                                                                                                                           |
| --------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------
| `actions`       | `object`    | A map of what was provided to `useSetupGlobalState`. Each key is now a function that will dispatch updates to the state.
| `selectInState` | `function`  | Similar to [lodash's get](https://lodash.com/docs/4.17.15#get). Takes in a stringified object path and an optional fallback value. 
| `useSelector`   | `function`  | A hook that can make memoized calls to state.
| `dispatch`      | `function`  | A wrapper around [React's](https://reactjs.org/docs/hooks-reference.html#usereducer) `dispatch` to send unconfigured state updates.

A simple example of any given child component of our `App` component where the global state was set up:

```javascript
import React from 'react';
import useGlobalState from 'hook-in-state';

const SomeChildComponent = () => {
  const { actions, selectInState } = useGlobalState();
  const { updateGreeting, increment, decrement } = actions;
  const greeting = selectInState('conversation.greeting');
  const thankYou = selectInState('conversation.thank');
  const count = selectInState('count');

  return (
    <div>
      <h1>{greeting}</h1>
      <h1>Current Count: {count}</h1>
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
  const { actions, selectInState, dispatch } = useGlobalState();
  const { updateGreeting, increment, decrement } = actions;
  const greeting = selectInState('conversation.greeting');
  const thankYou = selectInState('conversation.thank');
  const count = selectInState('count');

  const updateThankYou = (value) => dispatch(value, (state, value) => state.conversation.thank = value);

  return (
    <div>
      <h1>{greeting}</h1>
      <h1>Current Count: {count}</h1>
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

The `selectInState` function can also be very handy for trying to locate deeply nested properties. It will traverse the stringified path provided and if at any point comes across an
`undefined` value it will return the second parameter as a fallback value.

The `useSelector` function is a hook that takes in a function that receives the state as an argument and will return the result of the function. Its second argument is an
array, that when mutated will cause the provided function to refire. Any functions provided to this array will be called with the state value.

```javascript

// global state provided to GlobalStateProvider:
const state = {
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
        also: 'Found me again!',
      },
    ],
  },
};

// in any component:

const { selectInState, useSelector } = useGlobalState();

const updateStateDirectly = () => state.count = 5; 
// TypeError: Cannot assign to read only property 'count'

const deepStateOne = selectInState('some.deeply.nested.value');
// 'You found me!'

const deepStateTwo = selectInState('this.one[0].too');
// 'Hello out there!'

const deepStateThree = selectInState(['this', 'one', 0, 'also']);
// 'Found me again!'

const deepStateFour = selectInState('not.a.path', 'Fallback time!');
// 'Fallback time!'

// useSelector

const props = { foo: 'bar' };

// will only refire if the 'some' property of state or 'props' changes.
const myStateValue = useSelector(
  (state) => state.some.deeply.nested.value,
  [(state) => state.some, props]
);
```

## Contributing

Contributions and feedback are welcome.
