export const getLocalDate = (timezone: string, now = new Date()): string => {
  // Intl есть в Node, без библиотек
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // en-CA гарантирует YYYY-MM-DD
  return formatter.format(now);
};
