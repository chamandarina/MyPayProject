import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import surveyListApp from './surveyList/reducer';
import surveyDetailApp from './surveyDetail/reducer';


const reducers = combineReducers({
  menu,
  settings,
  authUser,
  surveyListApp,
  surveyDetailApp
});

export default reducers;