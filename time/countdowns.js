function getNextNewYearsEve() {
  const offsets = Object.values(tzOffsets);
  const lastZoneOffset = Math.min(...offsets); // last place to hit midnight

  const nowUtcMs = Date.now();
  
  const nowInLastZone = new Date(nowUtcMs + lastZoneOffset * 3600 * 1000);
  const currentYearInLastZone = nowInLastZone.getFullYear();
  const nextYear = currentYearInLastZone + 1;
  return new Date(nextYear, 0, 1, 0, 0, 0);
}

function getCountdowns(setPoint) {
  const now = new Date();
  let myOffset = -now.getTimezoneOffset() / 60;

  if (isDaylightSavingTime()) {
    myOffset -= 1; // subtract 1 hour if DST is active
  }
  
  const setpointUtc = setPoint.getTime() + myOffset * 3600 * 1000;

  let results = {};
  for (let [label, offset] of Object.entries(tzOffsets)) {
    const zoneSetpoint = new Date(setpointUtc - offset * 3600 * 1000);
    results[label] = Math.floor((zoneSetpoint - now) / 1000);
  }
  return results;
}

function getNearestCountdown(countdowns) {
  let nearestLabel = null;
  let nearestSec = Infinity;
  for (let [label, totalSec] of Object.entries(countdowns)) {
    if (totalSec >= 0 && totalSec < nearestSec) {
      nearestLabel = label;
      nearestSec = totalSec;
    }
    if (nearestLabel != null && nearestSec < totalSec) {
      break;
    }
  }
  if (nearestLabel == null) {
    return { zoneName: "All events finished!", countdown: null };
  }
  return { zoneName: nearestLabel, countdown: nearestSec };
}