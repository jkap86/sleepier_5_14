export const filterData = (filter1, filter2, leagues, leaguemates, playershares) => {
    let filteredLeagues;
    let filteredLeaguemates;
    let filteredPlayerShares;
    console.log(leagues)
    switch (filter1) {
        case ('Redraft'):
            filteredLeagues = leagues.filter(x => x.settings.type !== 2);
            filteredLeaguemates = leaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues.filter(x => x.settings.type !== 2)
                }
            })
            filteredPlayerShares = playershares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned.filter(x => x.settings.type !== 2),
                    leagues_taken: player.leagues_taken.filter(x => x.settings.type !== 2),
                    leagues_available: player.leagues_available.filter(x => x.settings.type !== 2)
                }
            })

            break;
        case ('All'):
            filteredLeagues = leagues;
            filteredLeaguemates = leaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues
                }
            })
            filteredPlayerShares = playershares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned,
                    leagues_taken: player.leagues_taken,
                    leagues_available: player.leagues_available
                }
            })

            break;
        case ('Dynasty'):
            filteredLeagues = leagues.filter(x => x.settings.type === 2)
            filteredLeaguemates = leaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues.filter(x => x.settings.type === 2)
                }
            })
            filteredPlayerShares = playershares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned.filter(x => x.settings.type === 2),
                    leagues_taken: player.leagues_taken.filter(x => x.settings.type === 2),
                    leagues_available: player.leagues_available.filter(x => x.settings.type === 2)
                }
            })

            break;
        default:
            filteredLeagues = leagues;
            filteredLeaguemates = leaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues
                }
            })
            filteredPlayerShares = playershares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned,
                    leagues_taken: player.leagues_taken,
                    leagues_available: player.leagues_available
                }
            })

            break;
    }
    let filteredLeagues2 = filteredLeagues
    let filteredLeaguemates2 = filteredLeaguemates
    let filteredPlayerShares2 = filteredPlayerShares

    switch (filter2) {
        case ('Bestball'):
            filteredLeagues2 = filteredLeagues.filter(x => x.settings.best_ball === 1);
            filteredLeaguemates2 = filteredLeaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues.filter(x => x.settings.best_ball === 1)
                }
            })
            filteredPlayerShares2 = filteredPlayerShares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned.filter(x => x.settings.best_ball === 1),
                    leagues_taken: player.leagues_taken.filter(x => x.settings.best_ball === 1),
                    leagues_available: player.leagues_available.filter(x => x.settings.best_ball === 1)
                }
            })

            break;
        case ('All'):
            filteredLeagues2 = filteredLeagues;
            filteredLeaguemates2 = filteredLeaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues
                }
            })
            filteredPlayerShares2 = filteredPlayerShares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned,
                    leagues_taken: player.leagues_taken,
                    leagues_available: player.leagues_available
                }
            })

            break;
        case ('Standard'):
            filteredLeagues2 = filteredLeagues.filter(x => x.settings.best_ball !== 1);
            filteredLeaguemates2 = filteredLeaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues.filter(x => x.settings.best_ball !== 1)
                }
            })
            filteredPlayerShares2 = filteredPlayerShares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned.filter(x => x.settings.best_ball !== 1),
                    leagues_taken: player.leagues_taken.filter(x => x.settings.best_ball !== 1),
                    leagues_available: player.leagues_available.filter(x => x.settings.best_ball !== 1)
                }
            })

            break;
        default:
            filteredLeagues2 = filteredLeagues;
            filteredLeaguemates2 = filteredLeaguemates.map(lm => {
                return {
                    ...lm,
                    leagues: lm.leagues
                }
            })
            filteredPlayerShares2 = filteredPlayerShares.map(player => {
                return {
                    ...player,
                    leagues_owned: player.leagues_owned,
                    leagues_taken: player.leagues_taken,
                    leagues_available: player.leagues_available
                }
            })

            break;
    }

    return {
        leagues: filteredLeagues2,
        leaguemates: filteredLeaguemates2,
        playershares: filteredPlayerShares2
    }
}