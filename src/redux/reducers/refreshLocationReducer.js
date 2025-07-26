const initialState = {
  filterLocation: typeof window !== 'undefined' ? (localStorage.getItem('filterLocation') || 'New Delhi') : 'New Delhi',
};
  
  const refreshLocationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'REFRESH_LOCATION' :
        const newFilterLocation = action.city
        console.log("New Filter Location", newFilterLocation)
        if (typeof window !== 'undefined') {
        localStorage.setItem('filterLocation',newFilterLocation)
      }
        return {
          filterLocation : newFilterLocation
        };
      default:
        return state;
    }
  };
  
  export default refreshLocationReducer;