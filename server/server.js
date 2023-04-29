'use strict'

const throng = require('throng');
const WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
    worker: start,
    count: WORKERS
});


function start() {
    const express = require('express');
    const cors = require('cors');
    const compression = require('compression');
    const path = require('path');
    const bodyParser = require('body-parser');

    const app = express();

    app.use(compression())
    app.use(cors());
    app.use(express.json());
    app.use(express.static(path.resolve(__dirname, '../client/build')));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    const db = require('./models');
    db.sequelize.sync()
        .then(() => {
            console.log("Synced db.");
        })
        .catch((err) => {
            console.log("Failed to sync db: " + err.message);
        })

    require("./routes/user.routes")(app);
    require('./routes/league.routes')(app)
    require('./routes/home.routes')(app)
    require('./routes/dynastyrankings.routes')(app)



    app.get('*', async (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    })

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);

        require('./scheduledTasks/onServerBoot')(app)
        require('./scheduledTasks/findMostLeagus')(app)
    });

}