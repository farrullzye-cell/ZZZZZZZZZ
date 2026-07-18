require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const sequelize = require('../config/database');
const Service = require('../models/Service');
const Portfolio = require('../models/Portfolio');
const Pricing = require('../models/Pricing');
const Testimonial = require('../models/Testimonial');
const Faq = require('../models/Faq');
const Blog = require('../models/Blog');

const services = [
  { name: 'Landing Page', description: 'Halaman promosi produk/jasa dengan desain konversi tinggi dan loading super cepat. Ideal untuk campaign marketing dan product launch.', icon: 'fas fa-file-alt', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Landing+Page', sortOrder: 1 },
  { name: 'Company Profile', description: 'Website profil perusahaan profesional dengan informasi lengkap, portofolio, dan desain elegan yang mencerminkan identitas brand Anda.', icon: 'fas fa-building', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=Company+Profile', sortOrder: 2 },
  { name: 'Website Toko Online', description: 'Toko online siap jualan dengan sistem keranjang belanja, checkout otomatis, manajemen produk, dan integrasi payment gateway.', icon: 'fas fa-shopping-cart', image: 'https://placehold.co/600x400/1a1a28/10b981?text=Toko+Online', sortOrder: 3 },
  { name: 'Dashboard Admin', description: 'Panel kontrol admin modern dengan grafik real-time, manajemen data lengkap, dan sistem autentikasi multi-level.', icon: 'fas fa-tachometer-alt', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Dashboard', sortOrder: 4 },
  { name: 'Website PPOB', description: 'Platform pembayaran dan tagihan online multi-produk dengan sistem manajemen transaksi, laporan keuangan, dan multi-user.', icon: 'fas fa-credit-card', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=PPOB', sortOrder: 5 },
  { name: 'Website Premium', description: 'Website dengan desain eksklusif, animasi premium, performa tinggi, dan fitur lengkap sesuai standar industri terbaik.', icon: 'fas fa-crown', image: 'https://placehold.co/600x400/1a1a28/10b981?text=Premium', sortOrder: 6 },
  { name: 'Website Membership', description: 'Sistem keanggotaan dengan login multi-level, konten eksklusif, manajemen member, dan pembayaran subscription otomatis.', icon: 'fas fa-users', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Membership', sortOrder: 7 },
  { name: 'Website Streaming', description: 'Platform streaming video dengan player kustom, manajemen konten, sistem kategorisasi, dan analitik penonton.', icon: 'fas fa-video', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=Streaming', sortOrder: 8 },
  { name: 'Website Rental', description: 'Sistem rental kendaraan/alat dengan kalender booking, invoice otomatis, manajemen inventaris, dan laporan keuangan.', icon: 'fas fa-car', image: 'https://placehold.co/600x400/1a1a28/10b981?text=Rental', sortOrder: 9 },
  { name: 'Website Booking', description: 'Sistem reservasi online untuk jadwal layanan, meeting room, atau event dengan notifikasi otomatis dan konfirmasi real-time.', icon: 'fas fa-calendar-check', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Booking', sortOrder: 10 },
  { name: 'Sistem Inventori', description: 'Manajemen stok barang dengan tracking masuk-keluar, notifikasi stok minim, barcode scanner, dan laporan inventaris lengkap.', icon: 'fas fa-boxes', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=Inventori', sortOrder: 11 },
  { name: 'Website Sekolah', description: 'Portal pendidikan dengan informasi akademik, jadwal pelajaran, e-learning, pengumuman, dan sistem manajemen siswa.', icon: 'fas fa-school', image: 'https://placehold.co/600x400/1a1a28/10b981?text=Sekolah', sortOrder: 12 },
  { name: 'Website Klinik', description: 'Sistem informasi klinik dengan booking dokter, rekam medis digital, jadwal praktik, dan manajemen pasien terintegrasi.', icon: 'fas fa-hospital-alt', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Klinik', sortOrder: 13 },
  { name: 'Website Custom', description: 'Website dengan fitur kustom sesuai kebutuhan spesifik bisnis Anda. Solusi digital yang dirancang khusus untuk keunikan usaha Anda.', icon: 'fas fa-code', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=Custom', sortOrder: 14 },
  { name: 'Sistem ERP', description: 'Enterprise Resource Planning terintegrasi untuk mengelola seluruh operasional bisnis termasuk keuangan, SDM, dan supply chain.', icon: 'fas fa-network-wired', image: 'https://placehold.co/600x400/1a1a28/10b981?text=ERP', sortOrder: 15 },
  { name: 'Aplikasi Mobile Hybrid', description: 'Aplikasi mobile Android & iOS menggunakan teknologi hybrid yang dapat diintegrasikan dengan website existing.', icon: 'fas fa-mobile-alt', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Mobile+App', sortOrder: 16 },
  { name: 'Sistem POS', description: 'Point of Sale dengan manajemen transaksi, cetak struk, manajemen meja, dan laporan penjualan harian.', icon: 'fas fa-cash-register', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=POS', sortOrder: 17 },
  { name: 'Website Event', description: 'Platform manajemen event dengan sistem registrasi, ticketing online, jadwal acara, dan galeri foto.', icon: 'fas fa-calendar-alt', image: 'https://placehold.co/600x400/1a1a28/10b981?text=Event', sortOrder: 18 },
  { name: 'Sistem Manajemen Project', description: 'Project management tool dengan fitur task management, timeline Gantt chart, kolaborasi tim, dan file sharing.', icon: 'fas fa-tasks', image: 'https://placehold.co/600x400/1a1a28/00d4ff?text=Project+Management', sortOrder: 19 },
  { name: 'Landing Page Premium', description: 'Landing page super-premium dengan animasi GSAP, 3D effects, optimasi konversi maksimal, dan A/B testing ready.', icon: 'fas fa-rocket', image: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=Landing+Premium', sortOrder: 20 },
];

const portfolios = [
  { title: 'StartupTech Landing', description: 'Landing page modern untuk startup teknologi dengan animasi GSAP premium.', category: 'landing', client: 'PT Startup Technology', thumbnail: 'https://placehold.co/600x400/1a1a28/00d4ff?text=StartupTech', linkPreview: '#', linkDetail: '#', sortOrder: 1 },
  { title: 'Admin Panel Pro', description: 'Dashboard admin lengkap dengan grafik real-time dan manajemen data.', category: 'dashboard', client: 'CV Digital Solusi', thumbnail: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=Admin+Pro', linkPreview: '#', linkDetail: '#', sortOrder: 2 },
  { title: 'FashionStore Online', description: 'Toko online fashion dengan payment gateway dan manajemen produk.', category: 'ecommerce', client: 'Toko Fashion Bandung', thumbnail: 'https://placehold.co/600x400/1a1a28/10b981?text=FashionStore', linkPreview: '#', linkDetail: '#', sortOrder: 3 },
  { title: 'BayarGampang PPOB', description: 'Platform pembayaran online multi-produk dengan 50+ merchant.', category: 'ppob', client: 'PT Fintech Nusantara', thumbnail: 'https://placehold.co/600x400/1a1a28/00d4ff?text=BayarGampang', linkPreview: '#', linkDetail: '#', sortOrder: 4 },
  { title: 'PremiumClub Member', description: 'Sistem membership eksklusif dengan subscription otomatis.', category: 'membership', client: 'Komunitas Premium', thumbnail: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=PremiumClub', linkPreview: '#', linkDetail: '#', sortOrder: 5 },
  { title: 'Inventory Manager', description: 'Sistem inventori lengkap dengan barcode scanner dan laporan.', category: 'admin', client: 'PT Logistik Maju', thumbnail: 'https://placehold.co/600x400/1a1a28/10b981?text=Inventory', linkPreview: '#', linkDetail: '#', sortOrder: 6 },
  { title: 'EduSchool Portal', description: 'Portal sekolah dengan e-learning dan manajemen siswa.', category: 'landing', client: 'Yayasan Pendidikan', thumbnail: 'https://placehold.co/600x400/1a1a28/00d4ff?text=EduSchool', linkPreview: '#', linkDetail: '#', sortOrder: 7 },
  { title: 'MediCare Klinik', description: 'Sistem klinik dengan booking dokter dan rekam medis digital.', category: 'dashboard', client: 'Klinik MediCare', thumbnail: 'https://placehold.co/600x400/1a1a28/0ea5e9?text=MediCare', linkPreview: '#', linkDetail: '#', sortOrder: 8 },
];

const testimonials = [
  { name: 'Andi Pratama', role: 'CEO StartupTech', content: 'Pelayanan sangat professional! Website yang dibuat sesuai dengan keinginan saya. Loading cepat dan desainnya modern banget. Highly recommended!', rating: 5, sortOrder: 1 },
  { name: 'Siti Rahmawati', role: 'Owner FashionStore', content: 'Hasilnya melebihi ekspektasi! Dashboard admin yang dibuat sangat rapi dan fungsional. Tim Rullzye Store sangat responsif dan membantu.', rating: 5, sortOrder: 2 },
  { name: 'Bambang Susilo', role: 'Owner PPOB Mart', content: 'Proses pengerjaan cepat dan komunikasi selalu lancar. Website PPOB yang dibuat sangat membantu bisnis saya. Mantab!', rating: 5, sortOrder: 3 },
  { name: 'Dewi Lestari', role: 'Direktur CV Maju Jaya', content: 'Company profile kami terlihat jauh lebih profesional setelah dibuatkan oleh Rullzye Store. Banyak klien baru yang datang dari website.', rating: 5, sortOrder: 4 },
  { name: 'Hendra Gunawan', role: 'Founder EduSchool', content: 'Portal sekolah yang dibuat sangat lengkap. Fitur e-learning dan manajemen siswa sangat membantu operasional sekolah kami.', rating: 5, sortOrder: 5 },
];

const faqs = [
  { question: 'Berapa lama waktu pengerjaan website?', answer: 'Waktu pengerjaan tergantung pada kompleksitas project. Landing Page biasanya 3-7 hari, Company Profile 5-10 hari, dan website kompleks 2-4 minggu. Kami akan memberikan estimasi waktu yang jelas setelah konsultasi.', sortOrder: 1 },
  { question: 'Apakah saya mendapatkan source code website?', answer: 'Ya, Anda mendapatkan full source code website beserta database (jika ada). Semua hak kepemilikan source code sepenuhnya milik Anda.', sortOrder: 2 },
  { question: 'Apakah bisa melakukan revisi?', answer: 'Tentu! Kami memberikan gratis revisi sebanyak 2 kali untuk memastikan hasil sesuai keinginan Anda. Revisi tambahan dapat dilakukan dengan biaya terjangkau.', sortOrder: 3 },
  { question: 'Apakah bisa request fitur tambahan?', answer: 'Bisa. Kami menerima request fitur tambahan di luar paket. Tim kami akan menganalisa dan memberikan penawaran harga sesuai kompleksitas fitur yang diminta.', sortOrder: 4 },
  { question: 'Apakah ada layanan maintenance?', answer: 'Ya, kami menyediakan paket maintenance bulanan yang mencakup update keamanan, backup database, monitoring performa, dan support teknis.', sortOrder: 5 },
  { question: 'Apakah bisa pembayaran DP?', answer: 'Tentu. Sistem pembayaran kami menggunakan DP 50% di awal dan 50% setelah selesai. Untuk project besar dapat diangsur sesuai kesepakatan.', sortOrder: 6 },
  { question: 'Apakah website saya akan SEO friendly?', answer: 'Ya, semua website yang kami buat sudah dioptimasi untuk SEO, termasuk meta tags, struktur heading, kecepatan loading, dan schema markup.', sortOrder: 7 },
  { question: 'Bagaimana jika saya tidak punya domain dan hosting?', answer: 'Kami menyediakan paket lengkap dengan domain dan hosting gratis untuk tahun pertama. Anda tidak perlu repot mengurus teknisnya.', sortOrder: 8 },
];

const pricings = [
  { name: 'Starter', priceMonthly: '499', priceAnnual: '399', currency: 'Rp', period: 'ribu / sekali', isFeatured: false, buttonText: 'Pilih Paket', features: ['Landing Page', 'Responsive Design', 'SEO Basic', 'Free Domain (.my.id)', 'Free SSL'], sortOrder: 1 },
  { name: 'Professional', priceMonthly: '1.500', priceAnnual: '1.200', currency: 'Rp', period: 'ribu / sekali', isFeatured: true, popularLabel: 'Terpopuler', buttonText: 'Pilih Paket', features: ['Dashboard Admin', 'Login System', 'Database MySQL', 'Hosting + Domain', 'SEO Optimasi'], sortOrder: 2 },
  { name: 'Business', priceMonthly: '3.500', priceAnnual: '2.800', currency: 'Rp', period: 'ribu / sekali', isFeatured: false, buttonText: 'Pilih Paket', features: ['Website Custom', 'Payment Gateway', 'API Integration', 'QRIS Payment', 'Member Area', 'Unlimited Page'], sortOrder: 3 },
  { name: 'Enterprise', priceMonthly: 'Custom', priceAnnual: 'Custom', currency: '', period: 'Hubungi Kami', isFeatured: false, popularLabel: '', buttonText: 'Hubungi Kami', features: ['Sistem Besar', 'Custom Fitur', 'Maintenance', 'Support Prioritas'], sortOrder: 4 },
];

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced (force).');

    await Service.bulkCreate(services);
    console.log(`Seeded ${services.length} services.`);

    await Portfolio.bulkCreate(portfolios);
    console.log(`Seeded ${portfolios.length} portfolios.`);

    await Testimonial.bulkCreate(testimonials);
    console.log(`Seeded ${testimonials.length} testimonials.`);

    await Faq.bulkCreate(faqs);
    console.log(`Seeded ${faqs.length} FAQs.`);

    await Pricing.bulkCreate(pricings);
    console.log(`Seeded ${pricings.length} pricings.`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
