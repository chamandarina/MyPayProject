import {
EXECUTE_PAYMENT,
EXECUTE_PAYMENT_SUCCESS,
EXECUTE_PAYMENT_ERROR
} from '../actions';

export const executePayment = (payment) => ({
  type: EXECUTE_PAYMENT,
  payload: payment
});

export const executePaymentSuccess = (payment) => ({
  type: EXECUTE_PAYMENT_SUCCESS,
  payload: payment
});

export const executePaymentError = (message) => ({
  type: EXECUTE_PAYMENT_ERROR,
  payload: message
});