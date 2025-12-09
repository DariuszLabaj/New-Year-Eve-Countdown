let activityCanvas = null;
let activityGraphicsContext = null;
let activityUI = {
  loadBtn: { x: 340, y: -160, w: 180, h: 40 },
  rerollBtn: { x: 340, y: -110, w: 180, h: 40 },
  setNextBtn: { x: 340, y: -60, w: 180, h: 40 },
};

function setupActivityCanvas(w, h) {
  if (!activityCanvas) {
    activityCanvas = createGraphics(w, h);
  } else {
    activityCanvas.resizeCanvas(w, h);
    activityCanvas.clear();
  }
  activityGraphicsContext = activityCanvas.drawingContext;
  return activityCanvas;
}

function updateActivityUIPositions(x, y, w, h) {

  let btnW = w / 4;

  activityUI.loadBtn.w = btnW;
  activityUI.rerollBtn.w = btnW;
  activityUI.setNextBtn.w = btnW;

  activityUI.loadBtn.h = h;
  activityUI.rerollBtn.h = h;
  activityUI.setNextBtn.h = h;

  activityUI.loadBtn.x = x;
  activityUI.rerollBtn.x = x + btnW + btnW / 2;
  activityUI.setNextBtn.x = x + 2 * btnW + btnW;

  activityUI.loadBtn.y = y;
  activityUI.rerollBtn.y = y;
  activityUI.setNextBtn.y = y;
}

function drawActivityUI(w, h, pb, pl) {
  push();
  noStroke();
  fill("#343027aa");        // semi-transparent black bg
  rect(pl, height - h - pb, w, h, 10);
  const margin = 10;

  let y = height - h - pb + margin;
  let x = pl + margin;

  textAlign(LEFT, TOP);
  textSize(16);
  fill("#f8f0e2");
  wrapTextInBox(strings.Activities, x, y, w);
  // Current & next info
  textSize(12);
  wrapTextInBox(strings.Current_, x, y + 16 + 8, w);

  wrapTextInBox(strings.Next_, x + w / 2, y + 16 + 8, w);

  // Buttons
  drawButton(activityUI.loadBtn, strings.Load);
  drawButton(activityUI.rerollBtn, strings.Reroll);
  drawButton(activityUI.setNextBtn, strings.Set_Next);

  if (currentActivity) {
    drawActivity(currentActivity, x, y + 16 + 8 + 12 + 6, w / 2 - 2 * margin, h - 2 * margin - 16 - 8 - 12 - 6 - 40 - margin);
  }

  if (nextActivity) {
    drawActivity(nextActivity, x + w / 2, y + 16 + 8 + 12 + 6, w / 2 - 2 * margin, h - 2 * margin - 16 - 8 - 12 - 6 - 40 - margin, true);
  }

  updateActivityUIPositions(x, y + 16 + 8 + 12 + 6 + h - 2 * margin - 16 - 8 - 12 - 6 - 40, w - 2 * margin, 40);

  pop();
}

function drawActivity(a, x, y, w, h) {
  push();
  rectMode(CORNER)

  if (!activityImages[a.id] && a.id) {
    // create hidden DOM img element once
    activityImages[a.id] = createImg(a.imageUrl, a.id.toString()).hide();
    activityImages[a.id].elt.onload = () => { redraw(); };
  }

  let imgScale = (h - 18 - 9) / 256;

  let imgW = Math.floor(170 * imgScale);
  let imgH = Math.floor(256 * imgScale);

  fill(200);
  rect(x + (w - imgW) / 2, y + 18 + 9, imgW, imgH, 10);

  if (a.id && activityImages[a.id]) {
    drawRoundedImage(activityImages[a.id], x + (w - imgW) / 2, y + 18 + 9, imgW, imgH, 10);
  } else {
    push();
    fill(100);
    noStroke();
    textAlign(CENTER, CENTER);
    text("Loading...", x + (w - imgW) / 2 + imgW / 2, y + 18 + 9 + imgH / 2);
    pop();
  }

  noStroke();
  fill("#f8f0e2");
  textSize(18);
  wrapTextInBox(
    a.displayName,
    x,
    y,
    w);

  pop();
}

function drawButton(b, label) {
  const isHover = mouseX > b.x && mouseX < b.x + b.w &&
    mouseY > b.y && mouseY < b.y + b.h;
  push();
  if (isHover) {
    fill("#e2c46d");
  } else {
    fill("#ffe087");
    // fill(80, 140, 230);
  }

  rect(b.x, b.y, b.w, b.h, 10);

  noStroke();
  drawingContext.shadowBlur = 0;
  fill("#574500");
  textAlign(CENTER, CENTER);
  textSize(14);

  text(label, b.x + b.w / 2, b.y + b.h / 2);

  pop();
}

function drawRoundedImage(img, x, y, w, h, radius = 10) {
  if (!img) return;
  push();
  const pg = setupActivityCanvas(w, h);
  // create graphics once
  pg.clear();

  // draw rounded rect
  pg.fill(255);
  pg.noStroke();
  pg.rect(0, 0, w, h, radius);

  // use native canvas clip
  pg.drawingContext.save();
  pg.drawingContext.beginPath();
  pg.drawingContext.moveTo(radius, 0);
  pg.drawingContext.lineTo(w - radius, 0);
  pg.drawingContext.quadraticCurveTo(w, 0, w, radius);
  pg.drawingContext.lineTo(w, h - radius);
  pg.drawingContext.quadraticCurveTo(w, h, w - radius, h);
  pg.drawingContext.lineTo(radius, h);
  pg.drawingContext.quadraticCurveTo(0, h, 0, h - radius);
  pg.drawingContext.lineTo(0, radius);
  pg.drawingContext.quadraticCurveTo(0, 0, radius, 0);
  pg.drawingContext.closePath();
  pg.drawingContext.clip();

  // draw the DOM image inside graphics
  pg.image(img, 0, 0, w, h, 0, 0, img.width, img.height, COVER);
  pg.drawingContext.restore();

  // draw buffer on main canvas
  image(pg, x, y);
  pop();
}
