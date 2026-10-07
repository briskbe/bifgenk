export type NewsCategory =
  | "etkinlik"
  | "topluluk"
  | "duyuru"
  | "spor"
  | "mescid"
  | "baskan";

export type NewsArticle = {
  slug: string;
  category: NewsCategory;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  dateLabel: string;
  author: string;
  readMinutes: number;
  featured?: boolean;
};

export const CATEGORY_LABELS: Record<NewsCategory, string> = {
  etkinlik: "Etkinlikler",
  topluluk: "Topluluk",
  duyuru: "Duyurular",
  spor: "Spor",
  mescid: "Mescid",
  baskan: "Başkandan",
};

export const articles: NewsArticle[] = [
  {
    slug: "yeni-sezon-aciliyor",
    category: "duyuru",
    title: "Yeni sezon açıldı: 2025–2026 etkinlik takvimimiz yayında",
    excerpt:
      "Bu yıl daha fazla buluşma, daha fazla gönül, daha fazla hatıra. Yeni sezonun ilk etkinlikleri ve kayıt takvimimiz şimdi sizlerle.",
    image: "/hero-bg.jpg",
    date: "2026-04-18",
    dateLabel: "18 Nisan 2026",
    author: "BIF Genk Gençlik",
    readMinutes: 4,
    featured: true,
  },
  {
    slug: "mescid-sohbetleri-ramazan",
    category: "mescid",
    title: "Mescid Sohbetleri: Ramazan ayında özel program başlıyor",
    excerpt:
      "Her hafta farklı bir konu, farklı bir misafir. Gençlerin maneviyat ve kardeşlik yolculuğuna eşlik edecek yeni sohbet serimiz başlıyor.",
    image: "/sohbet.jpg",
    date: "2026-04-12",
    dateLabel: "12 Nisan 2026",
    author: "Mescid Ekibi",
    readMinutes: 3,
  },
  {
    slug: "ev-sohbetleri-donem-kapanisi",
    category: "topluluk",
    title: "Ev Sohbetleri dönem kapanışı: 120 gence dokunduk",
    excerpt:
      "Bu dönem boyunca Genk&apos;in dört bir yanında kapılarını açan ailelere ve gönüllü abilerimize teşekkür ederiz. Bir sonraki dönem yakında.",
    image: "/ev-sohbet.jpg",
    date: "2026-04-08",
    dateLabel: "8 Nisan 2026",
    author: "Topluluk Ekibi",
    readMinutes: 5,
  },
  {
    slug: "halisaha-turnuvasi-2026",
    category: "spor",
    title: "Genk Halısaha Turnuvası 2026: Kayıtlar açıldı",
    excerpt:
      "16 takım, bir kupa, sayısız hatıra. Turnuva takvimi, kurallar ve kayıt formu yeni haber sayfamızda.",
    image: "/aktivite.jpg",
    date: "2026-04-02",
    dateLabel: "2 Nisan 2026",
    author: "Spor Komitesi",
    readMinutes: 3,
  },
  {
    slug: "baskandan-mesaj-yeni-donem",
    category: "baskan",
    title: "Başkan&apos;dan mesaj: &ldquo;Birlikte büyümeye devam&rdquo;",
    excerpt:
      "Yeni dönemin başlangıcında BIF Genk Gençlik Başkanı Enis Şahin gençlere sesleniyor: vizyon, hedefler ve birlikte atacağımız adımlar.",
    image: "/baskan.jpg",
    date: "2026-03-26",
    dateLabel: "26 Mart 2026",
    author: "Enis Şahin",
    readMinutes: 6,
  },
  {
    slug: "gonullu-cagrisi-2026",
    category: "topluluk",
    title: "Gönüllü çağrısı: Ekibimize katılmak ister misin?",
    excerpt:
      "Etkinlik organizasyonu, medya, sosyal sorumluluk ve daha fazlası. Aramıza katıl, birlikte bir şeyler inşa edelim.",
    image: "/iletisim-hero.jpg",
    date: "2026-03-20",
    dateLabel: "20 Mart 2026",
    author: "BIF Genk Gençlik",
    readMinutes: 2,
  },
  {
    slug: "ilkbahar-piknigi-duyuru",
    category: "etkinlik",
    title: "İlkbahar pikniği: 18 Mayıs&apos;ta Molenvijver&apos;de buluşuyoruz",
    excerpt:
      "Güne kahvaltıyla başlıyor, oyunlarla devam ediyor, akşam ezanına kadar sohbetle sürüyoruz. Tüm aileleri bekliyoruz.",
    image: "/hero-bg.jpg",
    date: "2026-03-14",
    dateLabel: "14 Mart 2026",
    author: "Etkinlik Ekibi",
    readMinutes: 3,
  },
  {
    slug: "egitim-atolyeleri-mart",
    category: "etkinlik",
    title: "Mart atölyeleri: Liderlik, iletişim ve maneviyat",
    excerpt:
      "Üç hafta boyunca her cumartesi farklı bir konu. Uzman hocalarımızla birlikte kendimizi ve topluluğumuzu geliştiriyoruz.",
    image: "/sohbet.jpg",
    date: "2026-03-05",
    dateLabel: "5 Mart 2026",
    author: "Eğitim Komitesi",
    readMinutes: 4,
  },
  {
    slug: "kardeslik-kampanyasi-ramazan",
    category: "duyuru",
    title: "Ramazan Kardeşlik Kampanyası: İhtiyaç sahibi ailelere destek",
    excerpt:
      "Bu Ramazan Genk&apos;te 40 aileye erzak paketi ulaştırdık. Destek veren herkese teşekkür eder, dualarımızı gönderiyoruz.",
    image: "/ev-sohbet.jpg",
    date: "2026-02-28",
    dateLabel: "28 Şubat 2026",
    author: "Sosyal Komite",
    readMinutes: 3,
  },
  {
    slug: "genclik-kurultayi-brussels",
    category: "topluluk",
    title: "Belçika Gençlik Kurultayı&apos;nda Genk&apos;i temsil ettik",
    excerpt:
      "Brüksel&apos;de düzenlenen Belçika Türk Gençlik Kurultayı&apos;nda BIF Genk Gençlik olarak güçlü bir delege ile yer aldık.",
    image: "/aktivite.jpg",
    date: "2026-02-22",
    dateLabel: "22 Şubat 2026",
    author: "Başkanlık Ofisi",
    readMinutes: 5,
  },
];
