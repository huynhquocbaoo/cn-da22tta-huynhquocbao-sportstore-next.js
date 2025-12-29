export interface Province {
  code: string;
  name: string;
  districts: District[];
}

export interface District {
  code: string;
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: string;
  name: string;
}

export const vietnamAddresses: Province[] = [
  {
    code: "01",
    name: "TP. Hà Nội",
    districts: [
      {
        code: "001",
        name: "Quận Ba Đình",
        wards: [
          { code: "00001", name: "Phường Phúc Xá" },
          { code: "00004", name: "Phường Trúc Bạch" },
          { code: "00006", name: "Phường Vĩnh Phú" },
          { code: "00007", name: "Phường Cống Vị" },
          { code: "00008", name: "Phường Liễu Giai" },
          { code: "00010", name: "Phường Nguyễn Trung Trực" },
          { code: "00013", name: "Phường Quán Thánh" },
          { code: "00016", name: "Phường Ngọc Hà" },
          { code: "00019", name: "Phường Điện Biên" },
          { code: "00022", name: "Phường Đội Cấn" },
          { code: "00025", name: "Phường Ngọc Khánh" },
          { code: "00028", name: "Phường Kim Mã" },
          { code: "00031", name: "Phường Giảng Võ" },
          { code: "00034", name: "Phường Thành Công" }
        ]
      },
      {
        code: "002",
        name: "Quận Hoàn Kiếm",
        wards: [
          { code: "00037", name: "Phường Phúc Tân" },
          { code: "00040", name: "Phường Đồng Xuân" },
          { code: "00043", name: "Phường Hàng Mã" },
          { code: "00046", name: "Phường Hàng Buồm" },
          { code: "00049", name: "Phường Hàng Đào" },
          { code: "00052", name: "Phường Hàng Bồ" },
          { code: "00055", name: "Phường Cửa Đông" },
          { code: "00058", name: "Phường Lý Thái Tổ" },
          { code: "00061", name: "Phường Hàng Bạc" },
          { code: "00064", name: "Phường Hàng Gai" },
          { code: "00067", name: "Phường Chương Dương Độ" },
          { code: "00070", name: "Phường Hàng Trống" },
          { code: "00073", name: "Phường Cửa Nam" },
          { code: "00076", name: "Phường Hàng Bông" },
          { code: "00079", name: "Phường Lý Thường Kiệt" },
          { code: "00082", name: "Phường Hàng Đậu" },
          { code: "00085", name: "Phường Ô Quan Chưởng" },
          { code: "00088", name: "Phường Phan Chu Trinh" },
          { code: "00091", name: "Phường Hàng Bài" }
        ]
      },
      {
        code: "003",
        name: "Quận Tây Hồ",
        wards: [
          { code: "00094", name: "Phường Phú Thượng" },
          { code: "00097", name: "Phường Nhật Tân" },
          { code: "00100", name: "Phường Tứ Liên" },
          { code: "00103", name: "Phường Quảng An" },
          { code: "00106", name: "Phường Xuân La" },
          { code: "00109", name: "Phường Yên Phụ" },
          { code: "00112", name: "Phường Bưởi" },
          { code: "00115", name: "Phường Thụy Khuê" }
        ]
      },
      {
        code: "004",
        name: "Quận Long Biên",
        wards: [
          { code: "00118", name: "Phường Thượng Thanh" },
          { code: "00121", name: "Phường Ngọc Thụy" },
          { code: "00124", name: "Phường Giang Biên" },
          { code: "00127", name: "Phường Đức Giang" },
          { code: "00130", name: "Phường Việt Hưng" },
          { code: "00133", name: "Phường Gia Thụy" },
          { code: "00136", name: "Phường Ngọc Lâm" },
          { code: "00139", name: "Phường Lâm Du" },
          { code: "00142", name: "Phường Bồ Đề" },
          { code: "00145", name: "Phường Sài Đồng" },
          { code: "00148", name: "Phường Long Biên" },
          { code: "00151", name: "Phường Thạch Bàn" },
          { code: "00154", name: "Phường Phúc Đồng" },
          { code: "00157", name: "Phường Cự Khối" }
        ]
      },
      {
        code: "005",
        name: "Quận Cầu Giấy",
        wards: [
          { code: "00160", name: "Phường Nghĩa Đô" },
          { code: "00163", name: "Phường Nghĩa Tân" },
          { code: "00166", name: "Phường Mai Dịch" },
          { code: "00169", name: "Phường Dịch Vọng" },
          { code: "00172", name: "Phường Dịch Vọng Hậu" },
          { code: "00175", name: "Phường Quan Hoa" },
          { code: "00178", name: "Phường Yên Hòa" },
          { code: "00181", name: "Phường Trung Hòa" }
        ]
      },
      {
        code: "006",
        name: "Quận Đống Đa",
        wards: [
          { code: "00184", name: "Phường Cát Linh" },
          { code: "00187", name: "Phường Văn Miếu" },
          { code: "00190", name: "Phường Quốc Tử Giám" },
          { code: "00193", name: "Phường Láng Thượng" },
          { code: "00196", name: "Phường Ô Chợ Dừa" },
          { code: "00199", name: "Phường Văn Chương" },
          { code: "00202", name: "Phường Hàng Bột" },
          { code: "00205", name: "Phường Láng Hạ" },
          { code: "00208", name: "Phường Khâm Thiên" },
          { code: "00211", name: "Phường Thổ Quan" },
          { code: "00214", name: "Phường Nam Đồng" },
          { code: "00217", name: "Phường Trung Phụng" },
          { code: "00220", name: "Phường Quang Trung" },
          { code: "00223", name: "Phường Trung Liệt" },
          { code: "00226", name: "Phường Phương Liên" },
          { code: "00229", name: "Phường Thịnh Quang" },
          { code: "00232", name: "Phường Trung Tự" },
          { code: "00235", name: "Phường Kim Liên" },
          { code: "00238", name: "Phường Láng" },
          { code: "00241", name: "Phường Khương Thượng" }
        ]
      },
      {
        code: "007",
        name: "Quận Hai Bà Trưng",
        wards: [
          { code: "00244", name: "Phường Nguyễn Du" },
          { code: "00247", name: "Phường Bạch Đằng" },
          { code: "00250", name: "Phường Phạm Đình Hổ" },
          { code: "00256", name: "Phường Lê Đại Hành" },
          { code: "00259", name: "Phường Đồng Nhân" },
          { code: "00262", name: "Phường Phố Huế" },
          { code: "00265", name: "Phường Đống Mác" },
          { code: "00268", name: "Phường Thanh Lương" },
          { code: "00271", name: "Phường Thanh Nhàn" },
          { code: "00274", name: "Phường Cầu Dền" },
          { code: "00277", name: "Phường Bách Khoa" },
          { code: "00280", name: "Phường Đồng Tâm" },
          { code: "00283", name: "Phường Vĩnh Tuy" },
          { code: "00286", name: "Phường Bạch Mai" },
          { code: "00289", name: "Phường Quỳnh Mai" },
          { code: "00292", name: "Phường Quỳnh Lôi" },
          { code: "00295", name: "Phường Minh Khai" },
          { code: "00298", name: "Phường Trương Định" }
        ]
      },
      {
        code: "008",
        name: "Quận Hoàng Mai",
        wards: [
          { code: "00301", name: "Phường Thanh Trì" },
          { code: "00304", name: "Phường Vĩnh Hưng" },
          { code: "00307", name: "Phường Định Công" },
          { code: "00310", name: "Phường Mai Động" },
          { code: "00313", name: "Phường Tương Mai" },
          { code: "00316", name: "Phường Đại Kim" },
          { code: "00319", name: "Phường Tân Mai" },
          { code: "00322", name: "Phường Hoàng Văn Thụ" },
          { code: "00325", name: "Phường Giáp Bát" },
          { code: "00328", name: "Phường Lĩnh Nam" },
          { code: "00331", name: "Phường Thịnh Liệt" },
          { code: "00334", name: "Phường Trần Phú" },
          { code: "00337", name: "Phường Hoàng Liệt" },
          { code: "00340", name: "Phường Yên Sở" }
        ]
      },
      {
        code: "009",
        name: "Quận Thanh Xuân",
        wards: [
          { code: "00343", name: "Phường Nhân Chính" },
          { code: "00346", name: "Phường Thượng Đình" },
          { code: "00349", name: "Phường Khương Trung" },
          { code: "00352", name: "Phường Khương Mai" },
          { code: "00355", name: "Phường Thanh Xuân Trung" },
          { code: "00358", name: "Phường Phương Liệt" },
          { code: "00361", name: "Phường Hạ Đình" },
          { code: "00364", name: "Phường Khương Đình" },
          { code: "00367", name: "Phường Thanh Xuân Bắc" },
          { code: "00370", name: "Phường Thanh Xuân Nam" },
          { code: "00373", name: "Phường Kim Giang" }
        ]
      }
    ]
  },
  {
    code: "79",
    name: "TP. Hồ Chí Minh",
    districts: [
      {
        code: "760",
        name: "Quận 1",
        wards: [
          { code: "26734", name: "Phường Tân Định" },
          { code: "26737", name: "Phường Đa Kao" },
          { code: "26740", name: "Phường Bến Nghé" },
          { code: "26743", name: "Phường Bến Thành" },
          { code: "26746", name: "Phường Nguyễn Thái Bình" },
          { code: "26749", name: "Phường Phạm Ngũ Lão" },
          { code: "26752", name: "Phường Cầu Ông Lãnh" },
          { code: "26755", name: "Phường Cô Giang" },
          { code: "26758", name: "Phường Nguyễn Cư Trinh" },
          { code: "26761", name: "Phường Cầu Kho" }
        ]
      },
      {
        code: "761",
        name: "Quận 2",
        wards: [
          { code: "26764", name: "Phường Thủ Thiêm" },
          { code: "26767", name: "Phường An Phú" },
          { code: "26770", name: "Phường An Khánh" },
          { code: "26773", name: "Phường Bình An" },
          { code: "26776", name: "Phường Bình Khánh" },
          { code: "26779", name: "Phường Bình Trưng Đông" },
          { code: "26782", name: "Phường Bình Trưng Tây" },
          { code: "26785", name: "Phường Cát Lái" },
          { code: "26788", name: "Phường Thạnh Mỹ Lợi" },
          { code: "26791", name: "Phường An Lợi Đông" },
          { code: "26794", name: "Phường Thủ Thiêm" }
        ]
      },
      {
        code: "762",
        name: "Quận 3",
        wards: [
          { code: "26797", name: "Phường 1" },
          { code: "26800", name: "Phường 2" },
          { code: "26803", name: "Phường 3" },
          { code: "26806", name: "Phường 4" },
          { code: "26809", name: "Phường 5" },
          { code: "26812", name: "Phường Võ Thị Sáu" },
          { code: "26815", name: "Phường 7" },
          { code: "26818", name: "Phường 8" },
          { code: "26821", name: "Phường 9" },
          { code: "26824", name: "Phường 10" },
          { code: "26827", name: "Phường 11" },
          { code: "26830", name: "Phường 12" },
          { code: "26833", name: "Phường 13" },
          { code: "26836", name: "Phường 14" }
        ]
      },
      {
        code: "763",
        name: "Quận 4",
        wards: [
          { code: "26839", name: "Phường 1" },
          { code: "26842", name: "Phường 2" },
          { code: "26845", name: "Phường 3" },
          { code: "26848", name: "Phường 4" },
          { code: "26851", name: "Phường 5" },
          { code: "26854", name: "Phường 6" },
          { code: "26857", name: "Phường 8" },
          { code: "26860", name: "Phường 9" },
          { code: "26863", name: "Phường 10" },
          { code: "26866", name: "Phường 12" },
          { code: "26869", name: "Phường 13" },
          { code: "26872", name: "Phường 14" },
          { code: "26875", name: "Phường 15" },
          { code: "26878", name: "Phường 16" },
          { code: "26881", name: "Phường 18" }
        ]
      },
      {
        code: "764",
        name: "Quận 5",
        wards: [
          { code: "26884", name: "Phường 1" },
          { code: "26887", name: "Phường 2" },
          { code: "26890", name: "Phường 3" },
          { code: "26893", name: "Phường 4" },
          { code: "26896", name: "Phường 5" },
          { code: "26899", name: "Phường 6" },
          { code: "26902", name: "Phường 7" },
          { code: "26905", name: "Phường 8" },
          { code: "26908", name: "Phường 9" },
          { code: "26911", name: "Phường 10" },
          { code: "26914", name: "Phường 11" },
          { code: "26917", name: "Phường 12" },
          { code: "26920", name: "Phường 13" },
          { code: "26923", name: "Phường 14" },
          { code: "26926", name: "Phường 15" }
        ]
      },
      {
        code: "765",
        name: "Quận 6",
        wards: [
          { code: "26929", name: "Phường 1" },
          { code: "26932", name: "Phường 2" },
          { code: "26935", name: "Phường 3" },
          { code: "26938", name: "Phường 4" },
          { code: "26941", name: "Phường 5" },
          { code: "26944", name: "Phường 6" },
          { code: "26947", name: "Phường 7" },
          { code: "26950", name: "Phường 8" },
          { code: "26953", name: "Phường 9" },
          { code: "26956", name: "Phường 10" },
          { code: "26959", name: "Phường 11" },
          { code: "26962", name: "Phường 12" },
          { code: "26965", name: "Phường 13" },
          { code: "26968", name: "Phường 14" }
        ]
      },
      {
        code: "766",
        name: "Quận 7",
        wards: [
          { code: "26971", name: "Phường Tân Thuận Đông" },
          { code: "26974", name: "Phường Tân Thuận Tây" },
          { code: "26977", name: "Phường Tân Kiểng" },
          { code: "26980", name: "Phường Tân Hưng" },
          { code: "26983", name: "Phường Bình Thuận" },
          { code: "26986", name: "Phường Tân Quy" },
          { code: "26989", name: "Phường Phú Thuận" },
          { code: "26992", name: "Phường Tân Phú" },
          { code: "26995", name: "Phường Tân Phong" },
          { code: "26998", name: "Phường Phú Mỹ" }
        ]
      },
      {
        code: "767",
        name: "Quận 8",
        wards: [
          { code: "27001", name: "Phường 1" },
          { code: "27004", name: "Phường 2" },
          { code: "27007", name: "Phường 3" },
          { code: "27010", name: "Phường 4" },
          { code: "27013", name: "Phường 5" },
          { code: "27016", name: "Phường 6" },
          { code: "27019", name: "Phường 7" },
          { code: "27022", name: "Phường 8" },
          { code: "27025", name: "Phường 9" },
          { code: "27028", name: "Phường 10" },
          { code: "27031", name: "Phường 11" },
          { code: "27034", name: "Phường 12" },
          { code: "27037", name: "Phường 13" },
          { code: "27040", name: "Phường 14" },
          { code: "27043", name: "Phường 15" },
          { code: "27046", name: "Phường 16" }
        ]
      },
      {
        code: "768",
        name: "Quận 9",
        wards: [
          { code: "27049", name: "Phường Long Bình" },
          { code: "27052", name: "Phường Long Thạnh Mỹ" },
          { code: "27055", name: "Phường Hiệp Phú" },
          { code: "27058", name: "Phường Tăng Nhơn Phú A" },
          { code: "27061", name: "Phường Tăng Nhơn Phú B" },
          { code: "27064", name: "Phường Phước Long B" },
          { code: "27067", name: "Phường Phước Long A" },
          { code: "27070", name: "Phường Trường Thạnh" },
          { code: "27073", name: "Phường Long Phước" },
          { code: "27076", name: "Phường Long Trường" },
          { code: "27079", name: "Phường Phước Bình" },
          { code: "27082", name: "Phường Phú Hữu" },
          { code: "27085", name: "Phường Thạnh Mỹ Lợi" },
          { code: "27088", name: "Phường An Phú" },
          { code: "27091", name: "Phường An Khánh" },
          { code: "27094", name: "Phường Bình Trưng Đông" },
          { code: "27097", name: "Phường Bình Trưng Tây" },
          { code: "27100", name: "Phường Cát Lái" },
          { code: "27103", name: "Phường Thạnh Mỹ Lợi" },
          { code: "27106", name: "Phường An Lợi Đông" },
          { code: "27109", name: "Phường Thủ Thiêm" }
        ]
      },
      {
        code: "769",
        name: "Quận 10",
        wards: [
          { code: "27112", name: "Phường 1" },
          { code: "27115", name: "Phường 2" },
          { code: "27118", name: "Phường 3" },
          { code: "27121", name: "Phường 4" },
          { code: "27124", name: "Phường 5" },
          { code: "27127", name: "Phường 6" },
          { code: "27130", name: "Phường 7" },
          { code: "27133", name: "Phường 8" },
          { code: "27136", name: "Phường 9" },
          { code: "27139", name: "Phường 10" },
          { code: "27142", name: "Phường 11" },
          { code: "27145", name: "Phường 12" },
          { code: "27148", name: "Phường 13" },
          { code: "27151", name: "Phường 14" },
          { code: "27154", name: "Phường 15" }
        ]
      },
      {
        code: "770",
        name: "Quận 11",
        wards: [
          { code: "27157", name: "Phường 1" },
          { code: "27160", name: "Phường 2" },
          { code: "27163", name: "Phường 3" },
          { code: "27166", name: "Phường 4" },
          { code: "27169", name: "Phường 5" },
          { code: "27172", name: "Phường 6" },
          { code: "27175", name: "Phường 7" },
          { code: "27178", name: "Phường 8" },
          { code: "27181", name: "Phường 9" },
          { code: "27184", name: "Phường 10" },
          { code: "27187", name: "Phường 11" },
          { code: "27190", name: "Phường 12" },
          { code: "27193", name: "Phường 13" },
          { code: "27196", name: "Phường 14" },
          { code: "27199", name: "Phường 15" },
          { code: "27202", name: "Phường 16" }
        ]
      },
      {
        code: "771",
        name: "Quận 12",
        wards: [
          { code: "27205", name: "Phường Thạnh Xuân" },
          { code: "27208", name: "Phường Thạnh Lộc" },
          { code: "27211", name: "Phường Hiệp Thành" },
          { code: "27214", name: "Phường Thới An" },
          { code: "27217", name: "Phường Tân Chánh Hiệp" },
          { code: "27220", name: "Phường An Phú Đông" },
          { code: "27223", name: "Phường Tân Thới Hiệp" },
          { code: "27226", name: "Phường Trung Mỹ Tây" },
          { code: "27229", name: "Phường Tân Hưng Thuận" },
          { code: "27232", name: "Phường Đông Hưng Thuận" },
          { code: "27235", name: "Phường Tân Thới Nhất" }
        ]
      }
    ]
  },
  {
    code: "31",
    name: "TP. Hải Phòng",
    districts: [
      {
        code: "311",
        name: "Quận Hồng Bàng",
        wards: [
          { code: "11560", name: "Phường Quán Toan" },
          { code: "11563", name: "Phường Hùng Vương" },
          { code: "11566", name: "Phường Sở Dầu" },
          { code: "11569", name: "Phường Thượng Lý" },
          { code: "11572", name: "Phường Hạ Lý" },
          { code: "11575", name: "Phường Minh Khai" },
          { code: "11578", name: "Phường Trại Cau" },
          { code: "11581", name: "Phường Lê Lợi" },
          { code: "11584", name: "Phường Đông Khê" },
          { code: "11587", name: "Phường Cầu Đất" },
          { code: "11590", name: "Phường Lê Chân" },
          { code: "11593", name: "Phường Máy Chai" },
          { code: "11596", name: "Phường Máy Tơ" },
          { code: "11599", name: "Phường Vạn Mỹ" }
        ]
      },
      {
        code: "312",
        name: "Quận Ngô Quyền",
        wards: [
          { code: "11602", name: "Phường Cầu Tre" },
          { code: "11605", name: "Phường Lạc Viên" },
          { code: "11608", name: "Phường Lê Lợi" },
          { code: "11611", name: "Phường Cát Dài" },
          { code: "11614", name: "Phường Lương Khánh Thiện" },
          { code: "11617", name: "Phường Gia Viên" },
          { code: "11620", name: "Phường Đông Khê" },
          { code: "11623", name: "Phường Cầu Đất" },
          { code: "11626", name: "Phường Lê Chân" },
          { code: "11629", name: "Phường Máy Chai" },
          { code: "11632", name: "Phường Máy Tơ" },
          { code: "11635", name: "Phường Vạn Mỹ" }
        ]
      }
    ]
  },
  {
    code: "48",
    name: "TP. Đà Nẵng",
    districts: [
      {
        code: "490",
        name: "Quận Hải Châu",
        wards: [
          { code: "20230", name: "Phường Thạch Thang" },
          { code: "20233", name: "Phường Hải Châu I" },
          { code: "20236", name: "Phường Hải Châu II" },
          { code: "20239", name: "Phường Phước Ninh" },
          { code: "20242", name: "Phường Hòa Thuận Tây" },
          { code: "20245", name: "Phường Hòa Thuận Đông" },
          { code: "20248", name: "Phường Nam Dương" },
          { code: "20251", name: "Phường Bình Hiên" },
          { code: "20254", name: "Phường Bình Thuận" },
          { code: "20257", name: "Phường Hòa Cường Bắc" },
          { code: "20260", name: "Phường Hòa Cường Nam" }
        ]
      },
      {
        code: "491",
        name: "Quận Thanh Khê",
        wards: [
          { code: "20263", name: "Phường Thạc Gián" },
          { code: "20266", name: "Phường An Khê" },
          { code: "20269", name: "Phường Hòa Khê" },
          { code: "20272", name: "Phường Thanh Khê Tây" },
          { code: "20275", name: "Phường Thanh Khê Đông" },
          { code: "20278", name: "Phường Xuân Hà" },
          { code: "20281", name: "Phường Tân Chính" },
          { code: "20284", name: "Phường Chính Gián" },
          { code: "20287", name: "Phường Vĩnh Trung" },
          { code: "20290", name: "Phường Thạc Gián" }
        ]
      }
    ]
  },
  {
    code: "02",
    name: "An Giang",
    districts: [
      { code: "021", name: "TP. Long Xuyên", wards: [{ code: "02101", name: "Phường Mỹ Bình" }] },
      { code: "022", name: "TP. Châu Đốc", wards: [{ code: "02201", name: "Phường Châu Phú A" }] }
    ]
  },
  {
    code: "03",
    name: "Bắc Ninh",
    districts: [
      { code: "031", name: "TP. Bắc Ninh", wards: [{ code: "03101", name: "Phường Vũ Ninh" }] },
      { code: "032", name: "TP. Từ Sơn", wards: [{ code: "03201", name: "Phường Đông Ngàn" }] }
    ]
  },
  {
    code: "04",
    name: "Cà Mau",
    districts: [
      { code: "041", name: "TP. Cà Mau", wards: [{ code: "04101", name: "Phường 1" }] },
      { code: "042", name: "Huyện Đầm Dơi", wards: [{ code: "04201", name: "Thị trấn Đầm Dơi" }] }
    ]
  },
  {
    code: "05",
    name: "Cao Bằng",
    districts: [
      { code: "051", name: "TP. Cao Bằng", wards: [{ code: "05101", name: "Phường Sông Bằng" }] },
      { code: "052", name: "Huyện Bảo Lâm", wards: [{ code: "05201", name: "Thị trấn Pác Miầu" }] }
    ]
  },
  {
    code: "06",
    name: "TP. Cần Thơ",
    districts: [
      { code: "061", name: "Quận Ninh Kiều", wards: [{ code: "06101", name: "Phường Cái Khế" }] },
      { code: "062", name: "Quận Bình Thủy", wards: [{ code: "06201", name: "Phường Bình Thủy" }] }
    ]
  },
  {
    code: "07",
    name: "Đắk Lắk",
    districts: [
      { code: "071", name: "TP. Buôn Ma Thuột", wards: [{ code: "07101", name: "Phường Tân Lập" }] },
      { code: "072", name: "Thị xã Buôn Hồ", wards: [{ code: "07201", name: "Phường An Lạc" }] }
    ]
  },
  {
    code: "08",
    name: "Điện Biên",
    districts: [
      { code: "081", name: "TP. Điện Biên Phủ", wards: [{ code: "08101", name: "Phường Noong Bua" }] },
      { code: "082", name: "Thị xã Mường Lay", wards: [{ code: "08201", name: "Phường Sông Đà" }] }
    ]
  },
  {
    code: "09",
    name: "Đồng Nai",
    districts: [
      { code: "091", name: "TP. Biên Hòa", wards: [{ code: "09101", name: "Phường Trảng Dài" }] },
      { code: "092", name: "TP. Long Khánh", wards: [{ code: "09201", name: "Phường Xuân An" }] }
    ]
  },
  {
    code: "10",
    name: "Đồng Tháp",
    districts: [
      { code: "101", name: "TP. Cao Lãnh", wards: [{ code: "10101", name: "Phường 1" }] },
      { code: "102", name: "TP. Sa Đéc", wards: [{ code: "10201", name: "Phường 1" }] }
    ]
  },
  {
    code: "11",
    name: "Gia Lai",
    districts: [
      { code: "111", name: "TP. Pleiku", wards: [{ code: "11101", name: "Phường Diên Hồng" }] },
      { code: "112", name: "Thị xã An Khê", wards: [{ code: "11201", name: "Phường An Bình" }] }
    ]
  },
  {
    code: "12",
    name: "Hà Tĩnh",
    districts: [
      { code: "121", name: "TP. Hà Tĩnh", wards: [{ code: "12101", name: "Phường Trần Phú" }] },
      { code: "122", name: "Thị xã Hồng Lĩnh", wards: [{ code: "12201", name: "Phường Bắc Hồng" }] }
    ]
  },
  {
    code: "13",
    name: "TP. Huế",
    districts: [
      { code: "131", name: "Quận Phú Xuân", wards: [{ code: "13101", name: "Phường Phú Hội" }] },
      { code: "132", name: "Quận Thuận Hóa", wards: [{ code: "13201", name: "Phường Thuận Thành" }] }
    ]
  },
  {
    code: "14",
    name: "Hưng Yên",
    districts: [
      { code: "141", name: "TP. Hưng Yên", wards: [{ code: "14101", name: "Phường Lam Sơn" }] },
      { code: "142", name: "Thị xã Mỹ Hào", wards: [{ code: "14201", name: "Phường Bần Yên Nhân" }] }
    ]
  },
  {
    code: "15",
    name: "Khánh Hòa",
    districts: [
      { code: "151", name: "TP. Nha Trang", wards: [{ code: "15101", name: "Phường Lộc Thọ" }] },
      { code: "152", name: "TP. Cam Ranh", wards: [{ code: "15201", name: "Phường Cam Nghĩa" }] }
    ]
  },
  {
    code: "16",
    name: "Lai Châu",
    districts: [
      { code: "161", name: "TP. Lai Châu", wards: [{ code: "16101", name: "Phường Quyết Thắng" }] },
      { code: "162", name: "Huyện Tam Đường", wards: [{ code: "16201", name: "Thị trấn Tam Đường" }] }
    ]
  },
  {
    code: "17",
    name: "Lạng Sơn",
    districts: [
      { code: "171", name: "TP. Lạng Sơn", wards: [{ code: "17101", name: "Phường Hoàng Văn Thụ" }] },
      { code: "172", name: "Huyện Tràng Định", wards: [{ code: "17201", name: "Thị trấn Thất Khê" }] }
    ]
  },
  {
    code: "18",
    name: "Lào Cai",
    districts: [
      { code: "181", name: "TP. Lào Cai", wards: [{ code: "18101", name: "Phường Duyên Hải" }] },
      { code: "182", name: "Thị xã Sa Pa", wards: [{ code: "18201", name: "Phường Sa Pa" }] }
    ]
  },
  {
    code: "19",
    name: "Lâm Đồng",
    districts: [
      { code: "191", name: "TP. Đà Lạt", wards: [{ code: "19101", name: "Phường 1" }] },
      { code: "192", name: "TP. Bảo Lộc", wards: [{ code: "19201", name: "Phường 1" }] }
    ]
  },
  {
    code: "20",
    name: "Nghệ An",
    districts: [
      { code: "201", name: "TP. Vinh", wards: [{ code: "20101", name: "Phường Đội Cung" }] },
      { code: "202", name: "Thị xã Cửa Lò", wards: [{ code: "20201", name: "Phường Nghi Thu" }] }
    ]
  },
  {
    code: "21",
    name: "Ninh Bình",
    districts: [
      { code: "211", name: "TP. Ninh Bình", wards: [{ code: "21101", name: "Phường Đông Thành" }] },
      { code: "212", name: "TP. Tam Điệp", wards: [{ code: "21201", name: "Phường Bắc Sơn" }] }
    ]
  },
  {
    code: "22",
    name: "Phú Thọ",
    districts: [
      { code: "221", name: "TP. Việt Trì", wards: [{ code: "22101", name: "Phường Dữu Lâu" }] },
      { code: "222", name: "Thị xã Phú Thọ", wards: [{ code: "22201", name: "Phường Âu Cơ" }] }
    ]
  },
  {
    code: "23",
    name: "Quảng Ngãi",
    districts: [
      { code: "231", name: "TP. Quảng Ngãi", wards: [{ code: "23101", name: "Phường Lê Hồng Phong" }] },
      { code: "232", name: "Thị xã Đức Phổ", wards: [{ code: "23201", name: "Phường Nguyễn Nghiêm" }] }
    ]
  },
  {
    code: "24",
    name: "Quảng Ninh",
    districts: [
      { code: "241", name: "TP. Hạ Long", wards: [{ code: "24101", name: "Phường Hồng Hải" }] },
      { code: "242", name: "TP. Móng Cái", wards: [{ code: "24201", name: "Phường Ka Long" }] }
    ]
  },
  {
    code: "25",
    name: "Quảng Trị",
    districts: [
      { code: "251", name: "TP. Đông Hà", wards: [{ code: "25101", name: "Phường Đông Giang" }] },
      { code: "252", name: "Thị xã Quảng Trị", wards: [{ code: "25201", name: "Phường 1" }] }
    ]
  },
  {
    code: "26",
    name: "Sơn La",
    districts: [
      { code: "261", name: "TP. Sơn La", wards: [{ code: "26101", name: "Phường Chiềng Lề" }] },
      { code: "262", name: "Huyện Quỳnh Nhai", wards: [{ code: "26201", name: "Xã Mường Giàng" }] }
    ]
  },
  {
    code: "27",
    name: "Tây Ninh",
    districts: [
      { code: "271", name: "TP. Tây Ninh", wards: [{ code: "27101", name: "Phường 1" }] },
      { code: "272", name: "Thị xã Hòa Thành", wards: [{ code: "27201", name: "Phường Long Hoa" }] }
    ]
  },
  {
    code: "28",
    name: "Thái Nguyên",
    districts: [
      { code: "281", name: "TP. Thái Nguyên", wards: [{ code: "28101", name: "Phường Quán Triều" }] },
      { code: "282", name: "TP. Sông Công", wards: [{ code: "28201", name: "Phường Lương Sơn" }] }
    ]
  },
  {
    code: "29",
    name: "Thanh Hóa",
    districts: [
      { code: "291", name: "TP. Thanh Hóa", wards: [{ code: "29101", name: "Phường Hàm Rồng" }] },
      { code: "292", name: "TP. Sầm Sơn", wards: [{ code: "29201", name: "Phường Trung Sơn" }] }
    ]
  },
  {
    code: "30",
    name: "Tuyên Quang",
    districts: [
      { code: "301", name: "TP. Tuyên Quang", wards: [{ code: "30101", name: "Phường Phan Thiết" }] },
      { code: "302", name: "Huyện Lâm Bình", wards: [{ code: "30201", name: "Thị trấn Lăng Can" }] }
    ]
  },
  {
    code: "32",
    name: "Vĩnh Long",
    districts: [
      { code: "321", name: "TP. Vĩnh Long", wards: [{ code: "32101", name: "Phường 1" }] },
      { code: "322", name: "Thị xã Bình Minh", wards: [{ code: "32201", name: "Phường Cái Vồn" }] }
    ]
  }
];

// Hàm lấy danh sách tỉnh thành
export const getProvinces = (): Province[] => {
  return vietnamAddresses;
};

// Hàm lấy danh sách quận/huyện theo tỉnh thành
export const getDistrictsByProvince = (provinceCode: string): District[] => {
  const province = vietnamAddresses.find(p => p.code === provinceCode);
  return province ? province.districts : [];
};

// Hàm lấy danh sách phường/xã theo quận/huyện
export const getWardsByDistrict = (provinceCode: string, districtCode: string): Ward[] => {
  const province = vietnamAddresses.find(p => p.code === provinceCode);
  if (!province) return [];
  
  const district = province.districts.find(d => d.code === districtCode);
  return district ? district.wards : [];
};
