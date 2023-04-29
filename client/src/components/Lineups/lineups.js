import { useState } from "react";
import WeeklyRankings from "./weekly_rankings";
import LineupCheck from "./lineup_check";
import { useSelector } from 'react-redux';


const Lineups = ({
    syncLeague
}) => {
    const [tab, setTab] = useState('Weekly Rankings')
    const { user: state_user } = useSelector(state => state.user)
    const { allPlayers: stateAllPlayers, state: stateState, nflSchedule: stateNflSchedule } = useSelector(state => state.leagues)
    const { leaguesFiltered: stateLeagues } = useSelector(state => state.filteredData)
    const { rankings, notMatched, filename, error } = useSelector(state => state.lineups)

    const display = tab === 'Weekly Rankings' ?
        <WeeklyRankings
            tab={tab}
            setTab={setTab}
        />
        :
        <LineupCheck
            tab={tab}
            setTab={setTab}
        />

    return <>
        {display}
    </>
}

export default Lineups;