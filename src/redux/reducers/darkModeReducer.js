const initialState = {
  isDarkModeOn: localStorage.getItem('isDarkModeOn') === 'true' || false, // Load from local storage
};

const darkModeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      console.log('Reducer: Toggling Dark Mode');
      const newDarkModeState = !state.isDarkModeOn;

      // Save the new state to local storage
      localStorage.setItem('isDarkModeOn', newDarkModeState);

      return {
        ...state,
        isDarkModeOn: newDarkModeState,
      };
    default:
      return state;
  }
};

export default darkModeReducer;
