let activities = [];
let availableActivities = [];
let activityImages = {}; // keyed by activity id
let currentActivity = null;
let nextActivity = null;

function pickNextActivity() {
    let now = new Date();
    let currentHour = now.getHours() * 60 + now.getMinutes();

    if (availableActivities.length === 0) {
        nextActivity = { id: 0, displayName: strings.No_available_activities, imageUrl: "", timeRange: { start: "00:00", end: "23:59" }, canRepeat: true };
    }

    let valid = availableActivities.filter(a => {
        let start = parseTime(a.timeRange.start);
        let end = parseTime(a.timeRange.end);
        return currentHour >= start && currentHour <= end;
    });

    if (valid.length === 0) {
        nextActivity = null;
        // nextActivity = { id: 0, displayName: strings.No_available_activities, imageUrl: "", timeRange: { start:"00:00", end:"23:59" }, canRepeat:true };
    } else {
        nextActivity = random(valid);
    }

    saveActivities();
}

function applyNextActivity() {
    if (!nextActivity) return;

    currentActivity = nextActivity;

    if (!currentActivity.canRepeat) {
        availableActivities = availableActivities.filter(a => a.id !== currentActivity.id);
    }

    pickNextActivity();
    saveActivities();
}

function parseTime(t) {
    let [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

function saveActivities() {
    localStorage.setItem(
        "activityState",
        JSON.stringify({
            activities,
            availableActivities,
            currentActivity,
            nextActivity,
            activityImages
        })
    );
}

function loadSavedActivities() {
    let saved = localStorage.getItem("activityState");
    if (saved) {
        let state = JSON.parse(saved);

        activities = state.activities;
        availableActivities = state.availableActivities;
        currentActivity = state.currentActivity;
        nextActivity = state.nextActivity;
        activityImages = state.activityImages || {};

        console.log("Loaded activities from localStorage");
    }
}

async function loadActivitiesFromJSON() {
    fileInput.elt.click();
}
function handleFile(file) {
    if (file.type === 'application' && file.subtype === 'json' && Array.isArray(file.data)) {
        // clear previous state
        localStorage.removeItem("activityState");

        activities = file.data;
        availableActivities = [...activities];
        currentActivity = null;
        nextActivity = null;

        pickNextActivity();
        saveActivities();

        console.log("Loaded activities from JSON:", activities.length);
    } else {
        console.error("Please select a valid JSON file");
    }
}