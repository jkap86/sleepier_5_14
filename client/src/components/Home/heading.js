import { avatar } from '../Functions/misc';
import React from "react";
import './css/heading.css';
import { useSelector, useDispatch } from 'react-redux';
import { setType1, setType2, setTab } from '../../actions/actions';

const Heading = ({

}) => {
    const dispatch = useDispatch()
    const { tab, type1, type2 } = useSelector(state => state.tab)
    const { user, isLoading: isLoadingUser, error: errorUser } = useSelector((state) => state.user);
    const { state: stateState, allPlayers, nflSchedule, leagues, leaguemates, leaguematesDict, playerShares, isLoading: isLoadingLeagues, error: errorLeagues } = useSelector(state => state.leagues)
    const { lmTrades, isLoading: isLoadingLmTrades, error: errorLmTrades } = useSelector(state => state.lmTrades);
    const { isLoading, leaguesFiltered, playersharesFiltered, leaguematesFiltered, error } = useSelector(state => state.filteredData);

    return <>
        <div className="heading">

            <h1>
                {stateState.league_season}
            </h1>
            <h1>
                <p className="image">
                    {
                        user.avatar && avatar(user.avatar, user.display_name, 'user')
                    }
                    <strong>
                        {user.username}
                    </strong>
                </p>
            </h1>
            <div className="navbar">
                <p className='select'>
                    {tab}&nbsp;<i class="fa-solid fa-caret-down"></i>
                </p>
                <select

                    className="nav active click"
                    value={tab}
                    onChange={(e) => dispatch(setTab(e.target.value))}
                >
                    <option>Players</option>
                    <option>Trades</option>
                    <option>Leagues</option>
                    <option>Leaguemates</option>
                    <option>Lineups</option>
                </select>

            </div>
            {
                tab === 'Trades' ? null :
                    <div className="switch_wrapper">
                        <div className="switch">
                            <button className={type1 === 'Redraft' ? 'sw active click' : 'sw click'} onClick={() => dispatch(setType1('Redraft'))}>Redraft</button>
                            <button className={type1 === 'All' ? 'sw active click' : 'sw click'} onClick={() => dispatch(setType1('All'))}>All</button>
                            <button className={type1 === 'Dynasty' ? 'sw active click' : 'sw click'} onClick={() => dispatch(setType1('Dynasty'))}>Dynasty</button>
                        </div>
                        <div className="switch">
                            <button className={type2 === 'Bestball' ? 'sw active click' : 'sw click'} onClick={() => dispatch(setType2('Bestball'))}>Bestball</button>
                            <button className={type2 === 'All' ? 'sw active click' : 'sw click'} onClick={() => dispatch(setType2('All'))}>All</button>
                            <button className={type2 === 'Standard' ? 'sw active click' : 'sw click'} onClick={() => dispatch(setType2('Standard'))}>Standard</button>
                        </div>
                    </div>
            }
            <h2>
                {tab === 'Trades' ? null : `${leaguesFiltered?.length} Leagues`}
            </h2>
        </div>
    </>
}

export default Heading;