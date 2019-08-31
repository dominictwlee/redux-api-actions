import { apiActions } from '../index';
import { META, LIFECYCLE } from '../constants';

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(value => value),
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

describe('Actions suffixed with REQUEST', () => {
  test('Dispatch actions on success', async () => {
    const {
      invoke,
      store: { dispatch },
    } = create();
    const action = {
      type: 'TEST_MIDDLEWARE_REQUEST',
      meta: { apiCall: () => Promise.resolve('some value') },
    };
    const requestAction = {
      type: 'TEST_MIDDLEWARE_REQUEST',
    };
    const successAction = {
      type: 'TEST_MIDDLEWARE_SUCCESS',
      payload: 'some value',
    };
    await invoke(action);
    expect(dispatch).toHaveBeenCalledWith(requestAction);
    expect(dispatch).toHaveBeenCalledWith(successAction);
  });

  test('Dispatch actions on failure', async () => {
    const {
      invoke,
      store: { dispatch },
    } = create();
    const action = {
      type: 'TEST_MIDDLEWARE_REQUEST',
      payload: 'hello',
      meta: { apiCall: () => Promise.reject({ message: 'failed' }) },
    };
    const requestAction = {
      type: 'TEST_MIDDLEWARE_REQUEST',
      payload: 'hello',
    };
    const failureAction = {
      type: 'TEST_MIDDLEWARE_FAILURE',
      payload: { message: 'failed' },
      error: true,
    };
    await invoke(action);
    expect(dispatch).toHaveBeenCalledWith(requestAction);
    expect(dispatch).toHaveBeenCalledWith(failureAction);
  });
});

describe('Actions with lifecycle meta', () => {
  const actionType = 'ASYNC_GET_TODOS';

  test('Dispatch actions on success', async () => {
    const {
      invoke,
      store: { dispatch },
    } = create();
    const action = {
      type: actionType,
      meta: { apiCall: () => Promise.resolve('some value') },
    };
    const requestAction = {
      type: actionType,
      meta: {
        [META.LIFECYCLE]: LIFECYCLE.REQUEST,
      },
    };
    const successAction = {
      type: actionType,
      payload: 'some value',
      meta: {
        [META.LIFECYCLE]: LIFECYCLE.SUCCESS,
      },
    };
    await invoke(action);

    expect(dispatch).toHaveBeenCalledWith(requestAction);
    expect(dispatch).toHaveBeenCalledWith(successAction);
  });

  test('Dispatch actions on failure', async () => {
    const {
      invoke,
      store: { dispatch },
    } = create();
    const action = {
      type: actionType,
      payload: 'hello',
      meta: { apiCall: () => Promise.reject({ message: 'failed' }) },
    };
    const requestAction = {
      type: actionType,
      payload: 'hello',
      meta: {
        [META.LIFECYCLE]: LIFECYCLE.REQUEST,
      },
    };
    const failureAction = {
      type: actionType,
      payload: { message: 'failed' },
      meta: {
        [META.LIFECYCLE]: LIFECYCLE.FAILURE,
      },
      error: true,
    };
    await invoke(action);
    expect(dispatch).toHaveBeenCalledWith(requestAction);
    expect(dispatch).toHaveBeenCalledWith(failureAction);
  });
});
