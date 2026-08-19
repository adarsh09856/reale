export const DZONGKHAGS = [
  'Thimphu', 'Paro', 'Punakha', 'Chukha / Phuentsholing', 'Bumthang',
  'Wangdue Phodrang', 'Haa', 'Samtse', 'Sarpang / Gelephu', 'Trashigang',
  'Trongsa', 'Mongar', 'Samdrup Jongkhar', 'Zhemgang', 'Dagana',
  'Gasa', 'Lhuentse', 'Pema Gatshel', 'Trashi Yangtse', 'Tsirang'
];

export const POPULAR_SEARCHES = [
  'Thimphu', 'Paro', 'Punakha', 'Phuentsholing', 'Land for Sale'
];

export const PROPERTY_TYPES = [
  'All Types',
  'Houses & Traditional Villas',
  'Apartments & Condos',
  'Commercial Spaces & Retail',
  'Residential Land & Plots',
  'Agricultural Land'
];

export const CATEGORIES = [
  'All Categories',
  'For Sale',
  'For Rent / Lease',
  'New Project',
  'Commercial Investment'
];

export const BUDGET_RANGES = [
  'Any Budget',
  'Under Nu. 25,000 /mo',
  'Nu. 25,000 - 60,000 /mo',
  'Nu. 50 Lakh - 1.5 Crore',
  'Nu. 1.5 Crore - 3 Crore',
  'Above Nu. 3 Crore'
];

export const FEATURED_PROPERTIES = [
  {
    id: 'prop-1',
    title: 'Modern 3BHK Villa',
    location: 'Changzamtog, Thimphu',
    dzongkhag: 'Thimphu',
    priceNu: 14500000,
    priceDisplay: 'Nu. 1,45,00,000',
    type: 'Houses & Traditional Villas',
    category: 'For Sale',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' },
      { text: 'Featured', color: 'bg-[#d97706] text-white' }
    ],
    beds: 3,
    baths: 3,
    area: '2,200 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Stunning modern Bhutanese architecture villa in prime Changzamtog. Features timber craft ceilings, heated master suite, panoramic mountain views, and verified Lagthram title.',
    agent: {
      name: 'Tashi Wangchuk Dorji',
      phone: '+975 17 123456',
      role: 'Principal Real Estate Broker'
    }
  },
  {
    id: 'prop-2',
    title: '2BHK Apartment',
    location: 'Kawajangsa, Thimphu',
    dzongkhag: 'Thimphu',
    priceNu: 25000,
    priceDisplay: 'Nu. 25,000 /month',
    type: 'Apartments & Condos',
    category: 'For Rent',
    badges: [
      { text: 'For Rent', color: 'bg-blue-600 text-white' },
      { text: 'Featured', color: 'bg-[#d97706] text-white' }
    ],
    beds: 2,
    baths: 2,
    area: '1,100 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Charming newly renovated apartment near Motithang. Features wooden flooring, high-speed fiber internet, and 24/7 water supply.',
    agent: {
      name: 'Sonam Pelden',
      phone: '+975 17 234567',
      role: 'Property Consultant'
    }
  },
  {
    id: 'prop-3',
    title: 'Residential Land',
    location: 'Punakha',
    dzongkhag: 'Punakha',
    priceNu: 1800000,
    priceDisplay: 'Nu. 18,00,000 /decimal',
    type: 'Residential Land & Plots',
    category: 'For Sale',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' },
      { text: 'New', color: 'bg-emerald-600 text-white' }
    ],
    beds: 0,
    baths: 0,
    area: '0.25 Acre',
    unitDetail: 'Land • 0.25 Acre',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'Scenic fertile land parcel with direct river view and road access in Punakha valley. Clear eSakor land registry record.',
    agent: {
      name: 'Ugyen Wangdi',
      phone: '+975 17 345678',
      role: 'Land Acquisition Specialist'
    }
  },
  {
    id: 'prop-4',
    title: 'Commercial Space',
    location: 'Babesa, Thimphu',
    dzongkhag: 'Thimphu',
    priceNu: 65000,
    priceDisplay: 'Nu. 65,000 /month',
    type: 'Commercial Spaces & Retail',
    category: 'For Rent',
    badges: [
      { text: 'For Rent', color: 'bg-blue-600 text-white' },
      { text: 'Featured', color: 'bg-[#d97706] text-white' }
    ],
    beds: 0,
    baths: 1,
    area: '850 Sq.Ft',
    unitDetail: '850 Sq.Ft • 1 Bath',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'Highway-facing prime commercial showroom and office floor in modern Babesa IT cluster with generous parking.',
    agent: {
      name: 'Karma Dorji',
      phone: '+975 17 456789',
      role: 'Commercial Leasing Advisor'
    }
  },
  {
    id: 'prop-5',
    title: 'Duplex House',
    location: 'Taba, Thimphu',
    dzongkhag: 'Thimphu',
    priceNu: 18000000,
    priceDisplay: 'Nu. 1,80,00,000',
    type: 'Houses & Traditional Villas',
    category: 'For Sale',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' },
      { text: 'New', color: 'bg-emerald-600 text-white' }
    ],
    beds: 4,
    baths: 3,
    area: '2,900 Sq.Ft',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    description: 'Executive 4BHK duplex residence in tranquil Taba with solar water heating, prayer room, and garden.',
    agent: {
      name: 'Tashi Wangchuk Dorji',
      phone: '+975 17 123456',
      role: 'Principal Real Estate Broker'
    }
  }
];

export const FEATURED_VEHICLES = [
  {
    id: 'veh-1',
    title: 'Toyota Fortuner 2019',
    location: 'Thimphu',
    dzongkhag: 'Thimphu',
    priceNu: 3250000,
    priceDisplay: 'Nu. 32,50,000',
    fuel: 'Diesel',
    mileage: '55,000 km',
    transmission: 'Automatic',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' }
    ],
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    description: 'Fully loaded 4x4 rugged SUV, genuine Bhutan single owner, full service record at STCBL, RSTA fitness passed.',
    seller: {
      name: 'Karma Tshering',
      phone: '+975 17 567890',
      role: 'Automotive Dealer'
    }
  },
  {
    id: 'veh-2',
    title: 'Hyundai Verna 2018',
    location: 'Phuentsholing',
    dzongkhag: 'Chukha / Phuentsholing',
    priceNu: 1275000,
    priceDisplay: 'Nu. 12,75,000',
    fuel: 'Petrol',
    mileage: '42,000 km',
    transmission: 'Manual',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' }
    ],
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    description: 'Premium sedan with alloy wheels, leather upholstery, touchscreen infotainment, pristine condition.',
    seller: {
      name: 'Sonam Wangmo',
      phone: '+975 17 678901',
      role: 'Private Seller'
    }
  },
  {
    id: 'veh-3',
    title: 'Mahindra Pik-Up 2020',
    location: 'Paro',
    dzongkhag: 'Paro',
    priceNu: 1850000,
    priceDisplay: 'Nu. 18,50,000',
    fuel: 'Diesel',
    mileage: '38,000 km',
    transmission: 'Manual',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' },
      { text: 'New', color: 'bg-emerald-600 text-white' }
    ],
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty 4WD double cab utility pickup. Perfect for Bhutan highway trips, construction, and agricultural transport.',
    seller: {
      name: 'Dawa Zangpo',
      phone: '+975 17 789012',
      role: 'Fleet Manager'
    }
  },
  {
    id: 'veh-4',
    title: 'Honda CR-V 2021',
    location: 'Thimphu',
    dzongkhag: 'Thimphu',
    priceNu: 2890000,
    priceDisplay: 'Nu. 28,90,000',
    fuel: 'Petrol',
    mileage: '22,000 km',
    transmission: 'Automatic',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' }
    ],
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury compact SUV, AWD, sunroof, lane watch camera, mint condition with comprehensive Bhutan insurance.',
    seller: {
      name: 'Tashi Dorji',
      phone: '+975 17 123456',
      role: 'Verified Vehicle Broker'
    }
  },
  {
    id: 'veh-5',
    title: 'Suzuki Swift 2019',
    location: 'Gelephu',
    dzongkhag: 'Sarpang / Gelephu',
    priceNu: 850000,
    priceDisplay: 'Nu. 8,50,000',
    fuel: 'Petrol',
    mileage: '31,000 km',
    transmission: 'Manual',
    badges: [
      { text: 'For Sale', color: 'bg-[#b91c1c] text-white' },
      { text: 'New', color: 'bg-emerald-600 text-white' }
    ],
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Economical city hatchback with high fuel efficiency, pristine AC and audio system. Clear ownership papers.',
    seller: {
      name: 'Pema Lhamo',
      phone: '+975 17 890123',
      role: 'Private Owner'
    }
  }
];

export const DASHBOARD_ROLES = [
  {
    id: 'admin',
    title: 'Admin',
    description: 'Manage the entire platform, users, and all listings.',
    btnText: 'Admin Login',
    iconColor: 'bg-rose-50 text-[#b91c1c] border-rose-200',
    icon: 'Crown'
  },
  {
    id: 'agent',
    title: 'Agent',
    description: 'Post properties, manage listings and enquiries.',
    btnText: 'Agent Login',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: 'User'
  },
  {
    id: 'broker',
    title: 'Broker',
    description: 'Manage your property portfolios and clients.',
    btnText: 'Broker Login',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: 'Briefcase'
  },
  {
    id: 'owner',
    title: 'House Owner / Seller',
    description: 'List your property or vehicle for sale or rent.',
    btnText: 'Owner Login',
    iconColor: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: 'Home'
  },
  {
    id: 'buyer',
    title: 'Buyer / Tenant',
    description: 'Find properties or vehicles that match your needs.',
    btnText: 'Buyer Login',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: 'Users'
  }
];
