import { FaSnowflake, FaWifi, FaTint, FaToilet, FaPlug, FaFireExtinguisher, FaFirstAid, FaVideo, FaCreditCard, FaParking  } from 'react-icons/fa';

export const STATUSES = {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    REVIEWED: "Reviewed",
    VERIFIED: "Verified",
    VERIFICATION_FAILED: "Verification Failed",
};

export const DRAFT_COLLECTIONS = {
    DRAFT_STUDIOS: 'DraftStudios',
    DRAFT_WORKSHOPS: 'DraftWorkshops',
    DRAFT_OPEN_CLASSES: 'DraftOpenClasses',
    DRAFT_COURSES: 'DraftCourses'
};

export const LEVELS = {
    ALL : "All",
    BEGINNERS : "Beginner", 
    INTERMEDIATE :"Intermediate", 
    ADVANCED :"Advanced"
}

export const CHIP_LEVELS_DESIGN = {
    [LEVELS.ALL]: { backgroundColor: "#28a745", color: "#fff" },           // Green background, white text
    [LEVELS.BEGINNERS]: { backgroundColor: "#007bff", color: "#fff" },     // Blue background, white text
    [LEVELS.INTERMEDIATE]: { backgroundColor: "#ffc107", color: "#000" },  // Yellow background, black text
    [LEVELS.ADVANCED]: { backgroundColor: "#dc3545", color: "#fff" }       // Red background, white text
  };
  
  

export const COLLECTIONS = {
    USER: "User",
    USER_KYC:"UserKyc",
    ADMIN:"Admin",
    REVIEWS: "Reviews",
    TRANSACTIONS: "Transactions",
    STUDIO: "Studio",
    INSTRUCTORS: "Instructors",
    FREE_TRIAL_BOOKINGS:"FreeTrialBookings",
    WORKSHOPS: 'Workshops',
    OPEN_CLASSES: 'OpenClasses',
    COURSES: 'Courses',
    BOOKINGS: 'Bookings',
}

export const STORAGES ={
    STUDIOIMAGES:'StudioImages',
    STUDIOICON:'StudioIcon',
    USERIMAGE:'UserImage',
    INSTRUCTORIMAGES: 'InstructorImages',
    WORKSHOPICON :"WorkshopIcon",
    WORKSHOPIMAGES :"WorkshopImages",
    OPENCLASSICON :"OpenClassIcon",
    COURSEICON :"CourseIcon",
}

export const SEARCH_FILTERS ={
    DANCEFORMS:'danceforms',
    DISTANCES:'distances',
}

export const BASEURL_DEV = "http://127.0.0.1:8000/"
export const BASEURL_PROD= "https://nrityaserver-2b241e0a97e5.herokuapp.com/"

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

