const initialState = { isLoading: false, user: {}, error: null };

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_USER_START':
            return { ...state, isLoading: true, error: null };
        case 'FETCH_USER_SUCCESS':
            return { ...state, isLoading: false, user: action.payload };
        case 'FETCH_USER_FAILURE':
            return { ...state, isLoading: false, error: action.payload };
        default:
            return state;
    }
};

export default userReducer
