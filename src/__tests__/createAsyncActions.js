import { createAsyncActionTypes } from '../index';

test('Create async action types', () => {
  const actionTypes = createAsyncActionTypes('test', 'GET_STUFF');
  const expectedActions = [
    'test/GET_STUFF_REQUEST',
    'test/GET_STUFF_SUCCESS',
    'test/GET_STUFF_FAILURE',
  ];

  expect(actionTypes).toEqual(expectedActions);
});
