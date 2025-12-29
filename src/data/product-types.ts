export interface ProductType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string; // Liên kết với loại sản phẩm từ product-categories.ts (ao, quan, giay, kinh, dung-cu, phu-kien)
}

// Bước 2: Môn thể thao
export interface SportType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const sportTypes: SportType[] = [
  {
    id: 'football',
    name: 'Bóng đá',
    description: 'Bóng đá',
    icon: '⚽'
  },
  {
    id: 'basketball',
    name: 'Bóng rổ',
    description: 'Bóng rổ',
    icon: '🏀'
  },
  {
    id: 'running',
    name: 'Chạy bộ',
    description: 'Chạy bộ',
    icon: '🏃‍♂️'
  },
  {
    id: 'gym',
    name: 'Gym & Fitness',
    description: 'Gym & Fitness',
    icon: '💪'
  },
  {
    id: 'tennis',
    name: 'Tennis',
    description: 'Tennis',
    icon: '🎾'
  },
  {
    id: 'badminton',
    name: 'Cầu lông',
    description: 'Cầu lông',
    icon: '🏸'
  },
  {
    id: 'swimming',
    name: 'Bơi lội',
    description: 'Bơi lội',
    icon: '🏊‍♂️'
  },
  {
    id: 'cycling',
    name: 'Đạp xe',
    description: 'Đạp xe',
    icon: '🚴‍♂️'
  },
  {
    id: 'yoga',
    name: 'Yoga',
    description: 'Yoga',
    icon: '🧘‍♀️'
  },
  {
    id: 'outdoor',
    name: 'Thể thao ngoài trời',
    description: 'Leo núi, cắm trại, v.v.',
    icon: '🏔️'
  },
  {
    id: 'other',
    name: 'Khác',
    description: 'Các môn thể thao khác',
    icon: '🏅'
  }
];

// Loại sản phẩm chi tiết (kết hợp category + sport)
export const productTypes: ProductType[] = [
  // Áo
  { id: 'ao-football', name: 'Áo bóng đá', description: 'Áo đấu, áo tập bóng đá', icon: '⚽👕', category: 'ao' },
  { id: 'ao-basketball', name: 'Áo bóng rổ', description: 'Áo đấu, áo tập bóng rổ', icon: '🏀👕', category: 'ao' },
  { id: 'ao-running', name: 'Áo chạy bộ', description: 'Áo thun chạy bộ', icon: '🏃‍♂️👕', category: 'ao' },
  { id: 'ao-gym', name: 'Áo tập gym', description: 'Áo tập gym', icon: '💪👕', category: 'ao' },
  { id: 'ao-tennis', name: 'Áo tennis', description: 'Áo polo tennis', icon: '🎾👕', category: 'ao' },
  { id: 'ao-badminton', name: 'Áo cầu lông', description: 'Áo cầu lông', icon: '🏸👕', category: 'ao' },
  { id: 'ao-swimming', name: 'Đồ bơi', description: 'Đồ bơi nam nữ', icon: '🏊‍♂️👙', category: 'ao' },
  { id: 'ao-cycling', name: 'Áo đạp xe', description: 'Áo đạp xe', icon: '🚴‍♂️👕', category: 'ao' },
  { id: 'ao-yoga', name: 'Áo yoga', description: 'Áo tập yoga', icon: '🧘‍♀️👕', category: 'ao' },
  { id: 'ao-outdoor', name: 'Áo outdoor', description: 'Áo thể thao ngoài trời', icon: '🏔️👕', category: 'ao' },

  // Quần
  { id: 'quan-football', name: 'Quần bóng đá', description: 'Quần đùi bóng đá', icon: '⚽🩳', category: 'quan' },
  { id: 'quan-basketball', name: 'Quần bóng rổ', description: 'Quần đùi bóng rổ', icon: '🏀🩳', category: 'quan' },
  { id: 'quan-running', name: 'Quần chạy bộ', description: 'Quần đùi, quần bó chạy bộ', icon: '🏃‍♂️🩳', category: 'quan' },
  { id: 'quan-gym', name: 'Quần tập gym', description: 'Quần đùi, quần bó tập gym', icon: '💪🩳', category: 'quan' },
  { id: 'quan-tennis', name: 'Quần tennis', description: 'Quần đùi tennis', icon: '🎾🩳', category: 'quan' },
  { id: 'quan-badminton', name: 'Quần cầu lông', description: 'Quần đùi cầu lông', icon: '🏸🩳', category: 'quan' },
  { id: 'quan-swimming', name: 'Quần bơi', description: 'Quần bơi nam nữ', icon: '🏊‍♂️🩳', category: 'quan' },
  { id: 'quan-cycling', name: 'Quần đạp xe', description: 'Quần đạp xe có đệm', icon: '🚴‍♂️🩳', category: 'quan' },
  { id: 'quan-yoga', name: 'Quần yoga', description: 'Quần bó yoga', icon: '🧘‍♀️👖', category: 'quan' },
  { id: 'quan-outdoor', name: 'Quần outdoor', description: 'Quần thể thao ngoài trời', icon: '🏔️👖', category: 'quan' },

  // Giày
  { id: 'giay-football', name: 'Giày đá bóng', description: 'Giày bóng đá sân cỏ, sân futsal', icon: '⚽👟', category: 'giay' },
  { id: 'giay-basketball', name: 'Giày bóng rổ', description: 'Giày bóng rổ chuyên nghiệp', icon: '🏀👟', category: 'giay' },
  { id: 'giay-running', name: 'Giày chạy bộ', description: 'Giày chạy bộ', icon: '🏃‍♂️👟', category: 'giay' },
  { id: 'giay-gym', name: 'Giày tập gym', description: 'Giày tập gym', icon: '💪👟', category: 'giay' },
  { id: 'giay-tennis', name: 'Giày tennis', description: 'Giày tennis', icon: '🎾👟', category: 'giay' },
  { id: 'giay-badminton', name: 'Giày cầu lông', description: 'Giày cầu lông', icon: '🏸👟', category: 'giay' },
  { id: 'giay-cycling', name: 'Giày đạp xe', description: 'Giày đạp xe', icon: '🚴‍♂️👟', category: 'giay' },
  { id: 'giay-outdoor', name: 'Giày leo núi', description: 'Giày leo núi, trekking', icon: '🏔️👟', category: 'giay' },

  // Kính
  { id: 'kinh-swimming', name: 'Kính bơi', description: 'Kính bơi chống nước', icon: '🏊‍♂️🥽', category: 'kinh' },
  { id: 'kinh-cycling', name: 'Kính đạp xe', description: 'Kính đạp xe chống nắng', icon: '🚴‍♂️🥽', category: 'kinh' },
  { id: 'kinh-outdoor', name: 'Kính outdoor', description: 'Kính thể thao ngoài trời', icon: '🏔️🥽', category: 'kinh' },
  { id: 'kinh-running', name: 'Kính chạy bộ', description: 'Kính chạy bộ chống nắng', icon: '🏃‍♂️🥽', category: 'kinh' },

  // Dụng cụ thể thao
  { id: 'dung-cu-football', name: 'Bóng đá', description: 'Quả bóng đá', icon: '⚽', category: 'dung-cu' },
  { id: 'dung-cu-basketball', name: 'Bóng rổ', description: 'Quả bóng rổ', icon: '🏀', category: 'dung-cu' },
  { id: 'dung-cu-tennis-racket', name: 'Vợt tennis', description: 'Vợt tennis', icon: '🎾', category: 'dung-cu' },
  { id: 'dung-cu-tennis-ball', name: 'Bóng tennis', description: 'Bóng tennis', icon: '🎾', category: 'dung-cu' },
  { id: 'dung-cu-badminton-racket', name: 'Vợt cầu lông', description: 'Vợt cầu lông', icon: '🏸', category: 'dung-cu' },
  { id: 'dung-cu-badminton-shuttlecock', name: 'Cầu lông', description: 'Quả cầu lông', icon: '🏸', category: 'dung-cu' },
  { id: 'dung-cu-yoga-mat', name: 'Thảm yoga', description: 'Thảm tập yoga', icon: '🧘‍♀️', category: 'dung-cu' },
  { id: 'dung-cu-yoga-blocks', name: 'Gạch yoga', description: 'Gạch hỗ trợ yoga', icon: '🧘‍♀️🧱', category: 'dung-cu' },
  { id: 'dung-cu-gym', name: 'Dụng cụ gym', description: 'Tạ, dây kháng lực, v.v.', icon: '💪🏋️', category: 'dung-cu' },

  // Phụ kiện
  { id: 'phu-kien-mu', name: 'Mũ thể thao', description: 'Mũ, nón thể thao', icon: '🧢', category: 'phu-kien' },
  { id: 'phu-kien-gang-tay', name: 'Găng tay', description: 'Găng tay thể thao', icon: '🧤', category: 'phu-kien' },
  { id: 'phu-kien-tat', name: 'Tất thể thao', description: 'Tất dài, tất ngắn', icon: '🧦', category: 'phu-kien' },
  { id: 'phu-kien-tui', name: 'Túi thể thao', description: 'Túi đựng đồ, ba lô', icon: '🎒', category: 'phu-kien' },
  { id: 'phu-kien-binh-nuoc', name: 'Bình nước', description: 'Bình nước thể thao', icon: '💧', category: 'phu-kien' },
  { id: 'phu-kien-dong-ho', name: 'Đồng hồ thể thao', description: 'Đồng hồ thông minh', icon: '⌚', category: 'phu-kien' },
  { id: 'phu-kien-khac', name: 'Phụ kiện khác', description: 'Băng tay, băng đầu, khăn, v.v.', icon: '🎽', category: 'phu-kien' },
];

// Hàm lấy danh sách môn thể thao
export const getSportTypes = (): SportType[] => {
  return sportTypes;
};

// Hàm lấy môn thể thao theo ID
export const getSportTypeById = (id: string): SportType | undefined => {
  return sportTypes.find(sport => sport.id === id);
};

// Hàm lấy tên môn thể thao theo ID
export const getSportTypeName = (id: string): string => {
  const sport = getSportTypeById(id);
  return sport ? sport.name : 'Không xác định';
};

// Hàm lấy danh sách loại sản phẩm theo thể loại (category)
export const getProductTypesByCategory = (categoryId: string): ProductType[] => {
  return productTypes.filter(type => type.category === categoryId);
};

// Hàm lấy tất cả loại sản phẩm
export const getAllProductTypes = (): ProductType[] => {
  return productTypes;
};

// Hàm lấy loại sản phẩm theo ID
export const getProductTypeById = (id: string): ProductType | undefined => {
  return productTypes.find(type => type.id === id);
};

// Hàm lấy tên loại sản phẩm theo ID
export const getProductTypeName = (id: string): string => {
  const type = getProductTypeById(id);
  return type ? type.name : 'Không xác định';
};
