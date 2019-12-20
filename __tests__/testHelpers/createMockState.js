export const createMockState = () => ({
  example: 100,
  count: 0,
  anotherExample: undefined,
  deeply: {
    nested: {
      value: 'You found me!',
    }
  },
  different: {
    path: [
      {
        value: 'You found me too!'
      }
    ]
  },
  foo: 'bar',
  hello: 5,
});
