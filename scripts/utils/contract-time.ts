export function getTimestamp(time: string) {
  const target = Math.floor(Date.parse(`${time} GMT`) / 1000);
  const offset = 8 * 60 * 60;
  return target - offset;
}

export function getDaysTimestamp(days: number) {
  return days * 24 * 60 * 60;
}
