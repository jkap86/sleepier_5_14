import { useState } from "react";
import TradeTargets from "./tradeTargets";
import TradeRosters from "./tradeRosters";
import { useSelector } from 'react-redux';


const TradeInfo = ({
    trade
}) => {
    const [tab, setTab] = useState('Leads');
    const { user: state_user, isLoading: isLoadingUser, error: errorUser } = useSelector((state) => state.user);
    const { state: stateState, allPlayers: stateAllPlayers, nflSchedule, leagues, leaguemates, leaguematesDict, playerShares, isLoading: isLoadingLeagues, error: errorLeagues } = useSelector(state => state.leagues)

    let display;

    switch (tab) {
        case 'Leads':
            display = (
                <TradeTargets
                    trade={trade}
                    stateAllPlayers={stateAllPlayers}
                    stateState={stateState}
                    state_user={state_user}
                />
            )
            break;
        case 'Rosters':
            display = (
                <TradeRosters
                    trade={trade}
                    stateAllPlayers={stateAllPlayers}
                />
            )
            break;
        default:
            break;
    }

    return <>
        <div className="secondary nav">
            <button
                className={tab === 'Leads' ? 'active click' : 'click'}
                onClick={() => setTab('Leads')}
            >
                Leads
            </button>
            <button
                className={tab === 'Rosters' ? 'active click' : 'click'}
                onClick={() => setTab('Rosters')}
            >
                Rosters
            </button>
        </div>
        {display}
    </>
}

export default TradeInfo;