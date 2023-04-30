import { RESET_STATE } from '../actions/actions';

const initialState = {
    rankings: {},
    notMatched: [],
    filename: '',
    error: null
}

const lineupsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPLOAD_RANKINGS':
            return {
                ...state,
                rankings: action.payload.rankings,
                notMatched: action.payload.notMatched,
                filename: action.payload.filename,
                error: action.payload.error
            };
        case RESET_STATE:
            return {
                ...initialState
            };
        default:
            return state;
    }
}

export default lineupsReducer;