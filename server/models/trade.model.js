'use strict'

const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const Trade = sequelize.define("trade", {
        transaction_id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        status_updated: {
            type: DataTypes.BIGINT
        },
        rosters: {
            type: Sequelize.JSONB,
        },
        managers: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        players: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        adds: {
            type: Sequelize.JSONB
        },
        drops: {
            type: Sequelize.JSONB
        },
        draft_picks: {
            type: Sequelize.JSONB
        },
        drafts: {
            type: Sequelize.JSONB
        },
        price_check: {
            type: Sequelize.JSONB
        }
    }, {
        indexes: [
            {
                fields: ['status_updated', 'leagueLeagueId', 'managers'],
                using: 'BTREE',
                order: [['status_updated', 'DESC']],
                group: ['trade.transaction_id'],
            }
        ],
        partitionKey: 'status_updated',
        partitionOptions: {
            type: 'range',
            key: 'status_updated',
            partitionBy: 'MONTH',
            partitionCount: 6
        }

    });




    return Trade;
};