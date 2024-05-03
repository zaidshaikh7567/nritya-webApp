import { useSelector } from 'react-redux';
import { selectStudioGeolocation } from '../redux/selectors/studioGeolocationSelectors';
// Custom hook to fetch studio geolocation data based on studioId
function useStudioGeolocation(studioId) {
  const studioGeolocation = useSelector(state => selectStudioGeolocation(state, studioId));

  return studioGeolocation;
}

export default useStudioGeolocation;
