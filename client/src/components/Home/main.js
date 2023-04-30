import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import View from "./view";
import { loadingIcon } from "../Functions/misc";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeagues, fetchLmTrades, fetchUser, setTab, setType1, setType2, resetState} from '../../actions/actions';

const Main = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { user, isLoading: isLoadingUser, error: errorUser } = useSelector((state) => state.user);
    const { state, leagues, leaguematesDict, isLoading: isLoadingLeagues } = useSelector(state => state.leagues)
    const { tab, type1, type2 } = useSelector(state => state.tab)


    


    useEffect(() => {
        dispatch(resetState());
        dispatch(fetchUser(params.username));
        dispatch(setTab('Players'));
        dispatch(setType1('All'))
        dispatch(setType2('All'))
    }, [params.username, dispatch])

    useEffect(() => {
        if (user?.user_id) {
            dispatch(fetchLeagues(user.user_id))
        }
    }, [user])




    return <>
        {(!isLoadingUser && !isLoadingLeagues) && (
            <React.Suspense fallback={loadingIcon}>
                <View />
            </React.Suspense>
        )}

        {isLoadingUser || isLoadingLeagues ? loadingIcon : null}

        {errorUser ? <h1>{errorUser}</h1> : null}

    </>
}

export default Main;