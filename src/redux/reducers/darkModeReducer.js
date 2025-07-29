const initialState = {
  isDarkModeOn: typeof window !== 'undefined' ? (localStorage.getItem('darkModeOn') === 'true' || false) : false, // Load from local storage
};

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      console.log('Reducer: Toggling Dark Mode');
      const newDarkModeState = !state.isDarkModeOn;

      // Save the new state to local storage
      console.log("dark mode state",newDarkModeState);
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkModeOn', newDarkModeState);
        console.log("dark mode state set",localStorage.getItem('darkModeOn') );
      }

      return {
        ...state,
        isDarkModeOn: newDarkModeState,
      };
    default:
      return state;
  }
};

export default darkModeReducer;
