const initialState = {
  filterLocation: localStorage.getItem('filterLocation') || 'New Delhi',
};
  
  const refreshLocationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REFRESH_LOCATION' :
        const newFilterLocation = action.city
        console.log("New Filter Location", newFilterLocation)
        localStorage.setItem('filterLocation',newFilterLocation)
        return {
          filterLocation : newFilterLocation
        };
      default:
        return state;
    }
  };
  
  export default refreshLocationReducer;