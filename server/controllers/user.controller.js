'use strict'
const db = require("../models");
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const User = db.users;
const Op = db.Sequelize.Op
const League = db.leagues;

const axios = require('../api/axiosInstance');


exports.create = async (req, res) => {
    console.log(`***SEARCHING FOR ${req.body.username}***`)
    const user = await axios.get(`http://api.sleeper.app/v1/user/${req.body.username}`)

    if (user.data?.user_id) {
        const data = await User.upsert({
            user_id: user.data.user_id,
            username: user.data.display_name,
            avatar: user.data.avatar,
            type: 'S',
            updatedAt: new Date()

        })

        res.send(data)
    } else {
        res.send({ error: 'User not found' })
    }
}

exports.findMostLeagues = async (app) => {
    const getTopUsers = async () => {
        try {
            const users = await User.findAll({
                attributes: [
                    'username',
                    'avatar',
                    [Sequelize.fn('COUNT', Sequelize.col('leagues.league_id')), 'leaguesCount']
                ],
                include: [{
                    model: League,
                    attributes: [],
                    through: {
                        attributes: []
                    },
                    required: true
                }],
                order: [['leaguesCount', 'DESC']],
                group: ['user.user_id']
            })

            app.set('top_users', users.slice(0, 100))
        } catch (err) {
            console.log(err)
        }
    }

    setInterval(() => {
    getTopUsers()
    }, 5000)
    setInterval(() => {
        getTopUsers()
    }, 24 * 60 * 60 * 1000)

} 