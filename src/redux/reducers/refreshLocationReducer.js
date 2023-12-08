const initialState = {
    count: 0,
  };
  
  const refreshLocationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REFRESH_LOCATION_COUNTER' :
        return {
          ...state,
          count: (state.count + 1)%1000,
        };
      default:
        return state;
    }
  };
  
  export default refreshLocationReducer;