import { RESET_STATE } from '../actions/actions';

const initialState = {
    isLoading: false,
    stats: {},
    teamStats: {},
    error: null
};

const statsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_STATS_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_STATS_SUCCESS':
            if (action.payload.league) {
                console.log({ league: action.payload.league })
                return {
                    ...state,
                    isLoading: false,
                    teamStats: action.payload,
                    error: null
                }
            } else {
                console.log({ noleague: action.payload.league })
                return {
                    ...state,
                    isLoading: false,
                    stats: action.payload,
                    error: null
                }
            };
        case 'FETCH_STATS_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        case RESET_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default statsReducer;