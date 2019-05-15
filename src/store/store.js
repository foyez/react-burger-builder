import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import burgerBuilderReducer from './reducers/burgerBuilder';
import orderReducer from './reducers/order';
import authReducer from './reducers/auth';
import { watchAuth, watchBurgerBuilder, watchOrder } from './sagas/index';

const composeEnhancers =
	process.env.NODE_ENV === 'development'
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		: null || compose;

const rootReducer = combineReducers({
	burgerBuilder: burgerBuilderReducer,
	order: orderReducer,
	auth: authReducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchBurgerBuilder);
sagaMiddleware.run(watchOrder);

export default store;
