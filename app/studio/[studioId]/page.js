import { Suspense } from 'react'
import { Button, Skeleton, Stack, Chip, Paper, Grid } from '@mui/material'
import dynamic from 'next/dynamic'
import { FaPhoneAlt, FaWhatsapp, FaYoutube, FaFacebook, FaInstagram, FaTwitter, FaSnowflake, FaWifi, FaTint, FaToilet, FaPlug, FaFireExtinguisher, FaFirstAid, FaVideo, FaCreditCard, FaParking, FaMapMarkerAlt } from 'react-icons/fa'
import { Row, Col } from 'react-bootstrap'

// Dynamic import for MapReadOnly component
const MapReadOnly = dynamic(() => import('../../components/MapReadOnly'), {
  ssr: false,
  loading: () => (
    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
      <Skeleton variant="rectangular" animation="wave" width="100%" height="100%" />
    </div>
  )
})

// Amenities icons mapping
export const AMENITIES_ICONS = {
    "AC": <FaSnowflake />,
    "Free Wifi": <FaWifi />,
    "RO Water": <FaTint />,
    "Toilet": <FaToilet />,
    "Power Backup": <FaPlug />,
    "Fire Extinguisher": <FaFireExtinguisher />,
    "First Aid Kit": <FaFirstAid />,
    "CCTV Camera": <FaVideo />,
    "Card Payment": <FaCreditCard />,
    "Parking Space": <FaParking />,
};

// Generate dynamic metadata for studio pages
export async function generateMetadata({ params }) {
  try {
    const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/"
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

// Dynamic imports for client components
const ImageCarousel = dynamic(() => import('../../components/ImageCarousel'), {
  ssr: false
})

const TableCarousel = dynamic(() => import('../../components/TableCarousel'), {
  ssr: false
})



// Server component to fetch studio data
async function getStudioData(studioId) {
  try {
    const BASEURL_PROD = "https://nrityaserver-2b241e0a97e5.herokuapp.com/"
    const BASEURL_STUDIO = `${BASEURL_PROD}api/studio/`
    
    // Fetch studio text data
    let studioData = null
    
    try {
      const responseText = await fetch(`${BASEURL_STUDIO}${studioId}/text/`, {
        cache: 'no-store' // Disable caching for fresh data
      })
      
      if (responseText.ok) {
        studioData = await responseText.json()
      } else {
        console.error('Failed to fetch studio data:', responseText.status, responseText.statusText)
      }
    } catch (error) {
      console.error('Error fetching studio text data:', error)
    }
    
    // Fetch studio images
    let carouselImages = []
    let announcementImages = []
    
    try {
      const responseImages = await fetch(`${BASEURL_STUDIO}${studioId}/images/`, {
        cache: 'no-store'
      })
      
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
    } catch (error) {
      console.error('Error fetching studio images:', error)
      // Keep empty arrays if image fetch fails
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
      <div className="px-3 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Studio Not Found</h1>
          <p className="text-gray-600">The studio you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 py-8">
      {/* Main Content Row - Studio Header and About */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Left Column - Studio Info */}
        <Grid item xs={12} lg={8}>
          {/* Studio Name and Rating */}
          <Grid container alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs>
              <h1 className="text-3xl font-bold text-gray-900" style={{ textTransform: 'none' }}>{studioData.studioName}</h1>
            </Grid>
            {studioData.avgRating > 0 && studioData.ratedBy > 0 && (
              <Grid item>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="ml-1 font-semibold">{studioData.avgRating.toFixed(1)}</span>
                  <span className="ml-1 text-gray-600">({studioData.ratedBy})</span>
                </div>
              </Grid>
            )}
          </Grid>
          
          {/* Social Links */}
          {(studioData.facebook || studioData.youtube || studioData.instagram || studioData.twitter) && (
            <div className="flex items-center gap-6 mb-4">
              {studioData.youtube && (
                <a href={studioData.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-50">
                  <FaYoutube className="w-18 h-18" style={{ color: "red" }} />
                </a>
              )}
              {studioData.facebook && (
                <a href={studioData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50">
                  <FaFacebook className="w-18 h-18" style={{ color: "blue" }}/>
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
                  className="text-pink-600 hover:text-pink-700 transition-colors duration-200 p-2 rounded-full hover:bg-pink-50"
                >
                  <FaInstagram className="w-18 h-18" style={{ color: "orange" }}/>
                </a>
              )}
              {studioData.twitter && (
                <a href={studioData.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50">
                  <FaTwitter className="w-18 h-18" style={{ color: "black" }}/>
                </a>
              )}
            </div>
          )}

          {/* About Studio */}
          {studioData.aboutStudio && (
            <div className="mb-6">
              <Paper elevation={2} sx={{ p: 3 }}>
                <h2 className="text-xl font-semibold mb-3" style={{ textTransform: 'none' }}>About Studio</h2>
                <p className="text-gray-700 leading-relaxed">{studioData.aboutStudio}</p>
              </Paper>
            </div>
          )}
           {studioData.danceStyles && (
        <div className="mb-1 mt-4">
          
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
        </Grid>

        {/* Right Column - Founder Info and Contact */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={2}>
            {/* About Founder */}
            {studioData.aboutFounder && (
              <Paper elevation={2} sx={{ p: 3, backgroundColor: '#000000', color: '#ffffff' }}>
                <h3 className="text-lg font-semibold mb-2 text-white" style={{ textTransform: 'none' }}>{studioData.founderName || "Founder"}</h3>
                <p className="text-sm text-gray-300 mb-2" style={{ textTransform: 'none' }}>Founder</p>
                <p className="text-gray-200" style={{ textTransform: 'none' }}>{studioData.aboutFounder}</p>
              </Paper>
            )}

            {/* Contact Buttons */}
            <Paper elevation={2} sx={{ p: 3 }}>
              <Stack spacing={2}>
                {studioData.whatsappNumber && (
                  <Button
                    variant="contained"
                    startIcon={<FaWhatsapp />}
                    href={`https://wa.me/91${studioData.whatsappNumber}?text=Hey, I found your Studio on nritya.co.in. I&apos;m interested`}
                    target="_blank"
                    rel="noopener noreferrer"
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
                {studioData.mobileNumber && (
                  <Button
                    variant="contained"
                    startIcon={<FaPhoneAlt />}
                    href={`tel:${studioData.mobileNumber}`}
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
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      {/* Studio Images Carousel */}
      {carouselImages.length > 0 && (
        <div className="mb-8">
          <ImageCarousel images={carouselImages} title="Studio Photos" />
        </div>
      )}

      {studioData.timings && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4" style={{ textTransform: 'none' }}>
            Studio Timings
          </h2>

          {/* Desktop View */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left px-4 py-2 border">Day</th>
                  <th className="text-left px-4 py-2 border">Timing</th>
                </tr>
              </thead>
              <tbody>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const dayKey = day.toLowerCase();
                  const timing = studioData.timings?.[dayKey];

                  let displayText = 'Closed';
                  let textColor = 'text-red-600';
                  
                  if (Array.isArray(timing) && timing.length > 0) {
                    // Handle multiple timings
                    const timingStrings = timing.map(t => {
                      if (t?.open && t?.close) {
                        return t.open !== 'Closed' ? `${t.open} - ${t.close}` : 'Closed';
                      }
                      return 'Closed';
                    }).filter(t => t !== 'Closed');
                    
                    if (timingStrings.length > 0) {
                      displayText = timingStrings.join(', ');
                      textColor = 'text-green-600';
                    }
                  } else if (typeof timing === 'object' && timing?.open && timing?.close) {
                    displayText = `${timing.open} - ${timing.close}`;
                    textColor = 'text-green-600';
                  } else if (typeof timing === 'string') {
                    displayText = timing;
                  }

                  return (
                    <tr key={day} className="border-t">
                      <td className="px-4 py-2 font-semibold text-white bg-black border-b">{day}</td>
                      <td className={`px-4 py-2 ${textColor} border`}>{displayText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


                    {/* Class Schedule with TableCarousel */}
        {studioData.tableData && (
          <div className="mb-8">
            <TableCarousel 
              tableData={studioData.tableData} 
              title="Class Schedule"
            />
          </div>
        )}

      {/* Announcements */}
      {announcementImages.length > 0 && (
        <div className="mb-1">
          <h2 className="text-xl font-semibold mb-1 mt-2" style={{ textTransform: 'none' }}>Announcements</h2>
          <ImageCarousel images={announcementImages} title="" />
        </div>
      )}

            {/* Amenities */}
      {studioData.addAmenities && (
        <div className="mb-1">
          <h2 className="text-xl font-semibold mb-1 mt-2" style={{ textTransform: 'none' }}>Amenities</h2>
          <div className="flex flex-wrap gap-3">
            {studioData.addAmenities.split(',').map((amenity, index) => {
              const trimmedAmenity = amenity.trim();
              const IconComponent = AMENITIES_ICONS[trimmedAmenity];
              
              return (
                <Chip
                  key={index}
                  label={
                    <div className="flex items-center space-x-2">
                      {IconComponent && (
                        <span className="text-blue-600">
                          {IconComponent}
                        </span>
                      )}
                      <span> {' '}</span>
                      <span>{trimmedAmenity}</span>
                    </div>
                  }
                  sx={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: '#e5e7eb'
                    },
                    '& .MuiChip-label': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }
                  }}
                />
              );
            })}
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
          <Row>
            <Col md={3} lg={3} className="d-flex flex-column">
              <div className="d-flex align-items-center mb-4">
                <h2 className="text-xl font-semibold mb-0" style={{ textTransform: 'none' }}>Get Directions</h2>
                {studioData.geolocation && (
                  <a
                    href={`https://www.google.com/maps?q=${studioData.geolocation.lat},${studioData.geolocation.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2 p-1"
                  >
                    <FaMapMarkerAlt 
                      style={{ width: "24px", height: "24px", color: "#1976d2" }}
                    />
                  </a>
                )}
              </div>
              <div className="mb-4">
                <p className="text-gray-700" style={{ fontSize: '20px' }}>
                  {`${studioData.buildingName ? studioData.buildingName + (studioData.buildingName.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.street ? studioData.street + (studioData.street.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.landmark ? studioData.landmark + (studioData.landmark.slice(-1) !== ',' ? ', ' : '') : ''}${studioData.city ? studioData.city : ''}`}
                </p>
              </div>
            </Col>
            <Col md={9} lg={9}>
              {studioData.geolocation && studioData.geolocation.lat && studioData.geolocation.lng ? (
                <MapReadOnly selectedLocationParam={studioData.geolocation} />
              ) : (
                <div className="bg-gray-200 rounded h-64 d-flex align-items-center justify-content-center">
                  <span className="text-gray-600">Location not available</span>
                </div>
              )}
            </Col>
          </Row>
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