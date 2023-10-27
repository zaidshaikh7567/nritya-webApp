export const toggleDarkMode = () => {
  console.log('Action Creator: Toggling Dark Mode');
  return {
    type: 'TOGGLE_DARK_MODE',
  };
};
