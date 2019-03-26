import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';

import * as actions from '../actions/index';

export function* initIngredientsSaga (action) {
	try {
		const res = yield axios.get('/ingredients.json');
		yield put(actions.setIngredients(res.data));
	} catch (error) {
		yield put(actions.fetchIngredientsFailed());
	}
}
