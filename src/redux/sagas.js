import { all } from 'redux-saga/effects';
import authSagas from './auth/saga';
import surveyListSagas from './surveyList/saga';
import surveyDetailSagas from './surveyDetail/saga';



export default function* rootSaga(getState) {
  yield all([
    authSagas(),
    surveyListSagas(),
    surveyDetailSagas()
  ]);
}
