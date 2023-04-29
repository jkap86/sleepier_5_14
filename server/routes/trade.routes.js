'use strict'

module.exports = app => {
    const trades = require("../controllers/trade.controller.js");

    var router = require("express").Router();

    router.post("/leaguemateleagues", trades.leaguemateLeagues)

    router.post('/leaguemate', trades.leaguemate)

    router.post('/pricecheck', trades.pricecheck)

    app.use('/trade', router);
}