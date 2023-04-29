import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Heading from "./heading";
import Players from '../Players/players';
import Leagues from '../Leagues/leagues';
import Leaguemates from '../Leaguemates/leaguemates';
//import Trades from '../Trades/trades';
import Lineups from "../Lineups/lineups";
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilteredData } from "../../actions/actions";

const View = ({ }) => {
    const dispatch = useDispatch()
    const { user, isLoading: isLoadingUser, error: errorUser } = useSelector((state) => state.user);
    const { state, allPlayers, nflSchedule, leagues, leaguemates, leaguematesDict, playerShares, isLoading: isLoadingLeagues, error: errorLeagues } = useSelector(state => state.leagues)
    const { lmTrades, isLoading: isLoadingLmTrades, error: errorLmTrades } = useSelector(state => state.lmTrades);
    const { isLoading, leaguesFiltered, playersharesFiltered, leaguematesFiltered, error } = useSelector(state => state.filteredData);
    const { tab, type1, type2 } = useSelector(state => state.tab)


    console.log(useSelector(state => state))
    useEffect(() => {
        dispatch(fetchFilteredData(type1, type2, leagues, leaguemates, playerShares));


    }, [user, leagues, type1, type2, leaguemates, playerShares])

    console.log([tab, type1, type2])
    let display;

    switch (tab) {
        case 'Players':
            display = <Players />
            break;
        case 'Leaguemates':
            display = <Leaguemates
                stateLeaguemates={leaguematesFiltered}
            />
            break;
        case 'Leagues':
            display = <Leagues
                stateLeagues={leaguesFiltered}
            />
            break;
        case 'Trades':
            display = null
            break;
        case 'Lineups':
            display = <Lineups />
            break;
        default:
            display = null
            break;
    }


    return <>
        <Link to="/" className="home">
            Home
        </Link>
        <Heading />
        {display}
    </>
}

export default View;