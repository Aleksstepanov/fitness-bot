export type TRuTimezone = {
  id: string; // IANA
  label: string; // для пользователя
  utcOffset: number; // в часах, для UI/отладки
};

export const RU_TIMEZONES: TRuTimezone[] = [
  { id: 'Europe/Kaliningrad', label: 'Калининград', utcOffset: 2 },
  { id: 'Europe/Moscow', label: 'Москва, СПб', utcOffset: 3 },
  { id: 'Europe/Samara', label: 'Самара', utcOffset: 4 },
  { id: 'Asia/Yekaterinburg', label: 'Екатеринбург', utcOffset: 5 },
  { id: 'Asia/Omsk', label: 'Омск', utcOffset: 6 },
  { id: 'Asia/Krasnoyarsk', label: 'Красноярск', utcOffset: 7 },
  { id: 'Asia/Irkutsk', label: 'Иркутск', utcOffset: 8 },
  { id: 'Asia/Yakutsk', label: 'Якутск', utcOffset: 9 },
  { id: 'Asia/Vladivostok', label: 'Владивосток', utcOffset: 10 },
  { id: 'Asia/Magadan', label: 'Магадан', utcOffset: 11 },
  { id: 'Asia/Kamchatka', label: 'Камчатка', utcOffset: 12 },
];

export const DEFAULT_RU_TIMEZONE = 'Europe/Moscow';
