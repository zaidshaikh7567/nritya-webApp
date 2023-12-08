export const selectDarkModeStatus = (state) => {
    // Try to get the dark mode status from localStorage
    const localStorageDarkMode = localStorage.getItem('darkModeOn');
  
    // Return the localStorage value if it's not null, otherwise return the Redux state value
    return localStorageDarkMode !== null ? localStorageDarkMode === 'true' : state.darkMode.isDarkModeOn;
  };
  