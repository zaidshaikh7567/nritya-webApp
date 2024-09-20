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

export const COLORS = {
    GREEN: { backgroundColor: "#28a745", color: "#fff" },     // Green background, white text
    BLUE: { backgroundColor: "#007bff", color: "#fff" },      // Blue background, white text
    YELLOW: { backgroundColor: "#ffc107", color: "#000" },    // Yellow background, black text
    RED: { backgroundColor: "#dc3545", color: "#fff" },       // Red background, white text
    PURPLE: { backgroundColor: "#6f42c1", color: "#fff" },    // Purple background, white text
    ORANGE: { backgroundColor: "#fd7e14", color: "#fff" },    // Orange background, white text
    TEAL: { backgroundColor: "#20c997", color: "#fff" },      // Teal background, white text
    PINK: { backgroundColor: "#e83e8c", color: "#fff" },      // Pink background, white text
    GRAY: { backgroundColor: "#6c757d", color: "#fff" },       // Gray background, white text

    LIGHTBLUE: { backgroundColor: "#17a2b8", color: "#fff" }, // Light blue background, white text
    DARKBLUE: { backgroundColor: "#343a40", color: "#fff" },  // Dark blue background, white text
    CYAN: { backgroundColor: "#00bcd4", color: "#fff" },      // Cyan background, white text
    INDIGO: { backgroundColor: "#6610f2", color: "#fff" },    // Indigo background, white text
    LIME: { backgroundColor: "#cddc39", color: "#000" },      // Lime background, black text
    AMBER: { backgroundColor: "#ffca28", color: "#000" },     // Amber background, black text
    BROWN: { backgroundColor: "#795548", color: "#fff" },     // Brown background, white text
    LIGHTGREEN: { backgroundColor: "#8bc34a", color: "#000" },// Light green background, black text
    DEEPPURPLE: { backgroundColor: "#673ab7", color: "#fff" },// Deep purple background, white text
    DEEPORANGE: { backgroundColor: "#ff5722", color: "#fff" },// Deep orange background, white text
    BLACK: { backgroundColor: "#000000", color: "#fff" },     // Black background, white text
    WHITE: { backgroundColor: "#ffffff", color: "#000" },     // White background, black text
    SILVER: { backgroundColor: "#c0c0c0", color: "#000" },    // Silver background, black text
    GOLD: { backgroundColor: "#ffd700", color: "#000" },      // Gold background, black text
    NAVY: { backgroundColor: "#001f3f", color: "#fff" },      // Navy background, white text
    OLIVE: { backgroundColor: "#3d9970", color: "#fff" },     // Olive background, white text

  };

export const CHIP_LEVELS_DESIGN = {
    [LEVELS.ALL]: COLORS.GREEN,           // Green background, white text
    [LEVELS.BEGINNERS]: COLORS.BLUE,     // Blue background, white text
    [LEVELS.INTERMEDIATE]: COLORS.YELLOW,  // Yellow background, black text
    [LEVELS.ADVANCED]: COLORS.RED      // Red background, white text
  };
  

  
export const danceStylesColorChips = [COLORS.PURPLE,COLORS.ORANGE,COLORS.TEAL,COLORS.LIME]

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
    STUDIOANNOUNCEMENTS :'StudioAnnouncements',
    USERIMAGE:'UserImage',
    INSTRUCTORIMAGES: 'InstructorImages',
    WORKSHOPICON :"WorkshopIcon",
    WORKSHOPIMAGES :"WorkshopImages",
    OPENCLASSICON :"OpenClassIcon",
    COURSEICON :"CourseIcon",
    CREATORS_KYC_DOCUMENTS :"CreatorKycDocuments"
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

