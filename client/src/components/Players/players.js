import TableMain from "../Home/tableMain";
import { useState, useEffect } from "react";
import headshot from '../../images/headshot.png';
import PlayerLeagues from "./player_leagues";
import TeamFilter from "../Home/teamFilter";
import PositionFilter from "../Home/positionFilter";
import '../Home/css/modal.css';
import { getLocalDate } from '../Functions/dates';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setTrendDateStart, setTrendDateEnd, fetchStats, fetchValues } from "../../actions/actions";

const Players = ({ }) => {
    const dispatch = useDispatch();
    const [itemActive, setItemActive] = useState('');
    const [page, setPage] = useState(1)
    const [searched, setSearched] = useState('')
    const [filterPosition, setFilterPosition] = useState('W/R/T/Q')
    const [filterTeam, setFilterTeam] = useState('All')
    const [filterDraftClass, setFilterDraftClass] = useState('All')
    const [valueType, setValueType] = useState('SF')
    const [optionsVisible, setOptionsVisible] = useState(false)
    const [snapPercentageMin, setSnapPercentageMin] = useState(0)
    const [snapPercentageMax, setSnapPercentageMax] = useState(100)
    const [sortBy, setSortBy] = useState('Owned')
    const { user, isLoading: isLoadingUser, error: errorUser } = useSelector((state) => state.user);
    const { state, allPlayers, nflSchedule, leagues, leaguemates, leaguematesDict, playerShares, isLoading: isLoadingLeagues, error: errorLeagues } = useSelector(state => state.leagues)
    const { lmTrades, isLoading: isLoadingLmTrades, error: errorLmTrades } = useSelector(state => state.lmTrades);
    const { leaguesFiltered, playersharesFiltered, leaguematesFiltered } = useSelector(state => state.filteredData);
    const { tab, trendDateStart, trendDateEnd } = useSelector(state => state.tab);
    const { isLoading: isLoadingStats, stats, error: errorStats } = useSelector(state => state.stats)
    const { isLoading: isLoadingDynastyValues, dynastyValues, error: errorDynstyValues } = useSelector(state => state.dynastyValues)



    useEffect(() => {

        if (trendDateStart && trendDateEnd && playersharesFiltered.length > 0) {

            dispatch(fetchStats(trendDateStart, trendDateEnd, playersharesFiltered.map(player => player.id)))

            dispatch(fetchValues(trendDateStart, trendDateEnd))

        }
    }, [trendDateStart, trendDateEnd, playersharesFiltered])


    const playerShares_headers = [
        [
            {
                text: 'Player',
                colSpan: 4,
                rowSpan: 2,
                className: 'half'
            },

            {
                text: 'Owned',
                colSpan: 2,
                className: 'half'
            },
            {
                text: <select className="main_header" value={valueType} onChange={(e) => setValueType(e.target.value)}>
                    <option>SF</option>
                    <option>1QB</option>
                </select>,
                colSpan: 1,
                rowSpan: 1,
                className: 'half'
            },

            {
                text: <>
                    {
                        `${new Date(new Date(trendDateStart).getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' })}
                     to
                        ${new Date(new Date(trendDateEnd).getTime() + new Date().getTimezoneOffset() * 60000).toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' })}`
                    }
                    &nbsp;
                    <i
                        className="fa-solid fa-filter fa-beat"
                        onClick={() => setOptionsVisible(prevState => !prevState)}
                    >

                    </i>
                </>,
                colSpan: 3,
                className: 'xsmall'
            }
        ],
        [
            {
                text: 'Total',
                colSpan: 1,
                className: 'half'
            },
            {
                text: '%',
                colSpan: 1,
                className: 'half'
            },
            {
                text: <span><p>KTC Value</p></span>,
                colSpan: 1,
                className: 'half small left'
            },
            {
                text: 'Trend',
                colSpan: 1,
                className: 'half small left'
            },
            {
                text: 'GP',
                colSpan: 1
            },
            {
                text: 'PPG',
                colSpan: 1
            }
        ]
    ]

    const playerShares_body = playersharesFiltered
        .filter(x =>
            (
                x.id.includes('_') || allPlayers[x.id])
            && (
                filterPosition === allPlayers[x.id]?.position
                || filterPosition.split('/').includes(allPlayers[x.id]?.position?.slice(0, 1))
                || (
                    filterPosition === 'Picks' && x.id.includes('_')
                )
            ) && (
                filterTeam === 'All' || allPlayers[x.id]?.team === filterTeam
            ) && (
                filterDraftClass === 'All' || parseInt(filterDraftClass) === (state.league_season - allPlayers[parseInt(x.id)]?.years_exp)
            )
        )
        .map(player => {
            let pick_name;
            let ktc_name;
            let cur_value;
            let prev_value;
            if (player.id.includes('_')) {
                const pick_split = player.id.split('_')
                pick_name = `${pick_split[0]} ${pick_split[1]}.${pick_split[2].toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                ktc_name = `${pick_split[0]} ${parseInt(pick_split[2]) <= 4 ? 'Early' : parseInt(pick_split[2]) >= 9 ? 'Late' : 'Mid'} ${pick_split[1]}`


                cur_value = dynastyValues
                    ?.find(dr => getLocalDate(dr.date) === getLocalDate(trendDateEnd))
                    ?.values[ktc_name]
                    ?.[valueType === 'SF' ? 'sf' : 'oneqb']

                prev_value = dynastyValues
                    ?.find(dr => getLocalDate(dr.date) === getLocalDate(trendDateStart))
                    ?.values[ktc_name]
                    ?.[valueType === 'SF' ? 'sf' : 'oneqb']
            } else {


                cur_value = dynastyValues
                    ?.find(dr => dr.date.toString() === trendDateEnd.toString())
                    ?.values[player.id]
                    ?.[valueType === 'SF' ? 'sf' : 'oneqb']

                prev_value = dynastyValues
                    ?.find(dr => dr.date.toString() === trendDateStart.toString())
                    ?.values[player.id]
                    ?.[valueType === 'SF' ? 'sf' : 'oneqb']

            }

            const trend_games = stats?.[player.id]
                ?.filter(
                    s =>
                        s.stats.tm_off_snp > 0
                        && ((s.stats.snp || s.stats.off_snp || 0) / (s.stats.tm_off_snp) * 100 > snapPercentageMin)
                        && ((s.stats.snp || s.stats.off_snp || 0) / (s.stats.tm_off_snp) * 100 < snapPercentageMax)

                )


            return {
                id: player.id,
                search: {
                    text: allPlayers[player.id] && `${allPlayers[player.id]?.full_name} ${allPlayers[player.id]?.position} ${allPlayers[player.id]?.team || 'FA'}` || pick_name,
                    image: {
                        src: player.id,
                        alt: 'player photo',
                        type: 'player'
                    }
                },
                list: [
                    {
                        text: player.id.includes('_') ? pick_name : `${allPlayers[player.id]?.position} ${allPlayers[player.id]?.full_name} ${player.id.includes('_') ? '' : allPlayers[player.id]?.team || 'FA'}` || `INACTIVE PLAYER`,
                        colSpan: 4,
                        className: 'left',
                        image: {
                            src: allPlayers[player.id] ? player.id : headshot,
                            alt: allPlayers[player.id]?.full_name || player.id,
                            type: 'player'
                        }
                    },

                    {
                        text: player.leagues_owned.length.toString(),
                        colSpan: 1,
                        className: 'green'
                    },
                    {
                        text: ((player.leagues_owned.length / leaguesFiltered?.length) * 100).toFixed(1) + '%',
                        colSpan: 1,
                        className: 'green'
                    },
                    {
                        text: cur_value || '-',
                        colSpan: 1
                    },
                    {
                        text: (cur_value && prev_value && cur_value - prev_value) || '-',
                        colSpan: 1
                    },
                    {
                        text: trend_games?.length || '-',
                        colSpan: 1,
                        className: 'red'
                    },
                    {
                        text: trend_games?.length > 0 && (trend_games?.reduce((acc, cur) => acc + cur.stats.pts_ppr, 0) / trend_games?.length)?.toFixed(1) || '-',
                        colSpan: 1,
                        className: 'yellow'
                    }
                ],
                secondary_table: (
                    <PlayerLeagues
                        leagues_owned={player.leagues_owned}
                        leagues_taken={player.leagues_taken}
                        leagues_available={player.leagues_available}
                        stateStats={stats}
                        trend_games={trend_games}
                        player_id={player.id}
                        allPlayers={allPlayers}
                    />
                )
            }
        })
        .sort(
            (a, b) => sortBy === 'KTC'
                ? (parseInt(b.list[3].text) || 0) - (parseInt(a.list[3].text) || 0)
                : sortBy === 'TREND'
                    ? (parseInt(b.list[4].text) || 0) - (parseInt(a.list[4].text) || 0)
                    : sortBy === 'GP'
                        ? (parseInt(b.list[5].text) || 0) - (parseInt(a.list[5].text) || 0)
                        : sortBy === 'PPG'
                            ? (parseFloat(b.list[6].text) || 0) - (parseFloat(a.list[6].text) || 0)
                            : (parseInt(b.list[1].text) || 0) - (parseInt(a.list[1].text) || 0)

        )

    useEffect(() => {
        if (filterPosition === 'Picks') {
            setFilterTeam('All')
        }
    }, [filterPosition])



    const handleMaxMinChange = (type, value) => {

        switch (type) {
            case 'minsnappct':
                snapPercentageMin > snapPercentageMax && setSnapPercentageMax(value)
                break;
            case 'maxsnappct':
                snapPercentageMin > snapPercentageMax && setSnapPercentageMin(value)
                break;
            case 'mintrend':
                trendDateStart > trendDateEnd && dispatch(setTrendDateEnd(value))
                break;
            case 'maxtrend':
                trendDateStart > trendDateEnd && dispatch(setTrendDateStart(value))
                break;
            default:
                break
        }
    }

    const stat_categories = Array.from(
        new Set(leaguesFiltered
            .flatMap(league =>
                Object.keys(league.scoring_settings || {})
                    .filter(
                        setting => (
                            setting.startsWith('pass')
                            || setting.startsWith('rush')
                            || setting.startsWith('rec')
                            || setting.startsWith('bonus')
                            || setting.startsWith('fum ')
                        ) && (
                                league.scoring_settings[setting] > 0
                            )
                    )
            )
        )
    )


    const teamFilter = <TeamFilter
        filterTeam={filterTeam}
        setFilterTeam={setFilterTeam}
        picks={true}
    />

    const positionFilter = <PositionFilter
        filterPosition={filterPosition}
        setFilterPosition={setFilterPosition}
        picks={true}
    />

    const player_ids = playersharesFiltered.filter(p => parseInt(allPlayers[parseInt(p.id)]?.years_exp) >= 0).map(p => parseInt(p.id))

    const draftClassYears = Array.from(
        new Set(
            player_ids
                .map(player_id => state.league_season - allPlayers[parseInt(player_id)]?.years_exp)
        )
    ).sort((a, b) => b - a)


    const draftClassFilter = <span className="team">
        <label>
            {
                filterDraftClass === 'All' ?
                    <i className="fa-solid fa-graduation-cap icon"></i>
                    : <strong className="draft-year"><em>{filterDraftClass}</em></strong>
            }
            <select
                className="hidden_behind click"
                onChange={(e) => setFilterDraftClass(e.target.value)}
                value={filterDraftClass}
            >
                <option>All</option>
                {
                    draftClassYears.map(year =>
                        <option>{year}</option>
                    )
                }

            </select>
        </label>

    </span>

    return <>
        {
            optionsVisible ?
                <div className="modal">
                    <div className="modal-grid">
                        <label className="sort">
                            <i class="fa-solid fa-sort"></i>
                            <select
                                className="hidden_behind click"
                                onChange={(e) => setSortBy(e.target.value)}
                                value={sortBy}
                            >
                                <option>OWNED</option>
                                <option>KTC</option>
                                <option>TREND</option>
                                <option>GP</option>
                                <option>PPG</option>
                            </select>
                        </label>
                        <button className="close" onClick={() => setOptionsVisible(false)}>X</button>
                        <div className="modal-grid-item">
                            <div className="modal-grid-content header"><strong>Trend Range</strong>
                            </div>
                            <div className="modal-grid-content one">

                                <input
                                    type={'date'}
                                    value={trendDateStart}
                                    onChange={(e) => e.target.value && dispatch(setTrendDateStart(new Date(e.target.value).toISOString().split('T')[0]))}
                                    onBlur={(e) => handleMaxMinChange('mintrend', e.target.value)}
                                    onMouseLeave={(e) => handleMaxMinChange('mintrend', e.target.value)}
                                    onMouseEnter={(e) => handleMaxMinChange('maxtrend', e.target.value)}
                                />

                            </div>
                            <div className="modal-grid-content three">

                                <input
                                    type={'date'}
                                    value={trendDateEnd}
                                    onChange={(e) => e.target.value && dispatch(setTrendDateEnd(new Date(e.target.value).toISOString().split('T')[0]))}
                                    onBlur={(e) => handleMaxMinChange('maxtrend', e.target.value)}
                                    onMouseLeave={(e) => handleMaxMinChange('maxtrend', e.target.value)}
                                    onMouseEnter={(e) => handleMaxMinChange('mintrend', e.target.value)}
                                />

                            </div>
                        </div>
                        <div className="modal-grid-item">
                            <div className="modal-grid-content header">
                                <strong>Game Filters</strong>
                            </div>
                        </div>
                        <div className="modal-grid-item">
                            <div className="modal-grid-content one">
                                <strong>Snap %</strong>
                            </div>
                            <div className="modal-grid-content two">
                                Min <input
                                    type={'number'}
                                    min={'0'}
                                    max={'100'}
                                    value={snapPercentageMin}
                                    onChange={(e) => setSnapPercentageMin(e.target.value)}
                                    onBlur={(e) => handleMaxMinChange('minsnappct', e.target.value)}
                                    onMouseLeave={(e) => handleMaxMinChange('minsnappct', e.target.value)}
                                    onMouseEnter={(e) => handleMaxMinChange('maxsnappct', e.target.value)}
                                /> %
                            </div>
                            <div className="modal-grid-content three">
                                Min <input
                                    type={'number'}
                                    min={'0'}
                                    max={'100'}
                                    value={snapPercentageMax}
                                    onChange={(e) => setSnapPercentageMax(e.target.value)}
                                    onBlur={(e) => handleMaxMinChange('maxsnappct', e.target.value)}
                                    onMouseLeave={(e) => handleMaxMinChange('maxsnappct', e.target.value)}
                                    onMouseEnter={(e) => handleMaxMinChange('minsnappct', e.target.value)}
                                /> %
                            </div>
                        </div>
                    </div>
                </div >
                :
                null
        }



        <TableMain
            id={'Players'}
            type={'main'}
            headers={playerShares_headers}
            body={playerShares_body}
            page={page}
            setPage={setPage}
            itemActive={itemActive}
            setItemActive={setItemActive}
            search={true}
            searched={searched}
            setSearched={setSearched}
            options1={[teamFilter]}
            options2={[positionFilter, draftClassFilter]}
        />
    </>
}

export default Players;