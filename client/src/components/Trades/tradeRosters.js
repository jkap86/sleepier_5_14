import LeagueInfo from "../Leagues/leagueInfo";

const TradeRosters = ({
    trade,
    stateAllPlayers
}) => {

    return <>
        <LeagueInfo
            league={{
                roster_positions: trade['league.roster_positions'],
                rosters: trade.rosters,
                settings: {
                    type: trade['league.settings'].type,
                    best_ball: trade['league.settings'].best_ball
                }
            }}
            stateAllPlayers={stateAllPlayers}
            scoring_settings={trade['league.scoring_settings']}
        />
    </>
}

export default TradeRosters;