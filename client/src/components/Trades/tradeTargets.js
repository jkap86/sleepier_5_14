import TableMain from "../Home/tableMain";
import { useState } from "react";
import TradeTipRosters from "./tradeTipRosters";

const TradeTargets = ({
    trade,
    stateAllPlayers,
    stateState,
    state_user
}) => {
    const [itemActive, setItemActive] = useState('');

    const trade_acquisitions_headers = [
        [
            {
                text: 'Potential Acquisitions',
                colSpan: 9
            }
        ],
        [
            {
                text: 'Manager',
                colSpan: 3
            },
            {
                text: 'Player',
                colSpan: 3
            },
            {
                text: 'League',
                colSpan: 3
            }

        ]
    ]

    const trade_acquisitions_body = !trade.tips?.acquire?.length > 0 ? [{ id: 'NONE', list: [{ text: '-', colSpan: 9 }] }] : trade.tips?.acquire?.map(add => {

        return {
            id: `${add.manager.user_id}_${add.type === 'player' ? stateAllPlayers[add.player_id]?.full_name
                : `${add.player_id.season} ` + (add.player_id.season === stateState.league_season && add.player_id.order ? `${add.player_id.round}.${add.player_id.order.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                    : add.manager.user_id !== state_user.user_id ? `Round ${add.player_id.round} (${add.manager.username})`
                        : `Round ${add.player_id.round}`)}_${add.league.league_id}`,
            list: [
                {
                    text: add.manager.username,
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: add.manager.avatar,
                        alt: 'manager avatar',
                        type: 'user'
                    }
                },
                {
                    text: add.type === 'player' ? stateAllPlayers[add.player_id]?.full_name
                        : `${add.player_id.season} ` + (add.player_id.season === stateState.league_season && add.player_id.order ? `${add.player_id.round}.${add.player_id.order.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                            : add.manager.user_id !== state_user.user_id ? `Round ${add.player_id.round} (${add.manager.username})`
                                : `Round ${add.player_id.round}`),
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: add.player_id,
                        alt: 'player headshot',
                        type: 'player'
                    }
                },
                {
                    text: add.league.name,
                    colSpan: 3,
                    className: 'left end',
                    image: {
                        src: add.league.avatar,
                        alt: 'league avatar',
                        type: 'league'
                    }
                }
            ],
            secondary_table: (
                <TradeTipRosters
                    userRoster={add.userRoster}
                    lmRoster={add.lmRoster}
                    stateAllPlayers={stateAllPlayers}
                    stateState={stateState}
                    roster_positions={add.league.roster_positions}
                />
            )
        }

    })

    const trade_flips_headers = [
        [
            {
                text: 'Potential Flips',
                colSpan: 9
            }
        ],
        [
            {
                text: 'Manager',
                colSpan: 3
            },
            {
                text: 'Player',
                colSpan: 3
            },
            {
                text: 'League',
                colSpan: 3
            }

        ]
    ]

    const trade_flips_body = !trade.tips?.trade_away?.length > 0 ? [{ id: 'NONE', list: [{ text: '-', colSpan: 9 }] }] : trade.tips?.trade_away?.map((add, index) => {

        return {
            id: (`${add.manager.user_id}_${add.type === 'player' ? stateAllPlayers[add.player_id]?.full_name
                : `${add.player_id.season} ` + (add.player_id.season === stateState.league_season && add.player_id.order ? `${add.player_id.round}.${add.player_id.order.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                    : add.manager.user_id !== state_user.user_id ? `Round ${add.player_id.round} (${add.manager.username})`
                        : `Round ${add.player_id.round}`)}_${add.league.league_id}`) + `_${index}`,
            list: [
                {
                    text: add.manager.username,
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: add.manager.avatar,
                        alt: 'manager avatar',
                        type: 'user'
                    }
                },
                {
                    text: add.type === 'player' ? stateAllPlayers[add.player_id]?.full_name
                        : `${add.player_id.season} ` + (add.player_id.season === stateState.league_season && add.player_id.order ? `${add.player_id.round}.${add.player_id.order.toLocaleString("en-US", { minimumIntegerDigits: 2 })}`
                            : add.manager.user_id !== state_user.user_id ? `Round ${add.player_id.round} (${add.manager.username})`
                                : `Round ${add.player_id.round}`),
                    colSpan: 3,
                    className: 'left',
                    image: {
                        src: add.player_id,
                        alt: 'player headshot',
                        type: 'player'
                    }
                },
                {
                    text: add.league.name,
                    colSpan: 3,
                    className: 'left end',
                    image: {
                        src: add.league.avatar,
                        alt: 'league avatar',
                        type: 'league'
                    }
                }
            ],
            secondary_table: (
                <TradeTipRosters
                    userRoster={add.userRoster}
                    lmRoster={add.lmRoster}
                    stateAllPlayers={stateAllPlayers}
                    stateState={stateState}
                    roster_positions={add.league.roster_positions}
                />
            )
        }

    })

    return <>
        <TableMain
            type={'secondary'}
            headers={trade_acquisitions_headers}
            body={trade_acquisitions_body}
            itemActive={itemActive}
            setItemActive={setItemActive}
        />
        <TableMain
            type={'secondary'}
            headers={trade_flips_headers}
            body={trade_flips_body}
            itemActive={itemActive}
            setItemActive={setItemActive}
        />
    </>
}

export default TradeTargets;