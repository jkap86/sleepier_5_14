import TableMain from "../Home/tableMain";
import { useState } from "react";
import LeagueInfo from "../Leagues/leagueInfo";
import { useSelector } from 'react-redux';

const PlayerLeagues = ({ leagues_owned, leagues_taken, leagues_available, player_id, snapPercentage }) => {
    const [tab, setTab] = useState('Owned');
    const [page, setPage] = useState(1)
    const [itemActive, setItemActive] = useState('');
    const { allPlayers: stateAllPlayers } = useSelector(state => state.leagues)
    const { stats: stateStats } = useSelector(state => state.stats)

    const getPlayerScore = (stats_array, scoring_settings) => {
        let total_breakdown = {};

        stats_array?.map(stats_game => {
            Object.keys(stats_game.stats || {})
                .filter(x => Object.keys(scoring_settings).includes(x))
                .map(key => {
                    if (!total_breakdown[key]) {
                        total_breakdown[key] = 0
                    }
                    total_breakdown[key] += stats_game.stats[key] * scoring_settings[key]
                })
        })

        return total_breakdown;
    }

    let player_leagues_headers = [
        [
            {
                text: 'League',
                colSpan: 3,
                className: 'half'
            },
            {
                text: 'PPG',
                colSpan: 1
            },
            {
                text: 'Rank',
                colSpan: 1,
                className: 'half'
            }
        ]
    ]

    if (tab === 'Taken') {
        player_leagues_headers[0].push(
            {
                text: 'Manager',
                colSpan: 2,
                className: 'half'
            }
        )
    }

    const trend_games = stateStats?.[player_id]
        ?.filter(s => s.stats.tm_off_snp > 0 && ((s.stats.snp || s.stats.off_snp || 0) / (s.stats.tm_off_snp) > snapPercentage))

    const leagues_display = tab === 'Owned' ? leagues_owned :
        tab === 'Taken' ? leagues_taken :
            tab === 'Available' ? leagues_available :
                null

    const player_leagues_body = leagues_display.map(lo => {
        const player_score = getPlayerScore(trend_games, lo.scoring_settings)
        return {
            id: lo.league_id,
            list: [
                {
                    text: lo.name,
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: lo.avatar,
                        alt: lo.name,
                        type: 'league'
                    }
                },
                {
                    text: trend_games?.length > 0 && (Object.keys(player_score || {}).reduce((acc, cur) => acc + player_score[cur], 0) / trend_games.length).toFixed(1) || '-',
                    colSpan: 1
                },
                {
                    text: lo.userRoster?.rank,
                    colSpan: 1,
                    className: lo.userRoster?.rank / lo.rosters.length <= .25 ? 'green' :
                        lo.userRoster?.rank / lo.rosters.length >= .75 ? 'red' :
                            null
                },
                tab === 'Taken' ?
                    {
                        text: lo.lmRoster?.username || 'Orphan',
                        colSpan: 2,
                        className: 'left end',
                        image: {
                            src: lo.lmRoster?.avatar,
                            alt: lo.lmRoster?.username,
                            type: 'user'
                        }
                    }
                    : ''

            ],
            secondary_table: (
                <LeagueInfo
                    stateAllPlayers={stateAllPlayers}
                    scoring_settings={lo.scoring_settings}
                    league={lo}
                    stateStats={stateStats}
                    getPlayerScore={getPlayerScore}
                    snapPercentage={snapPercentage}
                    type='tertiary'

                />
            )
        }
    })


    return <>
        <div className="secondary nav">
            <button
                className={tab === 'Owned' ? 'active click' : 'click'}
                onClick={() => setTab('Owned')}
            >
                Owned
            </button>
            <button
                className={tab === 'Taken' ? 'active click' : 'click'}
                onClick={() => setTab('Taken')}
            >
                Taken
            </button>
            <button
                className={tab === 'Available' ? 'active click' : 'click'}
                onClick={() => setTab('Available')}
            >
                Available
            </button>
        </div>
        <TableMain
            type={'secondary'}
            headers={player_leagues_headers}
            body={player_leagues_body}
            itemActive={itemActive}
            setItemActive={setItemActive}
            page={page}
            setPage={setPage}
        />
    </>
}

export default PlayerLeagues;