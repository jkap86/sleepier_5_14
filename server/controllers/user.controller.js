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

