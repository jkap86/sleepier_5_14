import { combineReducers } from 'redux';
import userReducer from './userReducer';
import leaguesReducer from './leaguesReducer';
import lmTradesReducer from './lmTradesReducer';
import filteredLmTradesReducer from './filteredLmTradesReducer';
import filteredDataReducer from './filteredDataReducer';
import tabReducer from './tabReducer';
import dynastyValuesReducer from './valuesReducer';
import statsReducer from './statsReducer';
import lineupsReducer from './lineupsReducer';
import pricecheckTradesReducer from './pricecheckTradesReducer';

const rootReducer = combineReducers({
    user: userReducer,
    leagues: leaguesReducer,
    lmTrades: lmTradesReducer,
    filteredLmTrades: filteredLmTradesReducer,
    pricecheckTrades: pricecheckTradesReducer,
    filteredData: filteredDataReducer,
    tab: tabReducer,
    dynastyValues: dynastyValuesReducer,
    stats: statsReducer,
    lineups: lineupsReducer
});

export default rootReducer;


