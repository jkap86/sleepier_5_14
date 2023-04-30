import { RESET_STATE } from '../actions/actions';

const initialState = {
    isLoading: false,
    dynastyValues: [],
    error: null
};

const dynastyValuesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DYNASTY_VALUES_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_DYNASTY_VALUES_SUCCESS':
            return {
                ...state,
                isLoading: false,
                dynastyValues: action.payload,
                error: null
            };
        case 'FETCH_DYNASTY_VALUES_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case RESET_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default dynastyValuesReducer;