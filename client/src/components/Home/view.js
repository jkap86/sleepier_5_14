import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Heading from "./heading";
import Players from '../Players/players';
import Leagues from '../Leagues/leagues';
import Leaguemates from '../Leaguemates/leaguemates';
import Trades from '../Trades/trades';
import Lineups from "../Lineups/lineups";
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilteredData, fetchLmTrades } from "../../actions/actions";
import { loadingIcon } from "../Functions/misc";

const View = ({ }) => {
    const dispatch = useDispatch()
    const params = useParams();
    const { user, isLoading: isLoadingUser, error: errorUser } = useSelector((state) => state.user);
    const { state, allPlayers, nflSchedule, leagues, leaguemates, leaguematesDict, playerShares, isLoading: isLoadingLeagues, error: errorLeagues } = useSelector(state => state.leagues)
    const { lmTrades, isLoading: isLoadingLmTrades, error: errorLmTrades } = useSelector(state => state.lmTrades);
    const { isLoading, leaguesFiltered, playersharesFiltered, leaguematesFiltered, error } = useSelector(state => state.filteredData);
    const { tab, type1, type2 } = useSelector(state => state.tab)


    console.log(useSelector(state => state))
    useEffect(() => {
        dispatch(fetchFilteredData(type1, type2, leagues, leaguemates, playerShares));



    }, [user, leagues, type1, type2, leaguemates, playerShares])

    useEffect(() => {
        if (user.user_id && Object.keys(leaguematesDict)?.length > 0) {
            dispatch(fetchLmTrades(user.user_id, leaguematesDict, leagues, state.season, 0, 125))
        }
    }, [user.user_id, leaguematesDict])

    let display;


    switch (tab) {
        case 'Players':
            display = !isLoading && <Players /> || loadingIcon
            break;
        case 'Leaguemates':
            display = !isLoading && <Leaguemates /> || loadingIcon
            break;
        case 'Leagues':
            display = !isLoading && <Leagues /> || loadingIcon
            break;
        case 'Trades':
            display = !isLoadingLmTrades && <Trades /> || loadingIcon
            break;
        case 'Lineups':
            display = !isLoading && <Lineups /> || loadingIcon
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