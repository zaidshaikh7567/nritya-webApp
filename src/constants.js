import { FaSnowflake, FaWifi, FaTint, FaToilet, FaPlug, FaFireExtinguisher, FaFirstAid, FaVideo, FaCreditCard, FaParking  } from 'react-icons/fa';

export const STATUSES = {
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under review",
    REVIEWED: "Reviewed",
    VERIFIED: "Verified",
    VERIFICATION_FAILED: "Failed Verification",
};

export const DRAFT_COLLECTIONS = {
    DRAFT_STUDIOS: 'DraftStudios',
    DRAFT_WORKSHOPS: 'DraftWorkshops',
    DRAFT_OPEN_CLASSES: 'DraftOpenClasses',
    DRAFT_COURSES: 'DraftCourses'
};

export const COLLECTIONS ={
    USER: "User",
    USER_KYC:"UserKyc",
    WORKSHOP:"Workshop",
    ADMIN:"Admin",
    REVIEWS: "Reviews",
    TRANSACTIONS: "Transactions",
    STUDIO: "Studio",
    INSTRUCTORS: "Instructors",
    FREE_TRIAL_BOOKINGS:"FreeTrialBookings",
    WORKSHOPS: 'Workshops',
    OPEN_CLASSES: 'OpenClasses',
    COURSES: 'Courses',
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

