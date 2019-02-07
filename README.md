# Redux Api Actions

Redux middleware for dispatching api actions.

### Why Do I Need This?

Standardises the way actions are handled for api calls and cuts down on boilerplate.

### Installing

```
npm install @domtwlee/redux-api-actions
```

To enable apiActions:

```
import { createStore, applyMiddleware } from 'redux';
import { apiActions } from '@domtwlee/redux-api-actions';
import rootReducer from './reducers/index';

const store = createStore(
  rootReducer,
  applyMiddleware(apiActions)
);
```

### How To Use

Dispatch an action suffixed with "REQUEST" in its type and add the relevant apiCall field in meta to trigger the middleware.

```
export const getConsumersRequest = (roleType: string) => ({
  type: "GET_TODOS_REQUEST",
  meta: {
    apiCall: () => fetch('example.com/todos'),
  },
});
```

You can use whatever promise-based API for fetching resources.

This will automatically generate `GET_TODO_SUCCESS` and `GET_TODO_FAILURE` action types, and dispatch the appropriate action upon resolve/reject of the fetch promise.

All the actions objects follow flux-standard-actions https://github.com/redux-utilities/flux-standard-action.

A utility function is included to generate the appropriate action types that you can then use for your actions/reducers.

```
const [
  GET_TODOS_REQUEST,
  GET_TODOS_SUCCESS,
  GET_TODOS_FAILURE,
] = createAsyncActionTypes('consumers', 'GET_CONSUMERS');

// Returns ['consumers/GET_TODOS_REQUEST', 'consumers/GET_TODOS_SUCCESS', 'consumers/GET_TODOS_FAILURE']

function todoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TODO_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_TODO_SUCCESS: {
      return {
        ...state,
        loading: false,
        todos: action.payload,
      };
    }
    case GET_TODO_FAILURE: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
      return state;
  }
}
```

Finally, you have the option to include a normalizr schema to shape the json response from your fetch before the success action is dispatched.
https://github.com/paularmstrong/normalizr

```
import { schema } from 'normalizr';

const todoSchema = new schema.Entity('todos', {}, { idAttribute: 'todoId' });
const todoListSchema = [todoSchema];

export const getConsumersRequest = (roleType: string) => ({
  type: "GET_TODOS_REQUEST",
  meta: {
    apiCall: () => fetch('example.com/todos'),
    schema: todoListSchema,
  },
});
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
