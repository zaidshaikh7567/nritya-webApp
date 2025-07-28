import { Suspense } from 'react'
import { Button, Skeleton, Stack, Chip } from '@mui/material'
import dynamic from 'next/dynamic'
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'

// Generate dynamic metadata for studio pages
export async function generateMetadata({ params }) {
  try {
    const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/"
    const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`
    
    // Fetch studio data for metadata
    const response = await fetch(`${BASEURL_STUDIO}${params.studioId}/text/`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const studioData = await response.json()
      const studioName = studioData.studioName || 'Studio'
      const danceStyles = studioData.danceStyles || 'Dance Styles'
      const city = studioData.city || ''
      const studioFounder = studioData.founderName || ''  
      const minFee = studioData.minFee || ''  
      
      // Fetch studio images for Open Graph
      const responseImages = await fetch(`${BASEURL_STUDIO}${params.studioId}/images/`, {
        cache: 'no-store'
      })
      
      let ogImage = 'https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/logo.png' // Default image
      
      if (responseImages.ok) {
        const imagesData = await responseImages.json()
        if (imagesData.carouselImages && imagesData.carouselImages.length > 0) {
          ogImage = imagesData.carouselImages[0] // Use first carousel image
        }
      }
      ogImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=630&q=80"
      const currentUrl = `https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/studio/${params.studioId}`
      const description = studioData.aboutStudio 
        ? `${studioData.aboutStudio.substring(0, 160)}...`
        : `Explore ${studioName} for ${danceStyles} in ${city} by ${studioFounder}.`
      
      return {
        title: `${studioName} - ${city} - ${danceStyles}`,
        description: description,
        openGraph: {
          title: `${studioName} - ${city}`,
          description: description,
          type: 'website',
          url: currentUrl,
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: `${studioName} - ${city}`,
            },
          ],
          siteName: 'Nritya',
        },
        twitter: {
          card: 'summary_large_image',
          title: `${studioName} - ${city}`,
          description: description,
          images: [ogImage],
        },
        alternates: {
          canonical: currentUrl,
        },
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: 'Studio Details - Nritya',
    description: 'Explore dance studio details, classes, and contact information on Nritya',
    openGraph: {
      title: 'Studio Details - Nritya',
      description: 'Explore dance studio details, classes, and contact information on Nritya',
      type: 'website',
      url: `https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/studio/${params.studioId}`,
      images: [
        {
          url: 'https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/logo.png',
          width: 1200,
          height: 630,
          alt: 'Nritya - Dance Studio Platform',
        },
      ],
      siteName: 'Nritya',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Studio Details - Nritya',
      description: 'Explore dance studio details, classes, and contact information on Nritya',
      images: ['https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/logo.png'],
    },
  }
}

// Client wrapper components
const ClientHeader = dynamic(() => import('../../components/ClientHeader'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      width: '100%', 
      height: '7vh', 
      backgroundColor: "black", 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <Skeleton variant="rectangular" animation="wave" sx={{ height: '100%' }} />
    </div>
  )
})

const ClientFooter = dynamic(() => import('../../components/ClientFooter'), {
  ssr: false
})

const ImageCarousel = dynamic(() => import('../../components/ImageCarousel'), {
  ssr: false
})

// Server component to fetch studio data
async function getStudioData(studioId) {
  try {
    const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/"
    const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`
    
    // Fetch studio text data
    const responseText = await fetch(`${BASEURL_STUDIO}${studioId}/text/`, {
      cache: 'no-store' // Disable caching for fresh data
    })
    
    if (!responseText.ok) {
      throw new Error('Failed to fetch studio data')
    }
    
    const studioData = await responseText.json()
    
    // Fetch studio images
    const responseImages = await fetch(`${BASEURL_STUDIO}${studioId}/images/`, {
      cache: 'no-store'
    })
    
    let carouselImages = []
    let announcementImages = []
    
    if (responseImages.ok) {
      const imagesData = await responseImages.json()
      if (imagesData && imagesData.StudioImages) {
        carouselImages = Array.isArray(imagesData.StudioImages) 
          ? imagesData.StudioImages.filter(image => typeof image === 'string' && !image.includes(`${studioId}/?Expire`))
          : []
      }
      
      if (imagesData && imagesData.StudioAnnouncements) {
        announcementImages = imagesData.StudioAnnouncements
      }
    }
    
    return {
      studioData,
      carouselImages,
      announcementImages
    }
  } catch (error) {
    console.error('Error fetching studio data:', error)
    return {
      studioData: null,
      carouselImages: [],
      announcementImages: []
    }
  }
}

// Simple StudioFullPage component for SSR
function StudioFullPage({ studioData, carouselImages, announcementImages, studioId }) {
  if (!studioData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Studio Not Found</h1>
          <p className="text-gray-600">The studio you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Content Row - Studio Header and About */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column - Studio Info */}
        <div className="lg:col-span-8">
          {/* Studio Name and Rating */}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-900" style={{ textTransform: 'none' }}>{studioData.studioName}</h1>
            {studioData.avgRating > 0 && studioData.ratedBy > 0 && (
              <div className="flex items-center">
                <span className="text-yellow-500 text-xl">⭐</span>
                <span className="ml-1 font-semibold">{studioData.avgRating.toFixed(1)}</span>
                <span className="ml-1 text-gray-600">({studioData.ratedBy})</span>
              </div>
            )}
          </div>
          
          {/* Social Links */}
          {(studioData.facebook || studioData.youtube || studioData.instagram || studioData.twitter) && (
            <div className="flex space-x-4 mb-4">
              {studioData.youtube && (
                <a href={studioData.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                  YouTube
                </a>
              )}
              {studioData.facebook && (
                <a href={studioData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                  Facebook
                </a>
              )}
              {studioData.instagram && (
                <a
                  href={
                    studioData.instagram.startsWith('http://') || studioData.instagram.startsWith('https://')
                      ? studioData.instagram
                      : `https://${studioData.instagram}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-700"
                >
                  Instagram
                </a>
              )}
              {studioData.twitter && (
                <a href={studioData.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                  Twitter
                </a>
              )}
            </div>
          )}

          {/* About Studio */}
          {studioData.aboutStudio && (
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-3" style={{ textTransform: 'none' }}>About Studio</h2>
                <p className="text-gray-700 leading-relaxed">{studioData.aboutStudio}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Founder Info and Contact */}
        <div className="lg:col-span-4 space-y-4">
          {/* About Founder */}
          {studioData.aboutFounder && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2" style={{ textTransform: 'none' }}>{studioData.founderName || "Founder"}</h3>
              <p className="text-sm text-gray-600 mb-2" style={{ textTransform: 'none' }}>Founder</p>
              <p className="text-gray-700" style={{ textTransform: 'none' }}>{studioData.aboutFounder}</p>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col space-y-3">
              {studioData.whatsappNumber && (
                <a 
                  href={`https://wa.me/91${studioData.whatsappNumber}?text=Hey, I found your Studio on nritya.co.in. I&apos;m interested`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-center hover:bg-green-700 transition-colors"
                >
                  Text Studio
                </a>
              )}
              {studioData.mobileNumber && (
                <a 
                  href={`tel:${studioData.mobileNumber}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition-colors"
                >
                  Call Studio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

            {/* Contact Information */}
            <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {studioData.mobileNumber && (
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<FaPhoneAlt />}
                href={`tel:${studioData.mobileNumber}`}
                className="flex-1"
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                Call Studio
              </Button>
            )}
            {studioData.whatsappNumber && (
              <Button 
                variant="contained"
                startIcon={<FaWhatsapp />}
                href={`https://wa.me/91${studioData.whatsappNumber}?text=Hey, I found your Studio on nritya.co.in. I'm interested`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                sx={{
                  backgroundColor: '#25d366',
                  '&:hover': {
                    backgroundColor: '#128c7e'
                  }
                }}
              >
                Text Studio
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Dance Styles */}
      {studioData.danceStyles && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold" style={{ textTransform: 'none' }}>Dance styles</h2>
          <div className="flex flex-wrap gap-1">
            {studioData.danceStyles.split(',').map((style, index) => (
              <Chip
                key={index}
                label={style.trim()}
                sx={{
                  backgroundColor: index % 4 === 0 ? '#ef4444' :
                                index % 4 === 1 ? '#eab308' :
                                index % 4 === 2 ? '#22c55e' :
                                '#3b82f6',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: index % 4 === 0 ? '#dc2626' :
                                  index % 4 === 1 ? '#ca8a04' :
                                  index % 4 === 2 ? '#16a34a' :
                                  '#2563eb'
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Studio Images Carousel */}
      {carouselImages.length > 0 && (
        <div className="mb-8">
          <ImageCarousel images={carouselImages} title="Studio Photos" />
        </div>
      )}

      {/* Studio Timings */}
      {studioData.timings && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ textTransform: 'none' }}>Studio Timings</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 text-sm">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                const dayKey = day.toLowerCase();
                const timing = studioData.timings[dayKey];
                let displayText = 'Closed';
                
                if (timing) {
                  if (typeof timing === 'string') {
                    displayText = timing;
                  } else if (typeof timing === 'object' && timing.open && timing.close) {
                    displayText = `${timing.open} - ${timing.close}`;
                  } else if (typeof timing === 'object') {
                    displayText = JSON.stringify(timing);
                  }
                }
                
                return (
                  <div key={day} className="text-center">
                    <div className="font-semibold mb-2">{day}</div>
                    <div className="text-gray-600">
                      {displayText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Class Schedule */}
      {studioData.tableData && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Class Schedule</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-gray-600">Class schedule information available</div>
          </div>
        </div>
      )}

      {/* Announcements */}
      {announcementImages.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          <ImageCarousel images={announcementImages} title="Announcements" />
        </div>
      )}

      {/* Amenities */}
      {studioData.addAmenities && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {studioData.addAmenities.split(',').map((amenity, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
              >
                {amenity.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Enrollment Process */}
      {studioData.enrollmentProcess && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Enrollment Process</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-700 whitespace-pre-wrap">{studioData.enrollmentProcess}</p>
          </div>
        </div>
      )}

      {/* Location and Map */}
      {studioData.city && (
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3">
              <h2 className="text-xl font-semibold mb-4">Get Directions</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-700">
                  {[
                    studioData.buildingName,
                    studioData.street,
                    studioData.landmark,
                    studioData.city
                  ].filter(Boolean).join(', ')}
                </p>
                {studioData.geolocation && (
                  <a
                    href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700"
                  >
                    <span>View on Map</span>
                  </a>
                )}
              </div>
            </div>
            <div className="lg:col-span-9">
              {studioData.geolocation && studioData.geolocation.lat && studioData.geolocation.lng ? (
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-gray-600">Map Component</span>
                </div>
              ) : (
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-gray-600">Location not available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Stack direction="horizontal" gap={1} className='mb-8'>
                    {studioData && studioData.whatsappNumber && (
                      <Button className='custom-btn-wa' size="md" style={{ color: "white" }}>
                        <a
                          href={`https://wa.me/91${studioData.whatsappNumber}?text=Hey, I found your Studio on nritya.co.in. I'm interested`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ backgroundColor: 'transparent', color: "white" }}
                        >
                          Text Studio <FaWhatsapp style={{ 'marginLeft': '2px' }} />
                        </a>
                      </Button>
                    )}
                    {studioData && studioData.mobileNumber && (
                      <Button className='custom-btn' size="md">
                        <a
                          href={`tel:${studioData.mobileNumber}`}
                          rel="noopener noreferrer"
                          style={{ backgroundColor: 'transparent', color: 'white' }}
                        >
                          Call Studio <FaPhoneAlt style={{ 'marginLeft': '2px' }} />
                        </a>
                      </Button>
                    )}

                  </Stack>


    </div>
  )
}

// Loading component
function StudioLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton variant="rectangular" animation="wave" height="100vh" />
    </div>
  )
}

export default async function StudioPageWrapper({ params }) {
  const { studioData, carouselImages, announcementImages } = await getStudioData(params.studioId)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%' }}>
        <Suspense fallback={<StudioLoading />}>
          <StudioFullPage 
            studioData={studioData}
            carouselImages={carouselImages}
            announcementImages={announcementImages}
            studioId={params.studioId}
          />
        </Suspense>
      </main>
      <ClientFooter />
    </div>
  )
} 