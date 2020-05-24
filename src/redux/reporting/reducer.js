import {
    EXECUTE_PAYMENT,
    EXECUTE_PAYMENT_SUCCESS,
    EXECUTE_PAYMENT_ERROR,
    EXECUTE_LOAN,
    EXECUTE_LOAN_SUCCESS,
    EXECUTE_LOAN_ERROR,
    FETCH_CUSTOMER,
    FETCH_CUSTOMER_ERROR,
    FETCH_CUSTOMER_SUCCESS,
    NOTIFICATION_RESET
} from '../actions';

const INIT_STATE = {
    loading: false,
    customer: null,
    portfolio: null,
    payments: [],
    payment: null,
    error: '',
    loans: [],
    loan: null,
    userId: 0,
    chartDataPayments:[],
    chartDataLoans:[],
    notifications:[],
    notificationCount: 0
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case EXECUTE_PAYMENT:
            return { ...state, loading: true, payment: action.payload, error: '' };
        case EXECUTE_PAYMENT_SUCCESS: {
            const date = new Date();
            const month = date.getMonth();
            const chartDataPayments = [...state.chartDataPayments];
            chartDataPayments[month] = chartDataPayments[month] + action.payload.amount;
            let notification = {
                title: 'Payment has been executed! It is total $'+ action.payload.amount+'.',
                date: action.payload.date,
                id: Math.floor(Math.random() * 1001) 
            }
            return { 
                ...state, 
                payments: [...state.payments, action.payload],
                chartDataPayments: [...chartDataPayments],
                notifications: [notification, ...state.notifications],
                notificationCount: state.notificationCount + 1,
                loading: false, 
                error: ''};
        }
        case EXECUTE_PAYMENT_ERROR:
            return { ...state, loading: false, error: action.payload.message};
        
        case EXECUTE_LOAN:
            return { ...state, loading: true, payment: action.payload, error: '' };
        case EXECUTE_LOAN_SUCCESS: {
            const date = new Date();
            const month = date.getMonth();
            const chartDataLoans = [...state.chartDataLoans];
            chartDataLoans[month] = chartDataLoans[month] + action.payload.amount;
            let notification = {
                title: 'Loan has been executed! It is total $'+ action.payload.amount+'.',
                date: action.payload.date,
                id: Math.floor(Math.random() * 1001) 
            }
            return { 
                ...state, 
                loans: [...state.loans, action.payload],
                chartDataLoans: [...chartDataLoans],
                notifications: [notification, ...state.notifications],
                notificationCount: state.notificationCount + 1,
                loading: false,
                error: ''};
        }
        case EXECUTE_LOAN_ERROR:
            return { ...state, loading: false, error: action.payload.message};

        case FETCH_CUSTOMER:
        return { ...state, userId: action.payload, loading: true, error: '' };

        case FETCH_CUSTOMER_SUCCESS: {
            return { 
                ...state, 
                loading: false, 
                customer: action.payload.customer,
                loans: action.payload.loans, 
                payments: action.payload.payments,
                chartDataPayments: action.payload.chartDataPayments,
                chartDataLoans: action.payload.chartDataLoans,
                notifications: action.payload.notifications,
                notificationCount: state.notificationCount,
                error: ''};
        }
        case FETCH_CUSTOMER_ERROR:
            return { ...state, loading: false, error: action.payload.message};

        case NOTIFICATION_RESET:
            return { ...state, loading: false, notificationCount: 0};

        default: return { ...state };
    }
}
