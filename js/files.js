async function startLoading(){
  const imagePaths = {
    New_Zealand:     "Resources/New_Zealand.png",
    Fiji:            "Resources/Fiji.png",
    Sydney:          "Resources/Sydney.png",
    Queensland:      "Resources/Queensland.png",
    Japan:           "Resources/Japan.png",
    China:           "Resources/China.png",
    Indonesia:       "Resources/Indonesia.png",
    Bangladesh:      "Resources/Bangladesh.png",
    Pakistan:        "Resources/Pakistan.png",
    Azerbaijan:      "Resources/Azerbaijan.png",
    Russia:          "Resources/Russia.png",
    Greece:          "Resources/Greece.png",
    Central_Europe:  "Resources/Central_Europe.png",
    United_Kingdom:  "Resources/United_Kingdom.png",
    Azores:          "Resources/Azores.png",
    Greenland:       "Resources/Greenland.png",
    Brazil:          "Resources/Brazil.png",
    Canada:          "Resources/Canada.png",
    East_USA:        "Resources/East_USA.png",
    Central_USA:     "Resources/Central_USA.png",
    Mountain_USA:    "Resources/Mountain_USA.png",
    Pacific_USA:     "Resources/Pacific_USA.png",
    Alaska:          "Resources/Alaska.png",
    Honolulu:        "Resources/Honolulu.png",
    Midway:          "Resources/Midway.png",
    timezoneBg:      "Resources/timezoneBg.png",
  };
  const soundPaths = [
    "Resources/fireworks.mp3"
  ];
  const jsonPath = "Resources/strings.json";
  // const fontURL = "https://fonts.googleapis.com/css2?family=Merienda:wght@300..900&display=swap"
  const fontPath = "Resources/Merienda-Bold.ttf";
  
  const imageKeys = Object.keys(imagePaths);
  totalPromises = imageKeys.length + soundPaths.length + 2; // + 1 for JSON, +1 for font
  
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
  const stringsPromise = loadJSON(jsonPath).then(data => {
    strings = data;
    fulfilledPromises++;
  })
  const fontPromise = loadFont(fontPath).then(f => {
    font = f;
    fulfilledPromises++;
  })
  await Promise.all([...imagePromises, stringsPromise, fontPromise, ...soundPromises]);
  timezoneBg = tzImages.timezoneBg;
  textFont(font);
  const lang = navigator.language.substring(0, 2);
  strings = strings[lang] ? strings[lang] : strings.en;
  background(40);
  state = LONG_COUNTDOWN;
}