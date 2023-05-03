
import { RESET_STATE } from '../actions/actions';

const initialState = {
    isLoading: false,
    syncing: false,
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
        case 'SYNC_LEAGUES_START':
            return { ...state, syncing: true, errorSyncing: null };
        case 'SYNC_LEAGUES_SUCCESS':
            const updated_leagues = state.leagues.map(l => {
                if (l.league_id === action.payload.league_id) {
                    return {
                        ...l,
                        [`matchups_${action.payload.week}`]: action.payload.matchups_new
                    }
                }
                return l
            })
            return {
                ...state,
                leagues: updated_leagues,
                syncing: false
            }
        case 'SYNC_LEAGUES_FAILURE':
            return { ...state, syncing: false, errorSyncing: action.payload }
        case RESET_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
};

export default leaguesReducer