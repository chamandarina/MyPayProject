import {
EXECUTE_PAYMENT,
EXECUTE_PAYMENT_SUCCESS,
EXECUTE_PAYMENT_ERROR,
EXECUTE_LOAN,
EXECUTE_LOAN_SUCCESS,
EXECUTE_LOAN_ERROR,
FETCH_CUSTOMER,
FETCH_CUSTOMER_SUCCESS,
FETCH_CUSTOMER_ERROR,
NOTIFICATION_RESET
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

export const executeLoan = (loan) => ({
  type: EXECUTE_LOAN,
  payload: loan
});

export const executeLoanSuccess = (loan) => ({
  type: EXECUTE_LOAN_SUCCESS,
  payload: loan
});

export const executeLoanError = (message) => ({
  type: EXECUTE_LOAN_ERROR,
  payload: message
});

export const fetchCustomer = (userId) => ({
  type: FETCH_CUSTOMER,
  payload: userId
});

export const fetchCustomerSuccess = (customer) => ({
  type: FETCH_CUSTOMER_SUCCESS,
  payload: customer
});

export const fetchCustomerError = (message) => ({
  type: FETCH_CUSTOMER_ERROR,
  payload: message
});

export const resetNotificationCount = () => ({
  type: NOTIFICATION_RESET
});