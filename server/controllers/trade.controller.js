'use strict'
const db = require("../models");
const User = db.users;
const Trade = db.trades;
const League = db.leagues;
const Op = db.Sequelize.Op
const sequelize = db.sequelize


exports.leaguemate = async (req, res) => {
    let filters = [];

    if (req.body.manager) {
        filters.push({
            managers: {
                [Op.contains]: [req.body.manager]
            }
        })
    } else if (req.body.leaguemates) {
        filters.push({
            managers: {
                [Op.overlap]: req.body.leaguemates
            }
        })

    }

    if (req.body.player) {
        if (req.body.player.includes('.')) {
            const pick_split = req.body.player.split(' ')
            const season = pick_split[0]
            const round = parseInt(pick_split[1]?.split('.')[0])
            const order = parseInt(season) === parseInt(new Date().getFullYear()) ? parseInt(pick_split[1]?.split('.')[1]) : null

            filters.push({
                players: {
                    [Op.contains]: [`${season} ${round}.${order}`]
                }

            })
        } else {
            filters.push({
                players: {
                    [Op.contains]: [req.body.player]
                }

            })
        }
    }

    let lmTrades;
    let leagues;
    try {

        lmTrades = await Trade.findAndCountAll({
            order: [['status_updated', 'DESC']],
            offset: req.body.offset,
            limit: req.body.limit,
            where: {
                [Op.and]: filters
            },
            attributes: ['transaction_id', 'status_updated', 'rosters', 'managers', 'adds', 'drops', 'draft_picks', 'leagueLeagueId'],
            include: [
                {
                    model: League,
                    attributes: ['name', 'avatar', 'roster_positions', 'scoring_settings', 'settings'],

                }
            ],
            subquery: true,
            raw: true
        })
    } catch (error) {
        console.log(error)
    }

    res.send(lmTrades)

}

exports.leaguemateLeagues = async (req, res) => {
    let filters = [];

    if (req.body.leaguemates) {
        filters.push({
            users: {
                [Op.overlap]: req.body.leaguemates
            }
        })
    } else if (req.body.manager) {
        filters.push({
            users: {
                [Op.contains]: [req.body.manager]
            }
        })
    }

    if (req.body.player) {

        filters.push({
            [Op.or]: [
                {
                    adds: {
                        [req.body.player]: {
                            [Op.not]: null
                        }
                    }
                }
            ]
        })
    }

    let lmLeaguesTrades;

    try {

        lmLeaguesTrades = await Trade.findAndCountAll({
            order: [['status_updated', 'DESC']],
            offset: req.body.offset,
            limit: req.body.limit,
            where: {
                [Op.and]: filters
            },
            include: [
                {
                    model: League,

                }
            ],
            indexHints: [{ type: 'USE', values: ['idx_lm_leagues_trades'] }]
        })
        /*
         lmLeaguesTrades = await Trade.findAndCountAll({
             order: [['status_updated', 'DESC']],
             offset: req.body.offset,
             limit: req.body.limit,
             include: {
                 model: User,
                 as: 'users2',
                 where: {
                     user_id: req.body.leaguemates
                 }
             },
             distinct: true
         })
   */
    } catch (error) {
        console.log(error)
    }


    res.send(lmLeaguesTrades)
}

exports.pricecheck = async (req, res) => {
    let filters = [];


    if (req.body.player.includes('.')) {
        const pick_split = req.body.player.split(' ')
        const season = pick_split[0]
        const round = parseInt(pick_split[1]?.split('.')[0])
        const order = parseInt(pick_split[1]?.split('.')[1])

        filters.push({
            price_check: {
                [Op.contains]: [`${season} ${round}.${order}`]
            }
        })
    } else {
        filters.push({
            price_check: {
                [Op.contains]: [req.body.player]
            }

        })
    }

    if (req.body.player2) {
        if (req.body.player2.includes('.')) {
            const pick_split = req.body.player2.split(' ')
            const season = pick_split[0]
            const round = parseInt(pick_split[1]?.split('.')[0])
            const order = parseInt(pick_split[1]?.split('.')[1])

            filters.push({
                players: {
                    [Op.contains]: [`${season} ${round}.${order}`]
                }
            })
        } else {
            filters.push({
                players: {
                    [Op.contains]: [req.body.player2]
                }
            })
        }


    }


    let pcTrades;
    let managers;
    let players2;
    try {
        pcTrades = await Trade.findAndCountAll({
            order: [['status_updated', 'DESC']],
            offset: req.body.offset,
            limit: req.body.limit,
            where: {
                [Op.and]: filters
            },
            attributes: ['transaction_id', 'status_updated', 'rosters', 'managers', 'adds', 'drops', 'draft_picks', 'leagueLeagueId'],
            include: {
                model: League,
                attributes: ['name', 'avatar', 'scoring_settings', 'roster_positions', 'settings']
            },
            raw: true
        })

        if (!req.body.player2) {
            players2 = await Trade.findAll({
                where: {
                    [Op.and]: filters
                },
                attributes: ['players'],
                raw: true
            })
        }


    } catch (error) {
        console.log(error)
    }



    res.send({ ...pcTrades, players2: Array.from(new Set(players2?.flat() || [])) })
    /*
    const filteredTrades = [];
    for (const trade of pcTrades) {
        const dataValues = trade;
        const query_pick = dataValues.draft_picks.find(
            (pick) =>
                pick.season === season &&
                pick.round === round &&
                (pick.order === order || !pick.order)
        );

        if (
            (Object.values(dataValues.adds).filter((x) => x === dataValues.adds[req.body.player_id]).length === 1 &&
                !dataValues.draft_picks.find((pick) => pick.new_user?.user_id === dataValues.adds[req.body.player_id])) ||
            (dataValues.draft_picks.filter((pick) => pick.new_user?.user_id === query_pick?.new_user?.user_id).length === 1 &&
                !Object.values(dataValues.adds).find((manager_user_id) => manager_user_id === query_pick?.new_user?.user_id))
        ) {
            filteredTrades.push(dataValues);
        }
    }

    res.send(filteredTrades);
    */
}
