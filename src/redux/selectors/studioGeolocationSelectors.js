// selectors/studioGeolocationSelectors.js

export const selectStudioGeolocation = (state, studioId) =>
  state.studioGeolocation[studioId];
