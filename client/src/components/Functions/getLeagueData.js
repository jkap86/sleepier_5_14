export const getLeagueData = (leagues, user_id, state) => {
    let leagues_all = []
    let players_all = {};
    let leaguemates_all = [];
    let matchups_all = [];

    leagues.map(league => {
        const userRoster = league.rosters?.find(r => r.user_id === user_id || r.co_owners?.find(co => co?.user_id === user_id))

        if (userRoster?.players || league.drafts.find(d => ['drafting', 'paused'].includes(d.status))) {
            leagues_all.push({
                ...league,
                userRoster: userRoster
            })
            league.rosters?.map(roster => {
                roster.players?.map(player_id => {
                    let player_leagues = players_all[player_id] || {
                        owned: [],
                        taken: [],
                        available: []
                    }

                    if (roster.user_id === user_id) {
                        player_leagues.owned.push({
                            ...league,
                            userRoster: roster
                        })
                    } else {
                        player_leagues.taken.push({
                            ...league,
                            lmRoster: roster,
                            userRoster: userRoster,

                        })
                    }
                    players_all[player_id] = player_leagues

                })

                roster.draft_picks.map(pick => {
                    const pick_text = `${pick.season}_${pick.round}_${pick.order?.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                    let pick_leagues = players_all[pick_text] || {
                        owned: [],
                        taken: []
                    }

                    if (pick.season === parseInt(state.league_season) && parseInt(pick.order)) {
                        if (roster.user_id === user_id) {
                            pick_leagues.owned.push({
                                ...league,
                                userRoster: roster
                            })
                        } else {
                            pick_leagues.taken.push({
                                ...league,
                                lmRoster: roster,
                                userRoster: userRoster,

                            })
                        }
                        players_all[pick_text] = pick_leagues
                    }

                })

                if (roster.user_id && roster.players) {
                    let leaguemate_leagues = leaguemates_all[roster.user_id] || {
                        user_id: roster.user_id,
                        username: roster.username,
                        avatar: roster.avatar,
                        leagues: []
                    }

                    leaguemate_leagues.leagues.push({
                        ...league,
                        lmRoster: roster,
                        userRoster: userRoster
                    })

                    leaguemates_all[roster.user_id] = leaguemate_leagues
                }
            })
        }
    })

    let player_count_array = []

    Object.keys(players_all).map(player_id => {
        return player_count_array.push({
            id: player_id,
            leagues_owned: players_all[player_id].owned,
            leagues_taken: players_all[player_id].taken,
            leagues_available: player_id.includes('_') ? [] : leagues
                .filter(l => !l.rosters?.find(r => r.players?.includes(player_id)))
                .map(league => {
                    return {
                        ...league,
                        userRoster: league.rosters.find(r => r.user_id === user_id || r.co_owners?.find(co => co?.user_id === user_id))

                    }
                })
        })
    })

    let leaguemate_count_array = []

    Object.keys(leaguemates_all).map(user_id => {
        return leaguemate_count_array.push(leaguemates_all[user_id])
    })

    return {
        leagues: leagues_all,
        players: player_count_array,
        leaguemates: leaguemate_count_array,
        leaguematesDict: leaguemates_all
    }
} 