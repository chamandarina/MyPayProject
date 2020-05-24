
import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';

import {
    EXECUTE_PAYMENT,
    EXECUTE_LOAN,
    FETCH_CUSTOMER
} from '../actions';

import {
    executePaymentSuccess,
    executePaymentError,
    executeLoanSuccess,
    executeLoanError,
    fetchCustomerSuccess,
    fetchCustomerError
} from './actions';

import { PaymentService } from '../../services/PaymentService';
import { ReportingService } from '../../services/ReportingService';


export function* watchExecutePayment() {
    yield takeEvery(EXECUTE_PAYMENT, executePayment);
}

const startExecutingPayment = async (payment) => {
    const paymentService = new PaymentService();
    return await paymentService.executePayment(payment)
        .then(payment => payment)
        .catch(error => error);;
}

function* executePayment(payment) {
    try {
        const paymentExecuted = yield call(startExecutingPayment, payment.payload);
        console.log(paymentExecuted.data, 'olaaa payment')
        if (!paymentExecuted.message) {
            yield put(executePaymentSuccess(paymentExecuted.data));
            //history.push('/');
        } else {
            yield put(executePaymentError(paymentExecuted.message));
        }
    } catch (error) {
        yield put(executePaymentError(error));
    }
}


export function* watchExecuteLoan() {
    yield takeEvery(EXECUTE_LOAN, executeLoan);
}

const startExecutingLoan = async (loan) => {
    const paymentService = new PaymentService();
    return await paymentService.executeLoan(loan)
        .then(loan => loan)
        .catch(error => error);;
}

function* executeLoan(loan) {
    try {
        const loanExecuted = yield call(startExecutingLoan, loan.payload);
        if (!loanExecuted.message) {
            yield put(executeLoanSuccess(loanExecuted.data));
            //history.push('/');
        } else {
            yield put(executeLoanError(loanExecuted.message));
        }
    } catch (error) {
        yield put(executeLoanError(error));
    }
}

export function* watchFetchCustomer() {
    yield takeLatest(FETCH_CUSTOMER, fetchCustomer);
}

const startFetchingCustomer = async (userId) => {
    const reportingService = new ReportingService();
    return await reportingService.fetchCustomer(userId)
        .then(res => res)
        .catch(error => error);;
}

function* fetchCustomer(userId) {
    try {
        const customer = yield call(startFetchingCustomer, userId.payload);
        if (!customer.message) {
            yield put(fetchCustomerSuccess(customer.data));
            //history.push('/');
        } else {
            yield put(fetchCustomerError(customer.message));
        }
    } catch (error) {
        yield put(fetchCustomerError(error));
    }
}


export default function* rootSaga() {
	yield all([
        fork(watchExecutePayment),
        fork(watchExecuteLoan),
        fork(watchFetchCustomer)
	]);
}