
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';

import { auth } from '../../helpers/Firebase';
import {AuthService} from '../../helpers/IdentityServer.js';
import {
    LOGIN_USER,
    REGISTER_USER,
    LOGOUT_USER,
    FORGOT_PASSWORD,
    RESET_PASSWORD,
} from '../actions';

import {
    loginUserSuccess,
    loginUserError,
    registerUserSuccess,
    registerUserError,
    forgotPasswordSuccess,
    forgotPasswordError,
    resetPasswordSuccess,
    resetPasswordError,
    logoutUserSucess,
    logoutUserError
} from './actions';


export function* watchLoginUser() {
    yield takeEvery(LOGIN_USER, loginWithUsernamePassword);
}

const loginWithEmailPasswordAsync = async (email, password) =>
    await AuthService.signInWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);


const postCall = async (data) => {
    const response = await fetch('http://localhost:5000/api/auth', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:3000',
        //   'Access-Control-Allow-Credentials': true,
        //   'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      });

      return response;
}

async function login() {
    const auth = new AuthService();
    const user =  await auth.login();
    console.log(user, 'user');
    return user;
}


const loginWithUsernamePasswordAsync = async (username, password) =>
await postCall ({
    username: username,
    password: password,
    returnUrl: 'http://localhost:3000'
  })
    .then(authUser => authUser)
    .catch(error => error);

    


function* loginWithUsernamePassword({ payload }) {
    const { username, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(startSinginAsync);
        if (!loginUser.message) {
            console.log(loginUser, 'user');
            // const auth = new AuthService();
            // const user = yield call(singinAsync, history);
            // console.log(user, 'userchina')
            //localStorage.setItem('user_id', loginUser.user.uid);
            //yield put(loginUserSuccess(loginUser.user));
            //history.push('/');
        } else {
            //yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));

    }
}

const startSinginAsync = async () => {
    const auth = new AuthService();
    await auth.login().then(authUser => {console.log(authUser, 'kokoda')}).catch(error => error);
}

const singinAsync = async (history) => {
    const auth = new AuthService();
    await auth.completeLogin('http://localhost:5000/api/auth').then(authUser => {console.log(authUser, 'kokoda')}).catch(error => error);
    history.push('/')
}


function* loginWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    try {
        const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
        if (!loginUser.message) {
            localStorage.setItem('user_id', loginUser.user.uid);
            yield put(loginUserSuccess(loginUser.user));
            history.push('/');
        } else {
            yield put(loginUserError(loginUser.message));
        }
    } catch (error) {
        yield put(loginUserError(error));

    }
}


export function* watchRegisterUser() {
    yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (email, password) =>
    await auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => authUser)
        .catch(error => error);

function* registerWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload
    try {
        const registerUser = yield call(registerWithEmailPasswordAsync, email, password);
        if (!registerUser.message) {
            localStorage.setItem('user_id', registerUser.user.uid);
            yield put(registerUserSuccess(registerUser));
            history.push('/')
        } else {
            yield put(registerUserError(registerUser.message));

        }
    } catch (error) {
        yield put(registerUserError(error));
    }
}



export function* watchLogoutUser() {
    yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
    const auth = new AuthService();
    await auth.logout().then(authUser => authUser).catch(error => error);
}

function* logout({ payload }) {
    const { history } = payload
    try {
        const response = yield call(logoutAsync, history);
        if (!response.message) {
            yield put(logoutUserSucess);
            history.push('/');
        } else {
            yield put(logoutUserError(response.message));
        }
    } catch (error) {
    }
}

export function* watchForgotPassword() {
    yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
    return await auth.sendPasswordResetEmail(email)
        .then(user => user)
        .catch(error => error);
}

function* forgotPassword({ payload }) {
    const { email } = payload.forgotUserMail;
    try {
        const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
        if (!forgotPasswordStatus) {
            yield put(forgotPasswordSuccess("success"));
        } else {
            yield put(forgotPasswordError(forgotPasswordStatus.message));
        }
    } catch (error) {
        yield put(forgotPasswordError(error));

    }
}

export function* watchResetPassword() {
    yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
    return await auth.confirmPasswordReset(resetPasswordCode, newPassword)
        .then(user => user)
        .catch(error => error);
}

function* resetPassword({ payload }) {
    const { newPassword, resetPasswordCode } = payload;
    try {
        const resetPasswordStatus = yield call(resetPasswordAsync, resetPasswordCode, newPassword);
        if (!resetPasswordStatus) {
            yield put(resetPasswordSuccess("success"));
        } else {
            yield put(resetPasswordError(resetPasswordStatus.message));
        }
    } catch (error) {
        yield put(resetPasswordError(error));

    }
}

export default function* rootSaga() {
    yield all([
        fork(watchLoginUser),
        fork(watchLogoutUser),
        fork(watchRegisterUser),
        fork(watchForgotPassword),
        fork(watchResetPassword),
    ]);
}