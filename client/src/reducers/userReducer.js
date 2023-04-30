import { RESET_STATE } from '../actions/actions';

const initialState = { isLoading: false, user: {}, error: null };

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USER_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_USER_SUCCESS':
            return { ...state, isLoading: false, user: action.payload };
        case 'FETCH_USER_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case RESET_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default userReducer
