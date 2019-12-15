import { createMockState } from './testHelpers/createMockState';
import { getInStateBuilder } from '../src/helpers';

describe('getInStateBuilder', () => {
  const mockState = createMockState();
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

  it('uses the fallback value when the path is invalid', () => {
    const getInState = getInStateBuilder(mockState);
    const testValue = getInState('not.a.real.path', 'fallback time!');
    expect(testValue).toEqual('fallback time!');
  });
});