const initialState = {
    isLoading: false,
    searches: [],
    error: null
};

const filteredLmTradesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_FILTERED_LMTRADES_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_FILTERED_LMTRADES_SUCCESS':
            const existing_trades = state.searches.find(s => s.player === action.payload.player && s.manager === action.payload.manager)?.trades || []

            const updated_search = {
                player: action.payload.player,
                manager: action.payload.manager,
                count: action.payload.count,
                trades: [...existing_trades, ...action.payload.trades]
            }

            return { ...state, isLoading: false, searches: [...state.searches.filter(s => !(s.player === action.payload.player && s.manager === action.payload.manager)), updated_search] };
        case 'FETCH_FILTERED_LMTRADES_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export default filteredLmTradesReducer;

