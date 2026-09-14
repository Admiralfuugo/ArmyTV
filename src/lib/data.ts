export type Media = {
  id: string;
  title: string;
  subtitle: string;
  type: "film" | "serial" | "documentary" | "kids";
  genre: string;
  year: number;
  duration: string;
  rating: string;
  age: string;
  image: string;
  description: string;
  language: string;
  translated?: boolean;
};

export const media: Media[] = [
  { id: "vatan", title: "Vatan", subtitle: "Vatan yurakdan boshlanadi.", type: "film", genre: "Harbiy drama", year: 2024, duration: "1 soat 48 daqiqa", rating: "8.7", age: "12+", image: "/images/vatan.jpg", description: "Yurtga sadoqat, insoniylik va jasorat haqida hikoya. O‘z hayotini Vatan tinchligiga bag‘ishlagan insonlarning taqdiri orqali eng katta kuch birlik va mehrda ekanini anglaymiz.", language: "O‘zbekcha" },
  { id: "vatan-ostonasi", title: "Vatan ostonasi", subtitle: "Har bir qadam — mas’uliyat.", type: "film", genre: "Drama", year: 2023, duration: "1 soat 36 daqiqa", rating: "8.5", age: "12+", image: "/images/vatan-ostonasi.jpg", description: "Yosh harbiylarning hayot yo‘li, sinovlari va do‘stligi haqida vatanparvarlik ruhidagi hikoya. Vatan ostonasi har birimizning qalbimizdan boshlanadi.", language: "O‘zbekcha" },
  { id: "hayot", title: "Hayot", subtitle: "Yashashning o‘zi bir mo‘jiza.", type: "film", genre: "Oilaviy drama", year: 2024, duration: "1 soat 42 daqiqa", rating: "8.2", age: "6+", image: "/images/hayot.jpg", description: "Oila, orzular va kundalik hayotdagi kichik g‘alabalar haqidagi iliq hikoya. Turli taqdirlarni birlashtirgan umid insonni oldinga chorlaydi.", language: "O‘zbekcha" },
  { id: "qalqon", title: "Qalqon", subtitle: "Tinchligimizning ishonchli qalqoni.", type: "serial", genre: "Harbiy", year: 2025, duration: "8 qism · 42 daqiqa", rating: "8.8", age: "16+", image: "/images/qalqon.jpg", description: "Yurt osoyishtaligi yo‘lida xizmat qilayotgan fidoyi insonlar haqida serial. Jamoaviylik, ishonch va mas’uliyat har bir voqeaning markazida.", language: "O‘zbekcha" },
  { id: "shon-sharaf", title: "Shon-sharaf", subtitle: "Jasorat unutilmaydi.", type: "documentary", genre: "Hujjatli", year: 2024, duration: "54 daqiqa", rating: "8.6", age: "12+", image: "/images/shon-sharaf.jpg", description: "Mardlik va sadoqat timsoliga aylangan insonlar haqida hujjatli hikoyalar to‘plami. Tarix, xotira va bugungi avlod o‘rtasidagi bog‘liqlik.", language: "O‘zbekcha" },
  { id: "chegarachi", title: "Chegarachi", subtitle: "Vatan chegaradan boshlanadi.", type: "serial", genre: "Harbiy drama", year: 2025, duration: "12 qism · 45 daqiqa", rating: "9.1", age: "12+", image: "/images/chegarachi.jpg", description: "Sarhadlarimiz posbonlarining kundalik hayoti va qat’iyati haqida serial. Tog‘lar bag‘rida kechadigan voqealar do‘stlik va burchning qadrini ochib beradi.", language: "O‘zbekcha" },
  { id: "jasorat", title: "Jasorat yo‘li", subtitle: "Bir maqsad. Bir jamoa.", type: "film", genre: "Sarguzasht", year: 2023, duration: "1 soat 52 daqiqa", rating: "8.4", age: "16+", image: "/images/shon-sharaf.jpg", description: "Qiyin vaziyatda ham bir-biriga ishonchni yo‘qotmagan jamoa haqidagi tarjima film namunasi. Til tanlash interfeysi bilan tanishing.", language: "O‘zbekcha · Русский · English", translated: true },
  { id: "so-nggi-marra", title: "So‘nggi marra", subtitle: "Taslim bo‘lmaslik san’ati.", type: "film", genre: "Harbiy drama", year: 2024, duration: "1 soat 58 daqiqa", rating: "8.3", age: "16+", image: "/images/qalqon.jpg", description: "Matonat va hamjihatlik haqidagi tarjima kontent namunasi. O‘zbek, rus yoki original tilda tomosha qilish imkoniyati uchun tayyor interfeys.", language: "O‘zbekcha · Русский · English", translated: true },
  { id: "vatanposh", title: "Kirpikcha va uning do‘stlari", subtitle: "Kichik qahramon, katta orzular.", type: "kids", genre: "Multfilm", year: 2024, duration: "22 daqiqa", rating: "9.0", age: "0+", image: "/images/kids-1.jpg", description: "Do‘stlik, mehr va yurtga muhabbatni o‘rgatuvchi bolalar uchun quvnoq sarguzasht. Kichik qahramonlar bilan birga yangi narsalarni kashf eting.", language: "O‘zbekcha" },
  { id: "zumrad-qimmat", title: "Nu, pogodi!", subtitle: "Yaxshilik doimo g‘olib.", type: "kids", genre: "Ertak", year: 2023, duration: "28 daqiqa", rating: "8.9", age: "6+", image: "/images/kids-2.jpg", description: "Sevimli multfilm qahramonlari bilan yangi yil sarguzashtlari. Bolalar bo‘limidagi tarjima kontent namunasi.", language: "O‘zbekcha" },
  { id: "kichik-qahramon", title: "Kapitan sarguzashtlari", subtitle: "Har kuni bir yaxshi ish.", type: "kids", genre: "Sarguzasht", year: 2025, duration: "18 daqiqa", rating: "8.8", age: "6+", image: "/images/kids-3.jpg", description: "Do‘stlariga yordam berishni yaxshi ko‘radigan qahramonning sarguzashtlari. Kuzatuvchanlik va hamkorlik haqidagi ibratli hikoya.", language: "O‘zbekcha" },
];

export const getMedia = (id: string) => media.find((item) => item.id === id);
export const normalizeSearch = (value: string) => value
  .normalize("NFKD")
  .toLocaleLowerCase("uz")
  .replace(/[‘’`ʻʼ']/g, "")
  .replace(/\s+/g, " ")
  .trim();
export const typeLabels: Record<Media["type"], string> = { film: "Film", serial: "Serial", documentary: "Hujjatli", kids: "Bolalar uchun" };
export const navItems = [
  { href: "/", label: "Bosh sahifa", icon: "home" },
  { href: "/filmlar", label: "Filmlar va seriallar", icon: "film" },
  { href: "/jonli-efir", label: "Jonli TV", icon: "tv" },
  { href: "/bolalar", label: "Bolalar", icon: "kids" },
  { href: "/kutubxona", label: "Kutubxona", icon: "book" },
  { href: "/talim", label: "Ta’lim", icon: "education" },
  { href: "/testlar", label: "Test va viktorinalar", icon: "quiz" },
];
