const initialState = {
    isLoading: false,
    pricecheckTrades: [],
    error: null
};

const pricecheckTradesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_PRICECHECK_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_PRICECHECK_SUCCESS':
            const existing_trades = state.pricecheckTrades.find(s => s.pricecheck_player === action.payload.pricecheck_player && s.pricecheck_player2 === action.payload.pricecheck_player2)?.trades || []

            const updated_search = {
                pricecheck_player: action.payload.pricecheck_player,
                pricecheck_player2: action.payload.pricecheck_player2,
                count: action.payload.count,
                trades: [...existing_trades, ...action.payload.trades]
            }

            return { ...state, isLoading: false, pricecheckTrades: [...state.pricecheckTrades.filter(s => !(s.player === action.payload.player && s.manager === action.payload.manager)), updated_search] };
        case 'FETCH_PRICECHECK_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export default pricecheckTradesReducer;