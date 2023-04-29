'use strict'
const db = require("../models");
const DynastyRankings = db.dynastyrankings;
const Stats = db.stats;
const Op = db.Sequelize.Op;

exports.find = async (req, res) => {
    const values = await DynastyRankings.findAll({
        where: {
            [Op.or]: [
                {
                    date: req.body.date1
                },
                {
                    date: req.body.date2
                }
            ]
        },

    })

    res.send(values)
}

exports.findrange = async (req, res) => {
    const values = await DynastyRankings.findAll({
        where: {
            date: req.body.dates
        }

    })

    res.send(values)
}

exports.stats = async (req, res) => {
    const stats = require('../stats.json')

    const stats_data = {}

    stats
        .filter(s =>
            (new Date(s.date).getTime() + 1 * 24 * 60 * 60 * 1000) > new Date(req.body.date1).getTime()
            && (new Date(s.date).getTime() - 1 * 24 * 60 * 60 * 1000) < new Date(req.body.date2).getTime()
            && req.body.players.includes(s.player_id)
            && s.stats.pts_ppr
        )
        .map(stats_object => {
            if (!stats_data[stats_object.player_id]) {
                stats_data[stats_object.player_id] = []
            }

            stats_data[stats_object.player_id].push(stats_object)
        })

    res.send(stats_data)
}

exports.addDate = async (req, res) => {
    const stats = []
    for (let season = 2009; season < 2023; season++) {
        const num_weeks = season < 2022 ? 16 : 17

        for (let week = 1; week <= num_weeks; week++) {
            const weekly_stats = require(`../../NFL Weekly Stats 2009-2022/${season}_Week${week}_Stats.json`)

            weekly_stats.map(stats_object => {
                return stats.push({
                    season: stats_object.season,
                    week: stats_object.week,
                    player_id: stats_object.player_id,
                    team: stats_object.team,
                    opponent: stats_object.opponent,
                    stats: stats_object.stats,
                    date: stats_object.date
                })
            })
        }

    }

    try {
        await Stats.bulkCreate(stats, { ignoreDuplicates: true })
    } catch (err) {
        console.log(err.message)
    }
    res.send(stats)
}