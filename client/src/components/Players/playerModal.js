import { avatar } from "../Functions/misc";


const PlayerModal = ({
    getPlayerScore,
    setPlayerModalVisible,
    player
}) => {


    const player_score = getPlayerScore(player.trend_games, player.scoring_settings)

    return <>


        <div className="modal-grid" >
            <button className="close" onClick={() => setPlayerModalVisible(false)}>X</button>
            <table className="modal">
                <caption>{avatar(player?.player_id, 'player', 'player')}
                    <strong>
                        {player?.full_name}
                    </strong></caption>
                <thead>
                    <tr>
                        <th colSpan={3}>
                            Scoring Setting
                        </th>
                        <th>
                            Stats
                        </th>
                        <th>
                            Pts
                        </th>
                        <th>
                            %
                        </th>
                    </tr>
                    {
                        Object.keys(player_score)
                            .map(ss => {
                                const total_score = Object.keys(player_score || {}).reduce((acc, cur) => acc + player_score[cur].points, 0) / player.trend_games.length
                                return <tr key={ss}>
                                    <th colSpan={2} className="left">
                                        <p>{ss.replace('_', ' ')}</p>
                                    </th>
                                    <td>
                                        {player.scoring_settings[ss].toFixed(1)}
                                    </td>
                                    <td>
                                        {
                                            (player_score[ss].stats / player.trend_games.length).toFixed(1) || '-'
                                        }
                                    </td>
                                    <td>
                                        {
                                            (player_score[ss].points / player.trend_games.length).toFixed(1) || '-'
                                        }
                                    </td>
                                    <td>
                                        {
                                            ((player_score[ss].points / player.trend_games.length) / total_score * 100).toFixed(1)
                                        } %
                                    </td>
                                </tr>
                            })
                    }

                </thead>
            </table>


        </div>
    </>
}

export default PlayerModal;