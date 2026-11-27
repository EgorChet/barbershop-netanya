// ============================================================================
//  ЕДИНЫЙ КОНФИГ САЙТА — меняется только этот файл.
//  Single site config: all versions read booking + contacts from here.
// ============================================================================
window.SITE_CONFIG = {
  booking: {
    // "demo"    — встроенная демо-запись (ничего не отправляет)
    // "altegio" — виджет Altegio (w<widgetId>.alteg.io/widgetJS)
    // "yclients"— виджет YCLIENTS (w<widgetId>.yclients.com/widgetJS)
    // "link"    — любая ссылка (WhatsApp, Fresha, Calendly…), открывается в новой вкладке
    provider: "demo",

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

  // Сертификаты (раздел «История»). Пока пусто — показываются макеты.
  // Когда будут сканы: положите файлы в assets/certs/ и раскомментируйте:
  // certificates: [
  //   { title: "Сертификат барбера", who: "Дима",      src: "assets/certs/dima-1.jpg" },
  //   { title: "Диплом курса",       who: "Барбер №3", src: "assets/certs/b3-1.jpg" }
  // ],

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
