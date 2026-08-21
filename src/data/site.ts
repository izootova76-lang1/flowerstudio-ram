export const site = {
  name: "Flower Studio",
  tagline: "Студия цветов в Раменском",
  city: "Раменское",
  address: "г. Раменское, ул. Молодёжная, 20, ТЦ «Молодёжный»",
  route: "Главный вход → прямо по галерее → студия слева, у витрины с цветами",
  phone: "+7 (925) 097-63-37",
  phoneHref: "tel:+79250976337",
  instagramLabel: "flower_studio_ram",
  since: 2021,
  legalEntity: "ИП Семенихина С. В.",
  inn: "501302138699",
  ogrnip: "321508100133862",
  // 0 = воскресенье
  hours: [
    { day: 0, label: "Воскресенье", open: "10:00", close: "21:00" },
    { day: 1, label: "Понедельник", open: "10:00", close: "21:00" },
    { day: 2, label: "Вторник", open: "10:00", close: "21:00" },
    { day: 3, label: "Среда", open: "10:00", close: "21:00" },
    { day: 4, label: "Четверг", open: "10:00", close: "21:00" },
    { day: 5, label: "Пятница", open: "10:00", close: "21:00" },
    { day: 6, label: "Суббота", open: "10:00", close: "21:00" },
  ],
  deliveryZones: [
    { zone: "Раменское, центр", price: 300, time: "в течение 2–3 часов" },
    { zone: "Раменское, окраины и микрорайоны", price: 450, time: "в течение 3–4 часов" },
    { zone: "Ильинский, Быково, Удельная", price: 700, time: "по согласованию" },
    { zone: "Жуковский, Бронницы", price: 900, time: "по согласованию" },
  ],
};

export type StudioStatus = { open: boolean; text: string };

export function getStudioStatus(now: Date): StudioStatus {
  const day = now.getDay();
  const today = site.hours.find((h) => h.day === day)!;
  const [oh, om] = today.open.split(":").map(Number);
  const [ch, cm] = today.close.split(":").map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const openM = oh! * 60 + om!;
  const closeM = ch! * 60 + cm!;
  if (minutes >= openM && minutes < closeM) {
    return { open: true, text: `Студия открыта до ${today.close}` };
  }
  if (minutes < openM) {
    return { open: false, text: `Откроемся сегодня в ${today.open}` };
  }
  const tomorrow = site.hours.find((h) => h.day === (day + 1) % 7)!;
  return { open: false, text: `Откроемся завтра в ${tomorrow.open}` };
}

export function formatPrice(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}