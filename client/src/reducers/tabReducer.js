
const initialState = {
    tab: 'Players',
    type1: 'All',
    type2: 'All',
    trendDateStart: new Date(new Date() - 30 * 24 * 60 * 60 * 1000 - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
    trendDateEnd: new Date(new Date() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]
};

const tabReducer = (state = initialState, action) => {
    switch (action.type) {
        // other case statements...
        case 'SET_TAB':
            return {
                ...state,
                tab: action.payload
            };
        case 'SET_TYPE1':
            return {
                ...state,
                type1: action.payload
            };
        case 'SET_TYPE2':
            return {
                ...state,
                type2: action.payload
            };
        case 'SET_TRENDDATESTART':
            return {
                ...state,
                trendDateStart: action.payload
            };
        case 'SET_TRENDDATEEND':
            return {
                ...state,
                trendDateEnd: action.payload
            }
        default:
            return state;
    }
};

export default tabReducer;
