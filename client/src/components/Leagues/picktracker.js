import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import TableMain from '../Home/tableMain';


const PickTracker = ({ }) => {
    const params = useParams();
    const [kickers, setKickers] = useState([])
    const [page, setPage] = useState(1)

    useEffect(() => {

        const fetchKickers = async () => {
            const kickers = await axios.post('/league/draft', {
                league_id: params.league_id

            })
            setKickers(kickers.data)

        }

        fetchKickers()

    }, [params.league_id])

    const headers = [
        [
            {
                text: 'Pick',
                colSpan: 2
            },
            {
                text: 'Manager',
                colSpan: 4
            },
            {
                text: 'Kicker',
                colSpan: 4
            }
        ]
    ]

    const body = (kickers.picks || [])
        ?.map(kicker => {
            return {
                id: kicker.player_id,
                list: [
                    {
                        text: kicker.pick,
                        colSpan: 2
                    },
                    {
                        text: kicker.picked_by,
                        colSpan: 4,
                        className: 'left',
                        image: {
                            src: kicker.picked_by_avatar,
                            alt: 'user avatar',
                            type: 'user'
                        }
                    },
                    {
                        text: kicker.player,
                        colSpan: 4,
                        className: 'left end',
                        image: {
                            src: kicker.player_id,
                            alt: 'player headshot',
                            type: 'player'
                        }
                    }
                ]
            }
        })


    return <>
        <Link to={'/'} className='home' target={'_blank'}>
            Home
        </Link>
        <h1>
            <p className="image">
                <strong>{kickers.league?.name}</strong>
            </p>
        </h1>
        <TableMain
            type={'main'}
            headers={headers}
            body={body}
            page={page}
            setPage={setPage}
        />
    </>
}

export default PickTracker;