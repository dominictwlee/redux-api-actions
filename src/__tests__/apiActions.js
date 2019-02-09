import { apiActions } from '../index';

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  };
  const next = jest.fn();

  const invoke = action => apiActions(store)(next)(action);

  return { store, next, invoke };
};

describe('Actions passing through middleware', () => {
  test('Pass through action objects without meta property', () => {
    const { next, invoke } = create();
    const action = { type: 'TEST_MIDDLEWARE_REQUEST' };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  test('Pass through action objects without meta.apiCall property', () => {
    const { next, invoke } = create();
    const action = { type: 'TEST_MIDDLEWARE_REQUEST', meta: { other: 'not Api' } };
    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });
});

test('Throw error if meta.apiCall is not a function', () => {
  const { invoke } = create();
  const action = { type: 'TEST_MIDDLEWARE_REQUEST', meta: { apiCall: 'Not a function' } };
  try {
    invoke(action);
  } catch (e) {
    expect(e.message).toBe('Expected meta.apiCall to be a function');
  }
});

test('Throw error if action type is not the right format', () => {
  const { invoke } = create();
  const action = { type: 'REQUEST_TEST_MIDDLEWARE', meta: { apiCall: jest.fn() } };
  try {
    invoke(action);
  } catch (e) {
    expect(e.message).toBe("Expected action type to have 'REQUEST' suffix");
  }
});
