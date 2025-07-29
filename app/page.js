import LandingPage from './components/LandingPage'
import ClientHeader from './components/ClientHeader'
import ClientFooter from './components/ClientFooter'
import ContactUsWidget from './components/ContactUsWidget'
import LocationSync from './components/LocationSync'

const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/" // Replace with your actual staging server URL
const COLLECTIONS = {
  STUDIO: "Studio",
  WORKSHOPS: "Workshops",
  OPEN_CLASSES: "OpenClasses",
  COURSES: "Courses",
};
async function fetchLandingPageData(city = "New Delhi") {
  try {
    const filterLocation = city;
    const entities = [COLLECTIONS.STUDIO, COLLECTIONS.WORKSHOPS, COLLECTIONS.COURSES, COLLECTIONS.OPEN_CLASSES];

    const studioIdNameResponse = await fetch(`${BASEURL_PROD}api/autocomplete/?&city=${filterLocation}`, {
      cache: 'no-store' // Important for fresh signed URLs
    });
    const studioIdName = await studioIdNameResponse.json();

    const exploreEntityPromises = entities.map(async (entity) => {
      const response = await fetch(`${BASEURL_PROD}api/search/?&city=${filterLocation}&entity=${entity}`, {
        cache: 'no-store'
      });
      const data = await response.json();
      return { [entity]: data };
    });

    const exploreEntityResults = await Promise.all(exploreEntityPromises);
    const exploreEntity = Object.assign({}, ...exploreEntityResults);

    const imagesResponse = await fetch(`${BASEURL_PROD}api/landingPageImages/`, {
      cache: 'no-store'
    });
    const imagesData = await imagesResponse.json();

    const danceImagesUrl = imagesData.signed_urls?.filter(image => 
      typeof image === 'string' && !image.includes("LandingPageImages/?Expire")
    ) || [];

    return {
      studioIdName,
      exploreEntity,
      danceImagesUrl,
    };
  } catch (error) {
    console.error('Error fetching landing page data:', error);
    return {
      studioIdName: {},
      exploreEntity: {
        [COLLECTIONS.STUDIO]: [],
        [COLLECTIONS.WORKSHOPS]: [],
        [COLLECTIONS.COURSES]: [],
        [COLLECTIONS.OPEN_CLASSES]: [],
      },
      danceImagesUrl: [],
    };
  }
}


export default async function Home({ searchParams }) {
  const city = searchParams?.city || 'New Delhi';
  const landingPageData = await fetchLandingPageData(city);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LocationSync />
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <LandingPage {...landingPageData} currentCity={city}/>
      </main>
      <ClientFooter />
      <ContactUsWidget />
    </div>
  )
} 