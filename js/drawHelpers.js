function drawLoadingBar(){
  fill(255);
  textAlign(CENTER, CENTER);
  SetFontSize(24);
  text("Loading...", width/2, height/2 - 50);
  
  const progress = fulfilledPromises / totalPromises;
  const barWidth = width * 0.6;
  const barHeight = 30;
  
  noStroke();
  fill(226, 224, 249);
  rect((width - barWidth) / 2, height/2, barWidth, barHeight, barHeight/2 - 1);
  fill(103, 80, 164);
  rect((width - barWidth) / 2, height/2, barWidth*progress, barHeight, barHeight/2-1);
  
  stroke(212, 211, 232);
  strokeWeight(1);
  noFill();
  rect((width - barWidth) / 2, height/2, barWidth, barHeight, barHeight/2-1);
}

function drawLongCountdown(nearest){
  image(timezoneBg, 0, 0, width, height);
  fill(255);
  stroke(0);
  strokeWeight(6);
  SetFontSize(16);
  textAlign(RIGHT, BOTTOM);
  textWeight(800);
  //txt, x, y, boxWidth, lineHeight = 28, align = CENTER
  wrapTextInBox(
    `${formatTimeLeft(nearest.countdown, strings[nearest.zoneName])}`,
    width - 40,
    height - 40,
    width / 2 - 80)
  SetFontSize(6);
  textAlign(LEFT, TOP);
  text(mySetpoint.getFullYear(), 40, 40);
}

function drawShortCountdown(nearest){
  let zoneImg = tzImages[nearest.zoneName] || timezoneBg;
  image(zoneImg, 0, 0, width, height);
  fill(255);
  stroke(0);
  strokeWeight(6);
  SetFontSize(16);
  textWeight(800);
  textAlign(CENTER, BOTTOM);
  wrapTextInBox(
    `${strings[nearest.zoneName]}`,
    width/2,
    height/2,
    width / 2 - 80);
  if (lastSecond != nearest.countdown){
    SetFontSize(6);
    vehicles = [];
    lastSecond = nearest.countdown;
    textAlign(CENTER, TOP);
    getPoints(lastSecond, width/2, height/2);
  }
  SetFontSize(6);
  textAlign(LEFT, TOP);
  text(mySetpoint.getFullYear(), 40, 40);
  for (let i = 0; i < vehicles.length; i++){
    let v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }
}

function startFireworksScene(){
  stars = Array.from({length: diagonal / 5}, () => new Star());
  fireworks = [];
  background(0);
  if (fireworkSounds.length > 0) {
    let snd = random(fireworkSounds);
    snd.play();
  }
}

function drawFireworksScene(){
  background(0, 25);
  fill(255);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER, TOP);
  SetFontSize(8);
  wrapTextInBox(strings.HappyNewYear, width/2, 40, width*0.7);
  // Draw stars
  for (let s of stars) {
    s.update();
    s.show();
  }
  // // Spawn new fireworks randomly
  if (random() < 0.05) {
    fireworks.push(new Firework());
  }
  // // Update and draw fireworks
  for (let i = fireworks.length - 1; i >= 0; i--){
    fireworks[i].update();
    fireworks[i].show();
    
    if (fireworks[i].done()){
      fireworks.splice(i, 1);
    }
  }
}

function getPoints(text, x, y){
  textFont(font);
  const points = font.textToContours(text, x, y, { sampleFactor: 0.25});
  
  for (let i = 0; i < points.length; i++){
    let letterPoints = points[i];
    for (let j = 0; j < letterPoints.length; j++){
      const vehicle = new Vehicle(letterPoints[j].x, letterPoints[j].y);
      vehicles.push(vehicle);
    }
  }
}

function wrapTextInBox(txt, x, y, boxWidth){
  let align = textAlign(undefined);
  let horizontal = align.horizontal;
  let vertical = align.vertical;
  let h_align = LEFT;
  let v_align = BASELINE;
  switch (horizontal){
    case "left":
      h_align = LEFT;
      break;
    case "center":
      h_align = CENTER;
      break;
    case "right":
      h_align = RIGHT;
      break
  }
  switch (vertical){
    case "alphabetic":
      v_align = BASELINE;
      break;
    case "top":
      v_align = TOP;
      break;
    case "middle":
      v_align = CENTER;
      break;
    case "bottom":
      v_align = BOTTOM;
      break;
  }
  textAlign(h_align, TOP);
  const words = txt.split(" ");
  const lineHeight = textSize() + textSize() / 2;
  let singleLine = "";
  let lines = [];
  
  for (let n = 0; n < words.length; n++){
    const testLine = singleLine + words[n] + " ";
    const testWidth = textWidth(testLine);
    if (testWidth > boxWidth && n > 0){
      lines.push(singleLine.trim());
      singleLine = words[n] + " ";
    } else {
      singleLine = testLine;
    }
  }
  lines.push(singleLine.trim());
  
  const totalHeight = lines.length * lineHeight
  let startY = y;
  let startX = x;
  switch (v_align){
    case TOP:
      startY = y;
      break;
    case CENTER:
      startY = y - totalHeight / 2;
      break;
    case BOTTOM:
      startY = y - totalHeight;
      break;
  }
  for (let i = 0; i < lines.length; i++){
    text(lines[i], x, startY + i * lineHeight);
  }
  textAlign(h_align, v_align);
}
function stopAllFireworkSounds() {
  for (let snd of fireworkSounds) {
    if (snd.isPlaying()) {
      snd.stop();
    }
  }
}
function SetFontSize(factor){
  let value = Math.round(height / factor);
  if (height > width){
    value = Math.round(width / factor);
  }
  textSize(value);
}