function formatString(template, ...values) {
  return template.replace(/{(\d+)}/g, (match, index) => values[index]);
}
function formatTimeLeft(totalSec, timezone) {
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec / 3600) % 24);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0){
    return formatString(strings.days_hours, d, h, timezone);
  } else if (h > 0){
    return formatString(strings.hours_minutes, h, m, timezone);
  } else if (m > 0){
    return formatString(strings.minutes, m, timezone);
  } else if (s >= 0){
    return formatString(strings.seconds, s, timezone);
  } else{
    return strings.HappyNewYear;
  }
}