import { RESET_STATE } from '../actions/actions';

const initialState = {
    isLoading: false,
    lmTrades: {
        count: 0,
        trades: []
    },
    error: null
};


const lmTradesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_LMTRADES_START':
            console.log(action.type)
            return { ...state, isLoading: true, error: null };

        case 'FETCH_LMTRADES_SUCCESS':
            console.log(action.type)
            return {
                ...state,
                lmTrades: {
                    count: action.payload.count,
                    trades: [...state.lmTrades.trades, ...action.payload.trades]
                },
                isLoading: false
            };
        case 'FETCH_LMTRADES_FAILURE':
            console.log(action.type)
            return { ...state, isLoading: false, error: action.payload };
        case RESET_STATE:
            console.log('RESETTING STATE')
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default lmTradesReducer