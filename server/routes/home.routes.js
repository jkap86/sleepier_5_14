'use strict'

module.exports = app => {

    var router = require("express").Router();

    router.get("/", (req, res) => {
        const state = app.get('state')
        const allplayers = app.get('allplayers')
        const schedule = app.get('schedule')

        res.send({
            state: state,
            allplayers: allplayers,
            schedule: schedule
        })
    })



    app.use('/home', router);
}