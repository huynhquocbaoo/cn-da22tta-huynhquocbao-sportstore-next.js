export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Bước 1: Loại sản phẩm (Áo, Quần, Giày, Kính, Dụng cụ thể thao)
export const productCategories: ProductCategory[] = [
  {
    id: 'ao',
    name: 'Áo',
    description: 'Áo thể thao các loại',
    icon: '👕'
  },
  {
    id: 'quan',
    name: 'Quần',
    description: 'Quần thể thao các loại',
    icon: '👖'
  },
  {
    id: 'giay',
    name: 'Giày',
    description: 'Giày thể thao các loại',
    icon: '👟'
  },
  {
    id: 'kinh',
    name: 'Kính',
    description: 'Kính thể thao, kính bơi, kính đạp xe',
    icon: '🥽'
  },
  {
    id: 'dung-cu',
    name: 'Dụng cụ thể thao',
    description: 'Bóng, vợt, thảm, và các dụng cụ thể thao khác',
    icon: '🏀'
  },
  {
    id: 'phu-kien',
    name: 'Phụ kiện',
    description: 'Mũ, găng tay, tất, túi, bình nước và phụ kiện khác',
    icon: '🎒'
  }
];

// Hàm lấy danh sách thể loại
export const getCategories = (): ProductCategory[] => {
  return productCategories;
};

// Hàm lấy thể loại theo ID
export const getCategoryById = (id: string): ProductCategory | undefined => {
  return productCategories.find(category => category.id === id);
};

// Hàm lấy tên thể loại theo ID
export const getCategoryName = (id: string): string => {
  const category = getCategoryById(id);
  return category ? category.name : 'Không xác định';
};
