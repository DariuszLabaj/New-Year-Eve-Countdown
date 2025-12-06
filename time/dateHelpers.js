function getNextFullHourLocal() {
  let now = new Date();
  now.setMinutes(0, 0, 0); // drop minutes, seconds
  now.setHours(now.getHours() + 1); // next full hour
  return now;
}
function isDaylightSavingTime() {
  const now = new Date();
  const jan = new Date(now.getFullYear(), 0, 1);
  const jul = new Date(now.getFullYear(), 6, 1);
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  return now.getTimezoneOffset() < stdOffset;
}