import TableMain from "../Home/tableMain";
import { useState } from "react";
import LeagueInfo from "./leagueInfo";
import { useSelector } from 'react-redux';

const Leagues = ({ }) => {
    const [page, setPage] = useState(1)
    const [itemActive, setItemActive] = useState('');
    const [searched, setSearched] = useState('')
    const { allPlayers: stateAllPlayers } = useSelector(state => state.leagues)
    const { leaguesFiltered: stateLeagues } = useSelector(state => state.filteredData)

    const leagues_headers = [
        [
            {
                text: 'League',
                colSpan: 4
            },
            {
                text: 'Record',
                colSpan: 2
            },
            {
                text: 'Rank',
                colSpan: 1
            }
        ]
    ]

    const leagues_body = stateLeagues.map(league => {
        const total_games = league.userRoster.settings.wins + league.userRoster.settings.losses + league.userRoster.settings.ties
        return {
            id: league.league_id,
            search: {
                text: league.name,
                image: {
                    src: league.avatar,
                    alt: 'league avatar',
                    type: 'league'
                }
            },
            list: [
                {
                    text: league.name,
                    colSpan: 4,
                    className: 'left',
                    image: {
                        src: league.avatar,
                        alt: league.name,
                        type: 'league'
                    }
                },
                {
                    text: `${league.userRoster.settings.wins}-${league.userRoster.settings.losses}`
                        + (league.userRoster.settings.ties > 0 ? `-${league.userRoster.settings.ties}` : ''),
                    colSpan: 1
                },
                {
                    text: (total_games > 0 ?
                        (league.userRoster.settings.wins / total_games)
                        :
                        '--'
                    ).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 }).slice(1, 6),
                    colSpan: 1
                },
                {
                    text: league.userRoster.rank,
                    colSpan: 1,
                    className: league.userRoster.rank / league.rosters.length <= .25 ? 'green' :
                        league.userRoster.rank / league.rosters.length >= .75 ? 'red' :
                            null
                }
            ],
            secondary_table: (
                <LeagueInfo
                    league={league}
                    scoring_settings={league.scoring_settings}
                />
            )
        }
    })

    return <>
        <TableMain
            id={'Leagues'}
            type={'main'}
            headers={leagues_headers}
            body={leagues_body}
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

export default Leagues;