import TableMain from "../Home/tableMain";
import { useSelector } from 'react-redux';

const LeaguematePlayersLeagues = ({
    leagues_lm,
    leagues_user,
    leaguemate
}) => {
    const { user: state_user } = useSelector(state => state.user)


    const lm_headers = [
        [
            {
                text: 'League',
                colSpan: 4,
                rowSpan: 2,
                className: 'half'
            },
            {
                text: 'Rank',
                colSpan: 4,
                className: 'half small'
            }
        ],
        [
            {
                text: leaguemate.username,
                colSpan: 2,
                className: 'small half',
            },
            {
                text: state_user.username,
                colSpan: 2,
                className: 'small half'
            },
        ]
    ]

    const lm_body = leagues_lm.map(league => {
        return {
            id: league.league.league_id,
            list: [
                {
                    text: league.league.name,
                    colSpan: 4,
                    className: 'left',
                    image: {
                        src: league.league.avatar,
                        alt: 'league avatar',
                        type: 'league'
                    }
                },
                {
                    text: league.league.lmRoster.rank,
                    colSpan: 2,
                    className: league.league.lmRoster.rank / league.league.rosters.length <= .25 ? 'green' :
                        league.league.lmRoster.rank / league.league.rosters.length >= .75 ? 'red' :
                            null
                },
                {
                    text: league.league.userRoster.rank,
                    colSpan: 2,
                    className: league.league.userRoster.rank / league.league.rosters.length <= .25 ? 'green' :
                        league.league.userRoster.rank / league.league.rosters.length >= .75 ? 'red' :
                            null
                }
            ]
        }
    })

    const user_body = leagues_user.map(league => {
        return {
            id: league.league.league_id,
            list: [
                {
                    text: league.league.name,
                    colSpan: 4,
                    className: 'left',
                    image: {
                        src: league.league.avatar,
                        alt: 'league avatar',
                        type: 'league'
                    }
                },
                {
                    text: league.league.lmRoster.rank,
                    colSpan: 2,
                    className: league.league.lmRoster.rank / league.league.rosters.length <= .25 ? 'green' :
                        league.league.lmRoster.rank / league.league.rosters.length >= .75 ? 'red' :
                            null
                },
                {
                    text: league.league.userRoster.rank,
                    colSpan: 2,
                    className: league.league.userRoster.rank / league.league.rosters.length <= .25 ? 'green' :
                        league.league.userRoster.rank / league.league.rosters.length >= .75 ? 'red' :
                            null
                }
            ]
        }
    })

    return <>
        <TableMain
            type={'tertiary subs'}
            headers={lm_headers}
            body={lm_body}

        />
        <TableMain
            type={'tertiary subs'}
            headers={lm_headers}
            body={user_body}
        />
    </>
}

export default LeaguematePlayersLeagues;