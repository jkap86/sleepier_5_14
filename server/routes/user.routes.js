module.exports = app => {
    const users = require("../controllers/user.controller.js");

    var router = require("express").Router();

    router.use((req, res, next) => {
        req.app = app
        next()
    });

    router.post("/create", users.create)



    router.post("/findmostleagues", (req, res) => {
        const users = app.get('top_users')
        res.send(users || [])
    })

    app.use('/user', router);
}