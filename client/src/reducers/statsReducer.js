const initialState = {
    isLoading: false,
    stats: {},
    error: null
};

const statsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_STATS_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_STATS_SUCCESS':
            return {
                ...state,
                isLoading: false,
                stats: action.payload,
                error: null
            };
        case 'FETCH_STATS_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export default statsReducer;