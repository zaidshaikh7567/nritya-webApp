import { Suspense } from 'react'
import { Skeleton } from '@mui/material'
import dynamic from 'next/dynamic'

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
      return {
        title: `${studioName} - ${city} - ${danceStyles}`,
        description: studioData.aboutStudio 
          ? `${studioData.aboutStudio.substring(0, 160)}...`
          : `Explore ${studioName} for ${danceStyles} in ${city} by ${studioFounder}.`,
        openGraph: {
          title: `${studioName} - ${city}`,
          description: studioData.aboutStudio 
            ? `${studioData.aboutStudio.substring(0, 160)}...`
            : `Explore ${studioName} for ${danceStyles} in ${city} by ${studioFounder}`,
          type: 'website',
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
          <p className="text-gray-600">The studio you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Studio Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{studioData.studioName}</h1>
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
      </div>

      {/* About Studio */}
      {studioData.aboutStudio && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">About Studio</h2>
          <p className="text-gray-700 leading-relaxed">{studioData.aboutStudio}</p>
        </div>
      )}

      {/* Dance Styles */}
      {studioData.danceStyles && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Dance Styles</h2>
          <div className="flex flex-wrap gap-2">
            {studioData.danceStyles.split(',').map((style, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {style.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Studio Images Carousel */}
      <ImageCarousel images={carouselImages} title="Studio Photos" />

      {/* Contact Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studioData.mobileNumber && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">Phone:</span>
              <a href={`tel:${studioData.mobileNumber}`} className="text-blue-600 hover:text-blue-700">
                {studioData.mobileNumber}
              </a>
            </div>
          )}
          {studioData.whatsappNumber && (
            <div className="flex items-center space-x-2">
              <span className="font-medium">WhatsApp:</span>
              <a 
                href={`https://wa.me/91${studioData.whatsappNumber}?text=Hey, I found your Studio on nritya.co.in. I'm interested`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700"
              >
                {studioData.whatsappNumber}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Address */}
      {studioData.city && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Location</h2>
          <p className="text-gray-700">
            {[
              studioData.buildingName,
              studioData.street,
              studioData.landmark,
              studioData.city
            ].filter(Boolean).join(', ')}
          </p>
        </div>
      )}

      {/* Amenities */}
      {studioData.addAmenities && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Amenities</h2>
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

      {/* Announcements Carousel */}
      <ImageCarousel images={announcementImages} title="Announcements" />
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