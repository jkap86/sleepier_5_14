const initialState = {
    isLoading: false,
    leaguesFiltered: [],
    playersharesFiltered: [],
    leaguematesFiltered: [],
    error: null
};

const filteredDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_FILTERED_DATA_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_FILTERED_DATA_SUCCESS':
            return {
                ...state,
                leaguesFiltered: action.payload.leagues,
                playersharesFiltered: action.payload.playershares,
                leaguematesFiltered: action.payload.leaguemates,
                isLoading: false
            };
        case 'FETCH_FILTERED_DATA_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export default filteredDataReducer;

