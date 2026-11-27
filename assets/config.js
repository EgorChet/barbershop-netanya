// ============================================================================
//  ЕДИНЫЙ КОНФИГ САЙТА — меняется только этот файл.
//  Single site config: all versions read booking + contacts from here.
// ============================================================================
window.SITE_CONFIG = {
  booking: {
    // "own"     — своя запись (assets/store.js): свободные окна, записи мастеров, кабинет /staff/
    // "demo"    — встроенная демо-запись (ничего не отправляет)
    // "altegio" — виджет Altegio (w<widgetId>.alteg.io/widgetJS)
    // "yclients"— виджет YCLIENTS (w<widgetId>.yclients.com/widgetJS)
    // "link"    — любая ссылка (WhatsApp, Fresha, Calendly…), открывается в новой вкладке
    provider: "own",

    // Altegio / YCLIENTS: номер формы онлайн-записи.
    // Пример: ссылка формы https://b123456.alteg.io → widgetId: "123456"
    widgetId: "",
    // ID компании (филиала). Пример: .../company/312313/... → companyId: "312313"
    companyId: "",
    // ID мастеров в Altegio (карточка сотрудника → ID). Пусто = общий выбор мастера.
    staff: { dima: "", kirill: "", b3: "" },
    // Цвет плавающей кнопки виджета (если включена)
    buttonColor: "#111111",
    showFloatingButton: false,

    // Для provider: "link"
    link: ""
  },

  // Своя запись (provider: "own"). Пока ключи пустые — демо-режим в браузере.
  // Реальный режим: впишите Project URL и публичный anon-ключ из Supabase (инструкция: supabase/README.md).
  own: { supabaseUrl: "https://vmhlnzxhlittbkgrnhac.supabase.co", anonKey: "sb_publishable_30xDfI7SPsebKhrhDWuFUg_Hg3WDuDZ" },

  // Сертификаты (раздел «История»). Пока пусто — показываются макеты.
  // Когда будут сканы: положите файлы в assets/certs/ и раскомментируйте:
  // certificates: [
  //   { title: "Сертификат барбера", who: "Дима",      src: "assets/certs/dima-1.jpg" },
  //   { title: "Диплом курса",       who: "Таша", src: "assets/certs/b3-1.jpg" }
  // ],

  // «До и после» (слайдер в разделе «Результат»). Положите пары фото в assets/ba/ и раскомментируйте.
  // Пока пусто — показываются заглушки «скоро».
  // beforeAfter: [
  //   { before: "assets/ba/dima-1-before.jpg", after: "assets/ba/dima-1-after.jpg", who: "Дима" }
  // ],

  // Косметика, с которой работают мастера (блок «Чем мы пользуемся»). Фото лежат в assets/products/.
  // Можно убирать и добавлять: { brand, name, note, img }
  products: [
    { brand: "Reuzel", name: "Blue", note: "сильная фиксация, блеск, смывается водой", img: "assets/products/reuzel-blue.png" },
    { brand: "Reuzel", name: "Clay Matte", note: "средняя фиксация, матовый финиш", img: "assets/products/reuzel-clay.jpg" },
    { brand: "Reuzel", name: "Fiber", note: "гибкая фиксация, текстура", img: "assets/products/reuzel-fiber.png" },
    { brand: "Uppercut Deluxe", name: "Deluxe Pomade", note: "сильная фиксация, блеск", img: "assets/products/uppercut-deluxe.jpg" },
    { brand: "Uppercut Deluxe", name: "Matte Pomade", note: "средняя фиксация, матовый финиш", img: "assets/products/uppercut-matte.jpg" },
    { brand: "Uppercut Deluxe", name: "Clay", note: "сильная фиксация, матовый финиш", img: "assets/products/uppercut-clay.jpg" },
    { brand: "Uppercut Deluxe", name: "Clay Spray", note: "спрей: объём и мат без липкости", img: "assets/products/uppercut-clay-spray.jpg" },
    { brand: "Uppercut Deluxe", name: "Salt Spray", note: "солевой спрей: лёгкая пляжная текстура", img: "assets/products/uppercut-salt-spray.jpg" },
    { brand: "Uppercut Deluxe", name: "Beard Oil", note: "масло для бороды: уход и мягкость", img: "assets/products/uppercut-beard-oil.jpg" },
    { brand: "Clubman Pinaud", name: "Finest Powder", note: "тальк после стрижки и бритья, с 1810 года", img: "assets/products/clubman-powder.jpg" }
  ],

  contacts: {
    name: "GRIND Barbershop",
    city: "Нетания",
    address: "",            // напр. "ул. Герцль, 1, Нетания"
    phone: "",              // напр. "+972 50-000-0000"
    whatsapp: "",           // только цифры, напр. "972500000000"
    instagram: "combpunk",
    hours: [["Вс–Чт", "10:00–20:00"], ["Пт", "09:00–15:00"], ["Сб", "выходной"]],
    mapQuery: "Netanya, Israel"
  }
};
