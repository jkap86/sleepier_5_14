import TableMain from "../Home/tableMain";
import { getLineupCheck } from "../Functions/getLineupCheck";
import { useState } from "react";
import Lineup from "./lineup";
import { useSelector } from 'react-redux';

const LineupCheck = ({
    tab,
    setTab,
    syncLeague
}) => {
    const [itemActive, setItemActive] = useState('');
    const [page, setPage] = useState(1)
    const [searched, setSearched] = useState('')
    const { user: state_user } = useSelector(state => state.user)
    const { allPlayers: stateAllPlayers, state: stateState, nflSchedule: stateNflSchedule } = useSelector(state => state.leagues)
    const { leaguesFiltered: stateLeagues } = useSelector(state => state.filteredData)
    const { rankings, notMatched, filename, error } = useSelector(state => state.lineups)


    const lineups_headers = [
        [
            {
                text: 'League',
                colSpan: 6,
                rowSpan: 2,
                className: 'half'
            },
            {
                text: '#Slots',
                colSpan: 8,
                className: 'half'
            }
        ],
        [
            {
                text: 'Suboptimal',
                colSpan: 2,
                className: 'small half'
            },
            {
                text: 'Early in Flex',
                colSpan: 2,
                className: 'small half'
            },
            {
                text: 'Late not in Flex',
                colSpan: 2,
                className: 'small half'
            },
            {
                text: 'Non QBs in SF',
                colSpan: 2,
                className: 'small half'
            }
        ]
    ]



    const lineups_body = stateLeagues.map(league => {
        const matchups = league[`matchups_${stateState.display_week}`]

        const matchup = matchups?.find(m => m.roster_id === league.userRoster.roster_id)
        const opponentMatchup = matchups?.find(m => m.matchup_id === matchup.matchup_id && m.roster_id !== matchup.roster_id)

        let opponent;
        if (opponentMatchup) {
            const opponentRoster = league.rosters.find(r => r?.roster_id === opponentMatchup?.roster_id)
            opponent = {
                roster: opponentRoster,
                matchup: opponentMatchup
            }


        }
        let lineups = matchup && rankings && getLineupCheck(matchup, league, stateAllPlayers, rankings, stateNflSchedule[stateState.display_week])
        const optimal_lineup = lineups?.optimal_lineup
        const lineup_check = lineups?.lineup_check
        const starting_slots = lineups?.starting_slots
        const players_points = { ...lineups?.players_points, ...opponentMatchup?.players_points }
        return {
            id: league.league_id,
            search: {
                text: league.name,
                image: {
                    src: league.avatar,
                    alt: league.name,
                    type: 'league'
                }
            },
            list: [
                {
                    text: league.name,
                    colSpan: 6,
                    className: 'left',
                    image: {
                        src: league.avatar,
                        alt: league.name,
                        type: 'league'
                    }
                },
                {
                    text: !matchup?.matchup_id || !lineup_check ? '-' : lineup_check.filter(x => x.notInOptimal).length > 0 ?
                        lineup_check.filter(x => x.notInOptimal).length :
                        '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check ? '' : lineup_check.filter(x => x.notInOptimal).length > 0 ?
                        'red' : 'green'
                },
                {
                    text: !matchup?.matchup_id || !lineup_check ? '-' : lineup_check.filter(x => x.earlyInFlex).length > 0 ?
                        lineup_check.filter(x => x.earlyInFlex).length :
                        '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check ? '' : lineup_check.filter(x => x.earlyInFlex).length > 0 ?
                        'red' : 'green'
                },
                {
                    text: !matchup?.matchup_id || !lineup_check ? '-' : lineup_check.filter(x => x.lateNotInFlex).length > 0 ?
                        lineup_check.filter(x => x.lateNotInFlex).length :
                        '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check ? '' : lineup_check.filter(x => x.lateNotInFlex).length > 0 ?
                        'red' : 'green'
                },
                {
                    text: !matchup?.matchup_id || !lineup_check ? '-' : lineup_check.filter(x => x.nonQBinSF).length > 0 ?
                        lineup_check.filter(x => x.nonQBinSF).length :
                        '√',
                    colSpan: 2,
                    className: !matchup?.matchup_id || !lineup_check ? '' : lineup_check.filter(x => x.nonQBinSF).length > 0 ?
                        'red' : 'green'
                }
            ],
            secondary_table: (
                <Lineup
                    matchup={matchup}
                    opponent={opponent}
                    starting_slots={starting_slots}
                    league={league}
                    optimal_lineup={optimal_lineup}
                    players_points={players_points}
                    stateAllPlayers={stateAllPlayers}
                    state_user={state_user}
                    lineup_check={lineup_check}
                    syncLeague={syncLeague}
                    searched={searched}
                    setSearched={setSearched}

                    stateState={stateState}
                    stateNflSchedule={stateNflSchedule}
                />
            )
        }
    })

    return <>
        <div className='navbar'>
            <p className='select'>
                {tab}&nbsp;<i class="fa-solid fa-caret-down"></i>
            </p>

            <select
                className='trades'
                onChange={(e) => setTab(e.target.value)}
                value={tab}

            >
                <option>Weekly Rankings</option>
                <option>Lineup Check</option>
            </select>
        </div>

        <TableMain
            id={'Lineups'}
            type={'main'}
            headers={lineups_headers}
            body={lineups_body}
            page={page}
            setPage={setPage}
            itemActive={itemActive}
            setItemActive={setItemActive}
            search={true}
            searched={searched}
            setSearched={setSearched}
        />
    </>
}

export default LineupCheck;