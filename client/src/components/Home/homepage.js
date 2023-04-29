import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import sleeperLogo from '../../images/sleeper_icon.png';
import './css/homepage.css';


const Homepage = () => {
    const [username, setUsername] = useState('')
    const [leagueId, setLeagueId] = useState('')
    const [tab, setTab] = useState('username')


    return <div id='homepage'>
        <div className='picktracker'>
            <p className="home click" onClick={() => setTab(prevState => prevState === 'username' ? 'picktracker' : 'username')}>
                picktracker
            </p>
            {
                tab === 'picktracker' ?
                    <>
                        <input
                            onChange={(e) => setLeagueId(e.target.value)}
                            className='picktracker'
                            placeholder='League ID'
                        />
                        <Link className='home' to={`/picktracker/${leagueId}`}>
                            <button
                                className='click picktracker'
                            >
                                Submit
                            </button>
                        </Link>
                    </>
                    : null
            }

        </div>

        <img
            alt='sleeper_logo'
            className='home'
            src={sleeperLogo}
        />

        <div className='home_wrapper'>
            <strong className='home'>
                Sleepier
            </strong>
            <div className='user_input'>
                <input
                    className='home'
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />

            </div>
            <Link to={(username === '') ? '/' : `/${username}`}>
                <button
                    className='home click'
                >
                    Submit
                </button>
            </Link>
        </div>
    </div>
}

export default Homepage;