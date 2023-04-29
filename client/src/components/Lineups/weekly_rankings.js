import { useState, useEffect, useRef } from "react";
import TableMain from "../Home/tableMain";
import { importRankings } from '../Functions/importRankings';
import { matchTeam } from "../Functions/misc";
import { getNewRank } from "../Functions/getNewRank";
import { utils, writeFile } from 'xlsx';
import TeamFilter from "../Home/teamFilter";
import PositionFilter from "../Home/positionFilter";
import { useSelector, useDispatch } from 'react-redux';
import { uploadRankings } from "../../actions/actions";

const WeeklyRankings = ({
    tab,
    setTab
}) => {
    const dispatch = useDispatch();
    const { allPlayers: stateAllPlayers, state: stateState, nflSchedule: stateNflSchedule } = useSelector(state => state.leagues)
    const [errorVisible, setErrorVisible] = useState(false);
    const [page, setPage] = useState(1)
    const [searched, setSearched] = useState('')
    const [edit, setEdit] = useState(false)
    const [filterPosition, setFilterPosition] = useState('W/R/T/Q')
    const [filterTeam, setFilterTeam] = useState('All')
    const tooltipRef = useRef(null)
    const { rankings, notMatched, filename, error } = useSelector(state => state.lineups)

    console.log(stateNflSchedule)
    const weekly_rankings_headers = [
        [
            {
                text: 'Player',
                colSpan: 3
            },
            {
                text: 'Pos',
                colSpan: 1
            },
            {
                text: 'Team',
                colSpan: 1
            },
            {
                text: 'Opp',
                colSpan: 1
            },
            {
                text: 'Kickoff',
                colSpan: 2
            },
            {
                text: edit ? <span><i
                    onClick={() => setEdit(false)}
                    className={'fa fa-trash clickable'}
                ></i> Rank</span> : <span>Rank  <i
                    onClick={() => setEdit(true)}
                    className={'fa fa-edit clickable'}
                ></i></span>,
                colSpan: 1
            },
            edit && {
                text: <span>Update <i
                    onClick={() => handleRankSave(false)}
                    className={'fa fa-save clickable'}
                ></i></span>,
                colSpan: 2
            }
        ]
    ]

    const weekly_rankings_body = Object.keys(rankings || {})
        ?.filter(x => (
            filterPosition === stateAllPlayers[x]?.position
            || filterPosition.split('/').includes(stateAllPlayers[x]?.position?.slice(0, 1))
        ) && (
                filterTeam === 'All' || filterTeam === stateAllPlayers[x]?.team
            )
        )
        ?.sort((a, b) => rankings[a].prevRank - rankings[b].prevRank)
        ?.map(player_id => {
            const offset = new Date().getTimezoneOffset()
            const kickoff = stateNflSchedule[stateState.display_week]
                ?.find(matchup => matchup.team.find(t => matchTeam(t.id) === stateAllPlayers[player_id]?.team))
                ?.kickoff
            const kickoff_formatted = kickoff && new Date(parseInt(kickoff * 1000)) || '-'
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            return {
                id: player_id,
                search: {
                    text: `${stateAllPlayers[player_id]?.full_name} ${stateAllPlayers[player_id]?.position} ${stateAllPlayers[player_id]?.team || 'FA'}`,
                    image: {
                        src: player_id,
                        alt: 'player headshot',
                        type: 'player'
                    }
                },
                list: [
                    {
                        text: stateAllPlayers[player_id]?.full_name,
                        colSpan: 3,
                        className: 'left',
                        image: {
                            src: player_id,
                            alt: 'player headshot',
                            type: 'player'
                        }
                    },
                    {
                        text: stateAllPlayers[player_id]?.position,
                        colSpan: 1
                    },
                    {
                        text: stateAllPlayers[player_id]?.team || 'FA',
                        colSpan: 1
                    },
                    {
                        text: matchTeam(stateNflSchedule[stateState.display_week]
                            ?.find(matchup => matchup.team.find(t => matchTeam(t.id) === stateAllPlayers[player_id]?.team))
                            ?.team
                            ?.find(team => matchTeam(team.id) !== stateAllPlayers[player_id]?.team)
                            ?.id) || 'FA'
                        ,
                        colSpan: 1
                    },
                    {
                        text: kickoff_formatted?.toLocaleString("en-US", { weekday: 'short', hour: 'numeric', minute: 'numeric', timeZone: timezone }),
                        colSpan: 2
                    },
                    {
                        text: rankings[player_id].prevRank,
                        colSpan: 1
                    },
                    edit && {
                        text: <input
                            value={rankings[player_id].newRank}
                            className={'editRank'}
                            onChange={(e) => handleRankChange([{ rank: e.target.value, player_id: player_id }])}
                        />,
                        colSpan: 2
                    }
                ]
            }
        })

    const handleRankChange = (players_to_update) => {

        let r = rankings

        players_to_update.map(player_to_update => {
            const prevRank = r[player_to_update.player_id].newRank
            const newRank = parseInt(player_to_update.rank) || ' '

            console.log({
                prevRank: prevRank,
                newRank: newRank
            })

            if ((newRank >= 0 && newRank <= 1000) || player_to_update.rank.trim() === '') {
                Object.keys(r)
                    .map((player, index) => {
                        if (player !== player_to_update.player_id) {
                            let incrementedRank = getNewRank(prevRank, newRank, r[player].newRank)
                            r[player].newRank = incrementedRank
                        } else {
                            r[player].newRank = newRank
                        }
                    })
            }
        })
        dispatch(uploadRankings({
            rankings: r
        }))

    }

    const handleRankSave = () => {

        let r = rankings

        Object.keys(r || {}).map(player_id => {
            return r[player_id].prevRank = !parseInt(r[player_id].newRank) ? 999 : r[player_id].newRank
        })
        dispatch(uploadRankings({
            rankings: r
        }))
        setEdit(false)

    }

    const downloadFile = () => {
        const workbook = utils.book_new()
        const data = Object.keys(rankings || {}).map(player_id => {
            return {
                name: stateAllPlayers[player_id]?.full_name,
                position: stateAllPlayers[player_id]?.position,
                team: stateAllPlayers[player_id]?.team || 'FA',
                rank: rankings[player_id].prevRank
            }
        }).sort((a, b) => a.rank - b.rank)
        const worksheet = utils.json_to_sheet(data)
        utils.book_append_sheet(workbook, worksheet, `Week ${stateState.display_week} Rankings`)
        writeFile(workbook, `SleepierWeek${stateState.display_week}Rankings.xlsx`)
    }

    useEffect(() => {
        const handleExitTooltip = (event) => {

            if (!tooltipRef.current || !tooltipRef.current.contains(event.target)) {

                setErrorVisible(false)
            }
        };

        document.addEventListener('mousedown', handleExitTooltip)
        document.addEventListener('touchstart', handleExitTooltip)

        return () => {
            document.removeEventListener('mousedown', handleExitTooltip);
            document.removeEventListener('touchstart', handleExitTooltip);
        };
    }, [])

    const positionFilter = <PositionFilter
        filterPosition={filterPosition}
        setFilterPosition={setFilterPosition}

    />

    const teamFilter = <TeamFilter
        filterTeam={filterTeam}
        setFilterTeam={setFilterTeam}

    />

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
        <h1>
            Week {stateState.display_week}
            <label className='upload'>
                <i
                    className={'fa fa-upload clickable right'}
                >
                </i>
                <input
                    type={'file'}
                    onChange={(e) => importRankings(e, stateAllPlayers, (uploadedRankings) => {
                        dispatch(uploadRankings(uploadedRankings))
                    })}
                />
            </label>
        </h1>
        <h1>
            {
                filename ?
                    <i
                        onClick={() => downloadFile()}
                        className="fa-solid fa-download"></i>
                    : null
            }
            {filename}
            {
                error || notMatched?.length > 0 ?
                    <>

                        <i
                            onClick={() => setErrorVisible(true)}
                            className={`fa-solid fa-circle-exclamation tooltip`} >
                            <div
                                onMouseLeave={() => setErrorVisible(false)}
                                ref={tooltipRef}>
                                <div
                                    className={`${errorVisible ? 'tooltip_content' : 'hidden'}`}>
                                    {
                                        error ||
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th colSpan={6}>NOT MATCHED</th>
                                                </tr>
                                                <tr>
                                                    <th colSpan={3}>Player Name</th>
                                                    <th >Rank</th>
                                                    <th>Pos</th>
                                                    <th>Team</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    notMatched.map((nm, index) =>
                                                        <tr key={`${nm.name}_${index}`}>
                                                            <td colSpan={3} className='left'><p><span>{nm.name}</span></p></td>
                                                            <td>{nm.rank}</td>
                                                            <td>{nm.position}</td>
                                                            <td>{nm.team}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                        </i>



                    </>
                    : null
            }
        </h1>


        <TableMain
            id={'Rankings'}
            type={'main'}
            headers={weekly_rankings_headers}
            body={weekly_rankings_body}
            page={page}
            setPage={setPage}
            search={true}
            searched={searched}
            setSearched={setSearched}
            options1={[teamFilter]}
            options2={[positionFilter]}
        />
    </>
}

export default WeeklyRankings;