/* Interface translations for BioExcela Global's launch markets.
 *
 * SCOPE, DELIBERATELY: this covers navigation, the hero, the primary calls to
 * action and the section headings — the path a distributor or buyer follows
 * before they contact you. The long-form product and science copy stays in
 * English on purpose. Health and supplement wording is regulated differently
 * in every market on this list, so that copy needs a professional translator
 * plus a local regulatory review before it is published in each language.
 */

export type LocaleCode =
  | "en" | "zh" | "ms" | "id" | "ar" | "es" | "fr" | "de" | "pt" | "ko";

export type Locale = {
  code: LocaleCode;
  label: string;      // shown in the switcher, in the language itself
  english: string;    // shown alongside, so the list is scannable
  flag: string;
  dir: "ltr" | "rtl";
};

export const locales: Locale[] = [
  { code: "en", label: "English",          english: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "zh", label: "中文",              english: "Chinese",    flag: "🇨🇳", dir: "ltr" },
  { code: "ms", label: "Bahasa Melayu",    english: "Malay",      flag: "🇲🇾", dir: "ltr" },
  { code: "id", label: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩", dir: "ltr" },
  { code: "ar", label: "العربية",           english: "Arabic",     flag: "🇦🇪", dir: "rtl" },
  { code: "es", label: "Español",          english: "Spanish",    flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "Français",         english: "French",     flag: "🇫🇷", dir: "ltr" },
  { code: "de", label: "Deutsch",          english: "German",     flag: "🇩🇪", dir: "ltr" },
  { code: "pt", label: "Português",        english: "Portuguese", flag: "🇵🇹", dir: "ltr" },
  { code: "ko", label: "한국어",            english: "Korean",     flag: "🇰🇷", dir: "ltr" }
];

export type Strings = {
  navHome: string; navWhy: string; navCrisis: string; navInside: string; navFlow: string;
  navTech: string; navBenefits: string; navTeam: string; navProduct: string;
  navAffiliate: string; navFaq: string; navContact: string;
  heroKicker: string; heroTitle2a: string; heroTitle2b: string; heroCopy: string;
  heroCta1: string; heroCta2: string;
  badgeGmp: string; badgePatent: string; badgeNatural: string;
  heroDisclaimer: string; scrollCue: string;
  soundOn: string; soundOff: string;
  langLabel: string; langNote: string;
};

export const strings: Record<LocaleCode, Strings> = {
  en: {
    navHome: "Home", navWhy: "Why Nitric Oxide?", navCrisis: "The Crisis", navInside: "Inside The Body",
    navFlow: "Blood Flow", navTech: "Technology", navBenefits: "Benefits", navTeam: "Research Team",
    navProduct: "Product", navAffiliate: "Affiliate", navFaq: "FAQ", navContact: "Contact us",
    heroKicker: "Third-generation fermentation science",
    heroTitle2a: "Clearing the Way", heroTitle2b: "Optimum Health",
    heroCopy: "When blood flows freely, everything downstream works better. BIO N:OV is a next-generation wellness formula built on patented microbial fermentation, designed to support your body's natural nitric oxide pathways — the signal that helps blood vessels relax.",
    heroCta1: "Discover BIO N:OV", heroCta2: "Why blood flow matters",
    badgeGmp: "GMP-Certified Korea", badgePatent: "Patented Fermentation", badgeNatural: "Naturally Derived",
    heroDisclaimer: "Information on this website is for educational purposes only and is not intended to diagnose, treat, cure or prevent any disease.",
    scrollCue: "Scroll to discover", soundOn: "Sound on", soundOff: "Sound off",
    langLabel: "Language",
    langNote: "Interface translated. Full product and compliance copy is localised per market."
  },
  zh: {
    navHome: "首页", navWhy: "为何需要一氧化氮", navCrisis: "健康危机", navInside: "体内之旅",
    navFlow: "血液循环", navTech: "科技", navBenefits: "功效", navTeam: "研究团队",
    navProduct: "产品", navAffiliate: "代理合作", navFaq: "常见问题", navContact: "联系我们",
    heroKicker: "第三代发酵科技",
    heroTitle2a: "畅通血流", heroTitle2b: "健康之道",
    heroCopy: "血流顺畅，全身机能才能运作良好。BIO N:OV 采用专利微生物发酵技术，是新一代健康配方，旨在支持人体自然的一氧化氮通路 — 帮助血管舒张的关键信号。",
    heroCta1: "了解 BIO N:OV", heroCta2: "血流为何重要",
    badgeGmp: "韩国 GMP 认证", badgePatent: "专利发酵技术", badgeNatural: "天然来源",
    heroDisclaimer: "本网站信息仅供教育参考，无意用于诊断、治疗、治愈或预防任何疾病。",
    scrollCue: "向下浏览", soundOn: "开启声音", soundOff: "关闭声音",
    langLabel: "语言",
    langNote: "界面已翻译。完整产品与合规内容将按各市场本地化。"
  },
  ms: {
    navHome: "Utama", navWhy: "Kenapa Nitrik Oksida?", navCrisis: "Krisis Kesihatan", navInside: "Dalam Badan",
    navFlow: "Aliran Darah", navTech: "Teknologi", navBenefits: "Manfaat", navTeam: "Pasukan Penyelidik",
    navProduct: "Produk", navAffiliate: "Afiliat", navFaq: "Soalan Lazim", navContact: "Hubungi kami",
    heroKicker: "Sains fermentasi generasi ketiga",
    heroTitle2a: "Melancarkan Laluan", heroTitle2b: "Kesihatan Optimum",
    heroCopy: "Apabila darah mengalir lancar, segala-galanya berfungsi lebih baik. BIO N:OV ialah formula kesihatan generasi baharu berasaskan fermentasi mikrob berpaten, direka untuk menyokong laluan nitrik oksida semula jadi badan anda — isyarat yang membantu salur darah mengendur.",
    heroCta1: "Terokai BIO N:OV", heroCta2: "Kenapa aliran darah penting",
    badgeGmp: "Diperakui GMP Korea", badgePatent: "Fermentasi Berpaten", badgeNatural: "Sumber Semula Jadi",
    heroDisclaimer: "Maklumat di laman web ini adalah untuk tujuan pendidikan sahaja dan tidak bertujuan untuk mendiagnos, merawat, menyembuh atau mencegah sebarang penyakit.",
    scrollCue: "Tatal untuk terokai", soundOn: "Bunyi hidup", soundOff: "Bunyi mati",
    langLabel: "Bahasa",
    langNote: "Antara muka diterjemah. Kandungan produk dan pematuhan penuh dilokalkan mengikut pasaran."
  },
  id: {
    navHome: "Beranda", navWhy: "Mengapa Nitrat Oksida?", navCrisis: "Krisis Kesehatan", navInside: "Di Dalam Tubuh",
    navFlow: "Aliran Darah", navTech: "Teknologi", navBenefits: "Manfaat", navTeam: "Tim Peneliti",
    navProduct: "Produk", navAffiliate: "Afiliasi", navFaq: "Tanya Jawab", navContact: "Hubungi kami",
    heroKicker: "Sains fermentasi generasi ketiga",
    heroTitle2a: "Melancarkan Jalan", heroTitle2b: "Kesehatan Optimal",
    heroCopy: "Ketika darah mengalir lancar, semuanya bekerja lebih baik. BIO N:OV adalah formula kesehatan generasi baru berbasis fermentasi mikroba berpaten, dirancang untuk mendukung jalur nitrat oksida alami tubuh Anda — sinyal yang membantu pembuluh darah melemas.",
    heroCta1: "Kenali BIO N:OV", heroCta2: "Mengapa aliran darah penting",
    badgeGmp: "Bersertifikat GMP Korea", badgePatent: "Fermentasi Berpaten", badgeNatural: "Dari Bahan Alami",
    heroDisclaimer: "Informasi di situs ini hanya untuk tujuan edukasi dan tidak dimaksudkan untuk mendiagnosis, mengobati, menyembuhkan atau mencegah penyakit apa pun.",
    scrollCue: "Gulir untuk menelusuri", soundOn: "Suara aktif", soundOff: "Suara mati",
    langLabel: "Bahasa",
    langNote: "Antarmuka diterjemahkan. Konten produk dan kepatuhan lengkap dilokalkan per pasar."
  },
  ar: {
    navHome: "الرئيسية", navWhy: "لماذا أكسيد النيتريك؟", navCrisis: "الأزمة الصحية", navInside: "داخل الجسم",
    navFlow: "تدفق الدم", navTech: "التقنية", navBenefits: "الفوائد", navTeam: "فريق البحث",
    navProduct: "المنتج", navAffiliate: "الشراكة", navFaq: "الأسئلة الشائعة", navContact: "اتصل بنا",
    heroKicker: "علم التخمير من الجيل الثالث",
    heroTitle2a: "نفتح الطريق", heroTitle2b: "الصحة المثلى",
    heroCopy: "عندما يتدفق الدم بحرية، يعمل الجسم كله بشكل أفضل. BIO N:OV تركيبة صحية من الجيل الجديد تعتمد على تخمير ميكروبي حاصل على براءة اختراع، صُممت لدعم مسارات أكسيد النيتريك الطبيعية في جسمك — الإشارة التي تساعد الأوعية الدموية على الارتخاء.",
    heroCta1: "اكتشف BIO N:OV", heroCta2: "لماذا يهم تدفق الدم",
    badgeGmp: "معتمد GMP كوريا", badgePatent: "تخمير حاصل على براءة اختراع", badgeNatural: "من مصادر طبيعية",
    heroDisclaimer: "المعلومات الواردة في هذا الموقع لأغراض تعليمية فقط وليست مخصصة لتشخيص أو علاج أو شفاء أو الوقاية من أي مرض.",
    scrollCue: "مرّر للاكتشاف", soundOn: "الصوت مفعّل", soundOff: "الصوت مغلق",
    langLabel: "اللغة",
    langNote: "تمت ترجمة الواجهة. يتم توطين محتوى المنتج والامتثال الكامل لكل سوق."
  },
  es: {
    navHome: "Inicio", navWhy: "¿Por qué óxido nítrico?", navCrisis: "La crisis", navInside: "Dentro del cuerpo",
    navFlow: "Flujo sanguíneo", navTech: "Tecnología", navBenefits: "Beneficios", navTeam: "Equipo científico",
    navProduct: "Producto", navAffiliate: "Afiliados", navFaq: "Preguntas frecuentes", navContact: "Contáctanos",
    heroKicker: "Ciencia de fermentación de tercera generación",
    heroTitle2a: "Abriendo el camino", heroTitle2b: "Salud óptima",
    heroCopy: "Cuando la sangre fluye libremente, todo lo demás funciona mejor. BIO N:OV es una fórmula de bienestar de nueva generación basada en fermentación microbiana patentada, diseñada para apoyar las vías naturales de óxido nítrico de tu cuerpo, la señal que ayuda a relajar los vasos sanguíneos.",
    heroCta1: "Descubre BIO N:OV", heroCta2: "Por qué importa el flujo sanguíneo",
    badgeGmp: "Certificado GMP Corea", badgePatent: "Fermentación patentada", badgeNatural: "De origen natural",
    heroDisclaimer: "La información de este sitio web tiene únicamente fines educativos y no pretende diagnosticar, tratar, curar ni prevenir ninguna enfermedad.",
    scrollCue: "Desplázate para descubrir", soundOn: "Sonido activado", soundOff: "Sonido desactivado",
    langLabel: "Idioma",
    langNote: "Interfaz traducida. El contenido completo del producto y de cumplimiento se localiza por mercado."
  },
  fr: {
    navHome: "Accueil", navWhy: "Pourquoi l'oxyde nitrique ?", navCrisis: "La crise", navInside: "Dans le corps",
    navFlow: "Flux sanguin", navTech: "Technologie", navBenefits: "Bienfaits", navTeam: "Équipe de recherche",
    navProduct: "Produit", navAffiliate: "Partenaires", navFaq: "FAQ", navContact: "Nous contacter",
    heroKicker: "Science de fermentation de troisième génération",
    heroTitle2a: "Libérer la voie", heroTitle2b: "Santé optimale",
    heroCopy: "Quand le sang circule librement, tout le reste fonctionne mieux. BIO N:OV est une formule bien-être de nouvelle génération fondée sur une fermentation microbienne brevetée, conçue pour soutenir les voies naturelles de l'oxyde nitrique de votre corps — le signal qui aide les vaisseaux sanguins à se relâcher.",
    heroCta1: "Découvrir BIO N:OV", heroCta2: "Pourquoi la circulation compte",
    badgeGmp: "Certifié GMP Corée", badgePatent: "Fermentation brevetée", badgeNatural: "D'origine naturelle",
    heroDisclaimer: "Les informations de ce site sont fournies à titre éducatif uniquement et ne visent pas à diagnostiquer, traiter, guérir ou prévenir une maladie.",
    scrollCue: "Faites défiler", soundOn: "Son activé", soundOff: "Son coupé",
    langLabel: "Langue",
    langNote: "Interface traduite. Le contenu produit et réglementaire complet est localisé par marché."
  },
  de: {
    navHome: "Start", navWhy: "Warum Stickstoffmonoxid?", navCrisis: "Die Krise", navInside: "Im Körper",
    navFlow: "Blutfluss", navTech: "Technologie", navBenefits: "Nutzen", navTeam: "Forschungsteam",
    navProduct: "Produkt", navAffiliate: "Partnerprogramm", navFaq: "Häufige Fragen", navContact: "Kontakt",
    heroKicker: "Fermentationswissenschaft der dritten Generation",
    heroTitle2a: "Den Weg frei machen", heroTitle2b: "Optimale Gesundheit",
    heroCopy: "Wenn das Blut frei fließt, funktioniert alles Nachgelagerte besser. BIO N:OV ist eine Wellness-Formel der neuen Generation auf Basis patentierter mikrobieller Fermentation, entwickelt zur Unterstützung der natürlichen Stickstoffmonoxid-Wege Ihres Körpers — des Signals, das Blutgefäße entspannen lässt.",
    heroCta1: "BIO N:OV entdecken", heroCta2: "Warum Blutfluss zählt",
    badgeGmp: "GMP-zertifiziert Korea", badgePatent: "Patentierte Fermentation", badgeNatural: "Natürlichen Ursprungs",
    heroDisclaimer: "Die Informationen auf dieser Website dienen ausschließlich Bildungszwecken und sind nicht dazu bestimmt, Krankheiten zu diagnostizieren, zu behandeln, zu heilen oder ihnen vorzubeugen.",
    scrollCue: "Scrollen zum Entdecken", soundOn: "Ton an", soundOff: "Ton aus",
    langLabel: "Sprache",
    langNote: "Oberfläche übersetzt. Vollständige Produkt- und Compliance-Inhalte werden je Markt lokalisiert."
  },
  pt: {
    navHome: "Início", navWhy: "Porquê óxido nítrico?", navCrisis: "A crise", navInside: "Dentro do corpo",
    navFlow: "Fluxo sanguíneo", navTech: "Tecnologia", navBenefits: "Benefícios", navTeam: "Equipa de investigação",
    navProduct: "Produto", navAffiliate: "Afiliados", navFaq: "Perguntas frequentes", navContact: "Contacte-nos",
    heroKicker: "Ciência de fermentação de terceira geração",
    heroTitle2a: "A abrir caminho", heroTitle2b: "Saúde ideal",
    heroCopy: "Quando o sangue flui livremente, tudo o resto funciona melhor. BIO N:OV é uma fórmula de bem-estar de nova geração baseada em fermentação microbiana patenteada, concebida para apoiar as vias naturais de óxido nítrico do seu corpo — o sinal que ajuda os vasos sanguíneos a relaxar.",
    heroCta1: "Descobrir BIO N:OV", heroCta2: "Porque importa o fluxo sanguíneo",
    badgeGmp: "Certificado GMP Coreia", badgePatent: "Fermentação patenteada", badgeNatural: "De origem natural",
    heroDisclaimer: "As informações neste site destinam-se apenas a fins educativos e não pretendem diagnosticar, tratar, curar ou prevenir qualquer doença.",
    scrollCue: "Deslize para descobrir", soundOn: "Som ligado", soundOff: "Som desligado",
    langLabel: "Idioma",
    langNote: "Interface traduzida. O conteúdo completo de produto e conformidade é localizado por mercado."
  },
  ko: {
    navHome: "홈", navWhy: "왜 산화질소인가", navCrisis: "건강 위기", navInside: "체내 여정",
    navFlow: "혈류", navTech: "기술", navBenefits: "효능", navTeam: "연구진",
    navProduct: "제품", navAffiliate: "제휴", navFaq: "자주 묻는 질문", navContact: "문의하기",
    heroKicker: "3세대 발효 과학",
    heroTitle2a: "길을 열다", heroTitle2b: "최적의 건강",
    heroCopy: "혈액이 자유롭게 흐를 때 몸의 모든 기능이 더 잘 작동합니다. BIO N:OV는 특허 미생물 발효를 기반으로 한 차세대 웰니스 포뮬러로, 혈관을 이완시키는 신호인 체내 산화질소 경로를 지원하도록 설계되었습니다.",
    heroCta1: "BIO N:OV 알아보기", heroCta2: "혈류가 중요한 이유",
    badgeGmp: "한국 GMP 인증", badgePatent: "특허 발효 공법", badgeNatural: "천연 유래",
    heroDisclaimer: "이 웹사이트의 정보는 교육 목적으로만 제공되며 질병의 진단, 치료, 완치 또는 예방을 목적으로 하지 않습니다.",
    scrollCue: "아래로 스크롤", soundOn: "소리 켜짐", soundOff: "소리 꺼짐",
    langLabel: "언어",
    langNote: "인터페이스가 번역되었습니다. 전체 제품 및 규정 준수 문구는 시장별로 현지화됩니다."
  }
};
