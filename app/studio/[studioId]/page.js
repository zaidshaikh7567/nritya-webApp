import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from '@mui/material'
import { BASEURL_PROD } from '../../../src/constants'
import StudioFullPage from '../../../src/Screens/StudioFullPage'

// Generate dynamic metadata for studio pages
export async function generateMetadata({ params }) {
  try {
    const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`
    const BASEURL_ICON= `${BASEURL_PROD}imagesCrud/studioIcon/`
    
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
      const responseImages = await fetch(`${BASEURL_ICON}${params.studioId}/`, {
        cache: 'no-store'
      })
      
      let ogImage = 'https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/logo.png' // Default image
      console.log("responseImages")
      console.log(responseImages)
      if (responseImages.ok) {
        const imagesData = await responseImages.json()
        console.log("imagesData")


        console.log(imagesData)
        if (imagesData.image_urls && imagesData.image_urls.length > 0) {
          ogImage = imagesData.image_urls[0] // Use first carousel image
          console.log(ogImage)
        }
      }
      //ogImage = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&h=630&q=80"
      const currentUrl = `https://nritya-webapp-ssr-1-b3a1c0b4b8f2.herokuapp.com/studio/${params.studioId}`
      const description = studioData.aboutStudio 
        ? `${studioData.aboutStudio.substring(0, 160)}...`
        : `Explore ${studioName} for ${danceStyles} in ${city} by ${studioFounder}.`
      
      return {
        title: `${studioName} - ${city} - ${danceStyles}`,
        subtitle: `${danceStyles}`,
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
          subtitle: `${danceStyles}`,
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

// Fetch minimal data on the server to hydrate the client screen
async function getStudioData(studioId) {
  try {
    const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`

    let studioData = null
    try {
      const responseText = await fetch(`${BASEURL_STUDIO}${studioId}/text/`, { cache: 'no-store' })
      if (responseText.ok) {
        studioData = await responseText.json()
      }
    } catch {}

    let carouselImages = []
    let announcementImages = []
    try {
      const responseImages = await fetch(`${BASEURL_STUDIO}${studioId}/images/`, { cache: 'no-store' })
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
    } catch {}

    return { studioData, carouselImages, announcementImages }
  } catch {
    return { studioData: null, carouselImages: [], announcementImages: [] }
  }
}

// Loading component
function StudioLoading() {
  return (
    <div className="px-3 py-8">
      <Skeleton variant="rectangular" animation="wave" height="100vh" />
    </div>
  )
}

export default async function StudioPageWrapper({ params }) {
  const { studioData, carouselImages, announcementImages } = await getStudioData(params.studioId)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ClientHeader />
      <main className='py-1 flex-grow-1' style={{ width: '100%', paddingLeft: 12, paddingRight: 12 }}>
        <Suspense fallback={<StudioLoading />}>
          <StudioFullPage
            studioId={params.studioId}
            initialData={{ studioData, carouselImages, announcementImages }}
            isSSR={true}
          />
        </Suspense>
      </main>
      <ClientFooter />
    </div>
  )
} 