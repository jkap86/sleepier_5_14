import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import sleeperLogo from '../../images/sleeper_icon.png';
import './css/homepage.css';
import axios from 'axios';
import { avatar } from '../Functions/misc';

const Homepage = () => {
    const [username, setUsername] = useState('')
    const [leagueId, setLeagueId] = useState('')
    const [tab, setTab] = useState('username')
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [dropdownOptions, setDropdownOptions] = useState([])
    const modalRef = useRef()

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await axios.post('user/findmostleagues')

            setDropdownOptions(users.data)
        }

        fetchUsers()
    }, [])

    useEffect(() => {
        const handleModal = (event) => {

            if (!modalRef.current || !modalRef.current.contains(event.target)) {

                setDropdownVisible(false)
            }
        };

        document.addEventListener('mousedown', handleModal)
        document.addEventListener('touchstart', handleModal)

        return () => {
            document.removeEventListener('mousedown', handleModal);
            document.removeEventListener('touchstart', handleModal);
        };
    }, [])

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

                <i className="fa-solid fa-ranking-star fa-beat" onClick={() => setDropdownVisible(true)}></i>
            </div>
            {
                dropdownVisible && dropdownOptions.length > 0 ?
                    <div className='dropdown_wrapper'>
                        <p className='dropdown_header'>Top League Counts</p>
                        <ol
                            onBlur={() => setDropdownVisible(false)}
                            className="dropdown"
                            ref={modalRef}
                        >
                            {dropdownOptions
                                .sort((a, b) => parseInt(b.leaguesCount) - parseInt(a.leaguesCount))
                                .map((option, index) =>
                                    <li key={`${option.username}_${index}`}>
                                        <button>
                                            {
                                                <>
                                                    <p>
                                                        <span className='float_left leagues_count'>
                                                            {index + 1}
                                                        </span>
                                                        <span className='username'>
                                                            {
                                                                avatar(
                                                                    option.avatar, 'user avatar', 'user'
                                                                )
                                                            }
                                                            {option.username}</span>
                                                        <span className='float_right leagues_count'>
                                                            {option.leaguesCount}
                                                        </span>
                                                    </p>

                                                </>
                                            }
                                        </button>
                                    </li>
                                )}
                        </ol>
                    </div >
                    :
                    null
            }

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