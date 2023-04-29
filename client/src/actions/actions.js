import axios from 'axios';
import { getLeagueData } from '../components/Functions/getLeagueData';
import { getTradeTips } from '../components/Functions/getTradeTips';
import { filterData } from '../components/Functions/filterData';

export const fetchUser = (username) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_USER_START' });

        try {
            const response = await axios.post('/user/create', { username });
            if (!response.data?.error) {
                dispatch({ type: 'FETCH_USER_SUCCESS', payload: response.data[0] });
            } else {
                dispatch({ type: 'FETCH_USER_FAILURE', payload: response.data });
            }
        } catch (error) {
            dispatch({ type: 'FETCH_USER_FAILURE', payload: error.message });
        }
    };
};


export const fetchLeagues = (user_id) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_LEAGUES_START' });

        try {
            const [home, leagues] = await Promise.all([
                axios.get('/home'),
                axios.post('/league/find', { user_id: user_id }),
            ]);

            const data = getLeagueData(leagues.data, user_id, home.data.state)

            dispatch({
                type: 'FETCH_LEAGUES_SUCCESS', payload: {
                    state: home.data.state,
                    allPlayers: home.data.allplayers,
                    schedule: home.data.schedule,
                    leagues: data.leagues,
                    playerShares: data.players,
                    leaguemates: data.leaguemates,
                    leaguematesDict: data.leaguematesDict,
                }
            })

        } catch (error) {
            dispatch({ type: 'FETCH_LEAGUES_FAILURE', payload: error.message });
        }
    };
};

export const fetchLmTrades = (user_id, leaguemates, leagues, season, offset, limit) => {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_LMTRADES_START' });

        try {
            const trades = await axios.post('/trade/leaguemate', {
                user_id: user_id,
                leaguemates: leaguemates,
                offset: offset,
                limit: limit
            })

            const trades_tips = getTradeTips(trades.data.rows, leagues, leaguemates, season)

            dispatch({
                type: 'FETCH_LMTRADES_SUCCESS', payload: {
                    count: trades.data.count,
                    trades: trades_tips
                }
            });
        } catch (error) {
            dispatch({ type: 'FETCH_LMTRADES_ERROR', payload: error.message })
        }
    }
}

export const fetchFilteredLmTrades = (searchedPlayerId, searchedManagerId, league_season, offset, limit) => async (dispatch, getState) => {
    dispatch({ type: 'FETCH_FILTERED_LMTRADES_START' });

    const state = getState();

    const { user, leagues } = state;

    try {
        const trades = await axios.post('/trade/leaguemate', {
            user_id: user.user_id,
            leaguemates: Object.keys(leagues.leaguematesDict),
            player: searchedPlayerId,
            manager: searchedManagerId,
            offset: offset,
            limit: limit,
        });

        const trades_tips = getTradeTips(trades.data.rows, leagues.leagues, leagues.leaguematesDict, league_season)
        console.log(trades_tips)
        dispatch({
            type: 'FETCH_FILTERED_LMTRADES_SUCCESS',
            payload: {
                player: searchedPlayerId,
                manager: searchedManagerId,
                trades: trades_tips,
                count: trades.data.count,
            },
        });
    } catch (error) {
        dispatch({ type: 'FETCH_FILTERED_LMTRADES_FAILURE', payload: error.message });
    }


};

export const fetchPriceCheckTrades = (pricecheck_player, pricecheck_player2, offset, limit) => async (dispatch, getState) => {
    dispatch({ type: 'FETCH_PRICECHECK_START' });

    const state = getState();

    const { user, leagues } = state;

    try {
        const player_trades = await axios.post('/trade/pricecheck', {
            player: pricecheck_player,
            player2: pricecheck_player2,
            offset: offset,
            limit: limit
        })

        const trades_tips = getTradeTips(player_trades.data.rows, leagues.leagues, leagues.leaguematesDict, leagues.state.league_season)
        console.log(trades_tips)
        dispatch({
            type: 'FETCH_PRICECHECK_SUCCESS',
            payload: {
                pricecheck_player: pricecheck_player,
                pricecheck_player2: pricecheck_player2,
                trades: trades_tips,
                count: player_trades.data.count,
            },
        });
    } catch (error) {
        dispatch({ type: 'FETCH_PRICECHECK_FAILURE', payload: error.message });
    }

};

export const fetchFilteredData = (type1, type2, leagues, leaguemates, playerShares) => async (dispatch) => {
    dispatch({ type: 'FETCH_FILTERED_DATA_START' });

    try {
        const filteredData = filterData(type1, type2, leagues, leaguemates, playerShares);

        console.log(filteredData)
        dispatch({
            type: 'FETCH_FILTERED_DATA_SUCCESS',
            payload: {
                leagues: filteredData.leagues,
                playershares: filteredData.playershares,
                leaguemates: filteredData.leaguemates
            }
        });
    } catch (error) {
        dispatch({ type: 'FETCH_FILTERED_DATA_FAILURE', payload: error.message });
    }
};

export const fetchStats = (trendDateStart, trendDateEnd, players) => async (dispatch) => {
    dispatch({ type: 'FETCH_STATS_START' })
    console.log('getting stats')
    try {
        const stats = await axios.post('/dynastyrankings/stats', {
            players: players,
            date1: trendDateStart,
            date2: trendDateEnd
        });

        console.log(stats.data)

        dispatch({ type: 'FETCH_STATS_SUCCESS', payload: stats.data })
    } catch (error) {
        dispatch({ type: 'FETCH_STATS_FAILURE', payload: error.message })
    }
};

export const fetchValues = (trendDateStart, trendDateEnd, dates) => async (dispatch, getState) => {
    dispatch({ type: 'FETCH_DYNASTY_VALUES_START' })

    let dynastyValues;
    try {
        if (dates) {
            dynastyValues = await axios.post('/dynastyrankings/findrange', {
                dates: dates
            })
        } else {
            dynastyValues = await axios.post('/dynastyrankings/find', {

                date1: trendDateStart,
                date2: trendDateEnd
            });
        }
        dispatch({ type: 'FETCH_DYNASTY_VALUES_SUCCESS', payload: dynastyValues.data })
    } catch (error) {
        dispatch({ type: 'FETCH_DYNASTY_VALUES_FAILURE', payload: error.message })
    }
};

export const setType1 = (type1) => ({
    type: 'SET_TYPE1',
    payload: type1,
});

export const setType2 = (type2) => ({
    type: 'SET_TYPE2',
    payload: type2,
});

export const setTab = (tab) => ({
    type: 'SET_TAB',
    payload: tab
})

export const setTrendDateStart = (date) => ({
    type: 'SET_TRENDDATESTART',
    payload: date
});

export const setTrendDateEnd = (date) => ({
    type: 'SET_TRENDDATEEND',
    payload: date
})

export const uploadRankings = (uploadedRankings) => ({
    type: 'UPLOAD_RANKINGS',
    payload: uploadedRankings
})

