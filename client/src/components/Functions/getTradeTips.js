export const getTradeTips = (trades, leagues, leaguemates, season) => {

    let trade_tips = trades.map(trade => {

        let trade_away = []

        Object.keys(trade.adds || {}).map(add => {
            const lm_user_id = trade.adds[add]

            return leagues
                .filter(league =>
                    league.rosters.find(r => r.user_id === lm_user_id) && league.userRoster.user_id !== lm_user_id
                    && league.userRoster.players?.includes(add)
                    && league.league_id !== trade.leagueLeagueId
                )
                .map(league => {
                    return trade_away.push({
                        type: 'player',
                        player_id: add,
                        manager: {
                            user_id: lm_user_id,
                            username: leaguemates[lm_user_id]?.username,
                            avatar: leaguemates[lm_user_id]?.avatar
                        },
                        league: {
                            league_id: league.league_id,
                            name: league.name,
                            avatar: league.avatar,
                            roster_positions: league.roster_positions
                        },
                        userRoster: league.userRoster,
                        lmRoster: league.rosters.find(r => r.user_id === lm_user_id)
                    })
                })
        })

        trade.draft_picks.map(pick => {
            const lm_user_id = pick.new_user.user_id
            return leagues
                .filter(league =>
                    league.rosters.find(r => r.user_id === lm_user_id) && league.userRoster.user_id !== lm_user_id
                    &&
                    league.userRoster?.draft_picks?.find(pickLM => {
                        return parseInt(pick.season) === pickLM.season && pick.round === pickLM.round && (parseInt(pick.season) !== parseInt(season) || pick.order === pickLM.order)
                    })
                    && league.league_id !== trade.leagueLeagueId
                )
                .map(league => {
                    return trade_away.push({
                        type: 'pick',
                        player_id: pick,
                        manager: {
                            user_id: lm_user_id,
                            username: leaguemates[lm_user_id]?.username,
                            avatar: leaguemates[lm_user_id]?.avatar
                        },
                        league: {
                            league_id: league.league_id,
                            name: league.name,
                            avatar: league.avatar,
                            roster_positions: league.roster_positions
                        },
                        userRoster: league.userRoster,
                        lmRoster: league.rosters.find(r => r.user_id === lm_user_id)
                    })
                })
        })

        let acquire = []

        Object.keys(trade.drops || {}).map(drop => {
            const lm_user_id = trade.drops[drop]

            return leagues
                .filter(league =>
                    league.rosters.find(r => r.user_id === lm_user_id) && league.userRoster.user_id !== lm_user_id
                    &&
                    (
                        league.rosters?.find(r => r.roster_id !== league.userRoster.roster_id && (r.user_id === lm_user_id || r.co_owners?.find(co => co.user_id === lm_user_id)))?.players?.includes(drop)
                        && league.league_id !== trade.leagueLeagueId

                    )
                )
                .map(league => {
                    return acquire.push({
                        type: 'player',
                        player_id: drop,
                        manager: {
                            user_id: lm_user_id,
                            username: leaguemates[lm_user_id]?.username,
                            avatar: leaguemates[lm_user_id]?.avatar
                        },
                        league: {
                            league_id: league.league_id,
                            name: league.name,
                            avatar: league.avatar,
                            roster_positions: league.roster_positions
                        },
                        userRoster: league.userRoster,
                        lmRoster: league.rosters.find(r => r.user_id === lm_user_id)
                    })
                })
        })

        trade.draft_picks.map(pick => {
            const lm_user_id = pick.old_user.user_id
            return leagues
                .filter(league =>
                    league.rosters.find(r => r.user_id === lm_user_id) && league.userRoster.user_id !== lm_user_id
                    &&
                    league.rosters?.find(r => r.roster_id !== league.userRoster.roster_id && (r.user_id === lm_user_id || r.co_owners?.find(co => co.user_id === lm_user_id)))?.draft_picks?.find(pickLM => {
                        return parseInt(pick.season) === pickLM.season && pick.round === pickLM.round && (pick.order === pickLM.order)
                    })
                    && league.league_id !== trade.leagueLeagueId
                )
                .map(league => {
                    return acquire.push({
                        type: 'pick',
                        player_id: pick,
                        manager: {
                            user_id: lm_user_id,
                            username: leaguemates[lm_user_id]?.username,
                            avatar: leaguemates[lm_user_id]?.avatar
                        },
                        league: {
                            league_id: league.league_id,
                            name: league.name,
                            avatar: league.avatar,
                            roster_positions: league.roster_positions
                        },
                        userRoster: league.userRoster,
                        lmRoster: league.rosters.find(r => r.user_id === lm_user_id)
                    })
                })
        })

        return {
            ...trade,
            tips: {
                acquire: acquire,
                trade_away: trade_away
            }
        }
    })


    return trade_tips
}