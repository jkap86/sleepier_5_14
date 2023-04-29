const initialState = {
    isLoading: false,
    state: {},
    allPlayers: {},
    nflSchedule: {},
    leagues: [],
    playerShares: [],
    leaguemates: [],
    leaguematesDict: {},
    error: null
};


const leaguesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_LEAGUES_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_LEAGUES_SUCCESS':
            return {
                ...state,
                state: action.payload.state,
                allPlayers: action.payload.allPlayers,
                nflSchedule: action.payload.schedule,
                leagues: action.payload.leagues,
                playerShares: action.payload.playerShares,
                leaguemates: action.payload.leaguemates,
                leaguematesDict: action.payload.leaguematesDict,
                isLoading: false
            };
        case 'FETCH_LEAGUES_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export default leaguesReducer