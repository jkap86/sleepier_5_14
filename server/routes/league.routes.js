'use strict'

module.exports = app => {
    const leagues = require("../controllers/league.controller.js");

    var router = require("express").Router();

    router.post('/find', leagues.find);

    router.post('/sync', async (req, res) => {
        leagues.sync(req, res, app)
    })

    router.post("/draft", async (req, res) => {
        leagues.draft(req, res, app)
    })

    app.use('/league', router);
}