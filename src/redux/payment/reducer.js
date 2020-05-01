import {
    EXECUTE_PAYMENT,
    EXECUTE_PAYMENT_SUCCESS,
    EXECUTE_PAYMENT_ERROR
} from '../actions';

const INIT_STATE = {
    loading: false,
    paymentList = [],
    payment = null,
    error = ''
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case EXECUTE_PAYMENT:
            return { ...state, loading: true, payment: action.payload, error: '' };
        case EXECUTE_PAYMENT_SUCCESS: {
            const listOfPayments = state.paymentList;
            listOfPayments.push(action.payload);
            return { ...state, loading: false, paymentList: listOfPayments, error: ''};
        }
        case EXECUTE_PAYMENT_ERROR:
            return { ...state, loading: false, error: action.payload.message};

        default: return { ...state };
    }
}
