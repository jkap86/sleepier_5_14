'use strict';
const db = require("../models");
const League = db.leagues;
const User = db.users;
const axios = require('../api/axiosInstance');

exports.sync = async (req, res, app) => {
    const state = app.get('state')
    const matchups = await axios.get(`https://api.sleeper.app/v1/league/${req.body.league_id}/matchups/${state.display_week}`)
    await League.update({ [`matchups_${state.display_week}`]: matchups.data }, {
        where: {
            league_id: req.body.league_id
        }
    })
    res.send(matchups.data)
}

exports.draft = async (req, res, app) => {
    let active_draft;
    let league;
    let league_drafts;
    try {
        league = await axios.get(`https://api.sleeper.app/v1/league/${req.body.league_id}`)
        league_drafts = await axios.get(`https://api.sleeper.app/v1/league/${req.body.league_id}/drafts`)
        active_draft = league_drafts.data?.find(d => d.settings.slots_k > 0 && d.settings.rounds > league.data.settings.draft_rounds)
    } catch (error) {
        console.log(error.message)
    }


    if (active_draft) {
        const allplayers = app.get('allplayers')
        const draft_picks = await axios.get(`https://api.sleeper.app/v1/draft/${active_draft.draft_id}/picks`)
        const users = await axios.get(`https://api.sleeper.app/v1/league/${req.body.league_id}/users`)
        const teams = Object.keys(active_draft.draft_order).length

        const picktracker = draft_picks.data.filter(pick => pick.metadata.position === "K").map((pick, index) => {
            return {
                pick: Math.floor(index / teams) + 1 + "." + ((index % teams) + 1).toLocaleString("en-US", { minimumIntegerDigits: 2 }),
                player: allplayers[pick.player_id]?.full_name,
                player_id: pick.player_id,
                picked_by: users.data.find(u => u.user_id === pick.picked_by)?.display_name,
                picked_by_avatar: users.data.find(u => u.user_id === pick.picked_by)?.avatar
            }
        })

        res.send({
            league: league.data,
            picks: picktracker
        })

    } else {
        res.send([])
    }
}

exports.find = async (req, res) => {
    let state = await axios.get('https://api.sleeper.app/v1/state/nfl')
    state = state.data
    let leagues = await axios.get(`https://api.sleeper.app/v1/user/${req.body.user_id}/leagues/nfl/${state.league_season}`)

    const league_ids = []
    leagues.data.map((league, index) => {
        return league_ids[index] = league.league_id
    })

    const [leagues_to_add, leagues_to_update, leagues_up_to_date] = await getLeaguesToUpsert(req.body.user_id, league_ids)


    let new_leagues = await getBatchLeaguesDetails(leagues_to_add, state.display_week)
    let updated_leagues = await getBatchLeaguesDetails(leagues_to_update, state.display_week)


    try {
        const keys = ["name", "avatar", "settings", "scoring_settings", "roster_positions",
            "rosters", "drafts", "updatedAt"]

        if (state.display_week > 0 && state.display_week < 19) {
            keys.push(`matchups_${state.display_week}`)
        }

        await League.bulkCreate([...new_leagues, ...updated_leagues].flat(), {
            updateOnDuplicate: keys
        })
    } catch (error) {
        console.log(error)
    }

    const leagues_all = (
        [...new_leagues, ...updated_leagues, ...leagues_up_to_date]
            .map(league => {
                league["index"] = league_ids.indexOf(league.league_id)
                return league
            })
    )

    res.send(leagues_all.sort((a, b) => a.index - b.index))

}

const getDraftPicks = (traded_picks, rosters, users, drafts, league) => {
    let draft_season;
    if (!drafts.find(x => x.status === 'pre_draft' && x.settings.rounds === league.settings.draft_rounds)) {
        draft_season = parseInt(league.season) + 1
    } else {
        draft_season = parseInt(league.season)
    }

    const draft_order = drafts.find(x => x.status !== 'complete' && x.settings.rounds === league.settings.draft_rounds)?.draft_order

    let original_picks = {}

    for (let i = 0; i < rosters.length; i++) {
        original_picks[rosters[i].roster_id] = []
        for (let j = parseInt(draft_season); j <= parseInt(draft_season) + 2; j++) {

            for (let k = 1; k <= league.settings.draft_rounds; k++) {
                const original_user = users.find(u => u.user_id === rosters[i].owner_id)

                if (!traded_picks.find(pick => parseInt(pick.season) === j && pick.round === k && pick.roster_id === rosters[i].roster_id)) {
                    original_picks[rosters[i].roster_id].push({
                        season: j,
                        round: k,
                        roster_id: rosters[i].roster_id,
                        original_user: {
                            avatar: original_user?.avatar || null,
                            user_id: original_user?.user_id || '0',
                            username: original_user?.display_name || 'Orphan'
                        },
                        order: draft_order && draft_order[original_user?.user_id]
                    })
                }
            }
        }

        traded_picks.filter(x => x.owner_id === rosters[i].roster_id)
            .map(pick => {
                const original_user = users.find(u => rosters.find(r => r.roster_id === pick.roster_id)?.owner_id === u.user_id)
                return original_picks[rosters[i].roster_id].push({
                    season: parseInt(pick.season),
                    round: pick.round,
                    roster_id: pick.roster_id,
                    original_user: {
                        avatar: original_user?.avatar || null,
                        user_id: original_user?.user_id || '0',
                        username: original_user?.display_name || 'Orphan'
                    },
                    order: draft_order && draft_order[original_user?.user_id]
                })
            })

        traded_picks.filter(x => x.previous_owner_id === rosters[i].roster_id)
            .map(pick => {
                const index = original_picks[rosters[i].roster_id].findIndex(obj => {
                    return obj.season === pick.season && obj.round === pick.round && obj.roster_id === pick.roster_id
                })

                if (index !== -1) {
                    original_picks[rosters[i].roster_id].splice(index, 1)
                }
            })
    }



    return original_picks
}

const getLeagueDetails = async (league_id, display_week) => {
    try {
        const league = await axios.get(`https://api.sleeper.app/v1/league/${league_id}`)
        const users = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/users`)
        const rosters = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/rosters`)
        const drafts = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/drafts`)
        const traded_picks = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/traded_picks`)

        let matchups = {};
        if (display_week > 0 && display_week < 19) {
            const matchup_week = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/matchups/${display_week}`)
            matchups[`matchups_${display_week}`] = matchup_week.data
        }

        const draft_picks = getDraftPicks(traded_picks.data, rosters.data, users.data, drafts.data, league.data)

        const drafts_array = []

        for (const draft of drafts.data) {
            drafts_array.push({
                draft_id: draft.draft_id,
                status: draft.status,
                rounds: draft.settings.rounds,
                draft_order: draft.draft_order
            })
        }


        const rosters_username = rosters.data
            ?.sort(
                (a, b) =>
                    (b.settings?.wins ?? 0) - (a.settings?.wins ?? 0)
                    || (b.settings?.fpts ?? 0) - (a.settings?.fpts ?? 0)
            );

        for (const [index, roster] of rosters_username.entries()) {
            const user = users.data.find(u => u.user_id === roster.owner_id);
            const co_owners = roster.co_owners?.map(co => {
                const co_user = users.data.find(u => u.user_id === co);
                return {
                    user_id: co_user?.user_id,
                    username: co_user?.display_name,
                    avatar: co_user?.avatar
                };
            });
            rosters_username[index] = {
                rank: index + 1,
                taxi: roster.taxi,
                starters: roster.starters,
                settings: roster.settings,
                roster_id: roster.roster_id,
                reserve: roster.reserve,
                players: roster.players,
                user_id: roster.owner_id,
                username: user?.display_name,
                avatar: user?.avatar,
                co_owners,
                draft_picks: draft_picks[roster.roster_id]
            };
        }

        const { type, best_ball } = league.data.settings || {}
        const settings = { type, best_ball }

        return {
            league_id: league_id,
            name: league.data.name,
            avatar: league.data.avatar,
            season: league.data.season,
            settings: settings,
            scoring_settings: league.data.scoring_settings,
            roster_positions: league.data.roster_positions,
            rosters: rosters_username,
            drafts: drafts_array,
            ...matchups,
            updatedAt: Date.now()
        }
    } catch (error) {
        console.error(`Error processing league ${league_id}: ${error.message}`);
        return null;
    }
}

const getBatchLeaguesDetails = async (leagueIds, display_week) => {

    const allResults = [];

    const chunkSize = 50;

    for (let i = 0; i < leagueIds.length; i += chunkSize) {
        const chunk = leagueIds.slice(i, i + chunkSize);
        const chunkResults = await Promise.all(chunk.map(async (leagueId) => {
            const result = await getLeagueDetails(leagueId, display_week);
            return result !== null ? result : undefined;
        }));
        allResults.push(...chunkResults);
    }

    return allResults.filter(result => result !== undefined);
}

const getLeaguesToUpsert = async (user_id, league_ids) => {
    let user;

    try {
        user = await User.findByPk(user_id, {
            include: {
                model: League
            }
        })
    } catch (error) {
        console.log(error)
    }

    let leagues_user_db = user.leagues

    const now = new Date()
    const cutoff = new Date(new Date() - (24 * 60 * 60 * 1000))



    const leagues_to_add = league_ids
        .filter(l =>
            !leagues_user_db?.find(l_db => l_db.league_id === l)
        )

    const leagues_to_update = league_ids
        .filter(l =>
            leagues_user_db?.find(l_db => l_db.league_id === l)
            && leagues_user_db?.find(l_db => l_db.league_id === l).updatedAt < cutoff
        )

    const leagues_up_to_date = leagues_user_db
        .filter(l_db =>
            l_db.updatedAt >= cutoff
        )

    return [leagues_to_add, leagues_to_update, leagues_up_to_date]
}