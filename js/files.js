async function startLoading() {
    const imagePaths = {
        New_Zealand: "Resources/New_Zealand.png",
        Fiji: "Resources/Fiji.png",
        Sydney: "Resources/Sydney.png",
        Queensland: "Resources/Queensland.png",
        Japan: "Resources/Japan.png",
        China: "Resources/China.png",
        Indonesia: "Resources/Indonesia.png",
        Bangladesh: "Resources/Bangladesh.png",
        Pakistan: "Resources/Pakistan.png",
        Azerbaijan: "Resources/Azerbaijan.png",
        Russia: "Resources/Russia.png",
        Greece: "Resources/Greece.png",
        Central_Europe: "Resources/Central_Europe.png",
        United_Kingdom: "Resources/United_Kingdom.png",
        Azores: "Resources/Azores.png",
        Greenland: "Resources/Greenland.png",
        Brazil: "Resources/Brazil.png",
        Canada: "Resources/Canada.png",
        East_USA: "Resources/East_USA.png",
        Central_USA: "Resources/Central_USA.png",
        Mountain_USA: "Resources/Mountain_USA.png",
        Pacific_USA: "Resources/Pacific_USA.png",
        Alaska: "Resources/Alaska.png",
        Honolulu: "Resources/Honolulu.png",
        Midway: "Resources/Midway.png",
        timezoneBg: "Resources/timezoneBg.png",
    };
    const soundPaths = [
        "Resources/fireworks.mp3"
    ];
    const jsonPath = "Resources/strings.json";
    const fontPath = "Resources/Merienda-Bold.ttf";

    const imageKeys = Object.keys(imagePaths);
    const coverKeys = activities.map(a => a.id.toString());

    totalPromises = imageKeys.length + soundPaths.length + coverKeys.length + 2; // + 1 for JSON, +1 for font

    const imagePromises = imageKeys.map(key =>
        loadImage(imagePaths[key]).then(img => {
            tzImages[key] = img;
            fulfilledPromises++
        })
    );
    const soundPromises = soundPaths.map(path =>
        loadSound(path).then(snd => {
            fireworkSounds.push(snd);
            fulfilledPromises++;
        })
    );
    const coverPromises = coverKeys.map(id => {
        const activity = activities.find(a => a.id.toString() === id);
        const url = activity ? activity.imageUrl : null;

        return loadActivityImagePromise(id, url).then(() => {
            fulfilledPromises++;
        });
    });
    const stringsPromise = loadJSON(jsonPath).then(data => {
        strings = data;
        fulfilledPromises++;
    })
    const fontPromise = loadFont(fontPath).then(f => {
        font = f;
        fulfilledPromises++;
    })
    await Promise.all([...imagePromises, ...coverPromises, stringsPromise, fontPromise, ...soundPromises]);
    timezoneBg = tzImages.timezoneBg;
    textFont(font);
    const lang = navigator.language.substring(0, 2);
    strings = strings[lang] ? strings[lang] : strings.en;
    background(40);
    state = LONG_COUNTDOWN;
}

function loadActivityImagePromise(id, url) {
    return new Promise(resolve => {

        if (!url) {
            console.warn("No image URL for activity:", id);
            return resolve(null);
        }

        // Already loaded?
        if (activityImages[id]) {
            return resolve(activityImages[id]);
        }

        // Temporary DOM element
        const domImg = createImg(url, id.toString());
        domImg.hide();

        domImg.elt.onload = () => {

            // Create a clean p5.Image
            let p5img = createImage(domImg.elt.naturalWidth, domImg.elt.naturalHeight);
            p5img.drawingContext.drawImage(domImg.elt, 0, 0);

            // Save the p5.Image, NOT the DOM element
            activityImages[id] = p5img;

            // Remove DOM element completely
            domImg.remove();

            resolve(p5img);
        };

        domImg.elt.onerror = () => {
            console.warn("Image failed:", url);

            domImg.remove(); // Clean up failed DOM image too
            resolve(null);
        };
    });
}