class Star{
  constructor(){
    this.x = random(width);
    this.y = random(height);
    this.brightness = random(150, 255);
    this.size = random(1, 3);
    this.twinkleSpeed = random(0.01, 0.05);
    this.phase = random(TWO_PI);
  }
  
  update(){
    this.phase += this.twinkleSpeed;
  }
  
  show() {
    const alpha = 128 + 127 * sin(this.phase);
    noStroke();
    fill(this.brightness, this.brightness, this.brightness, alpha);
    circle(this.x, this.y, this.size);
  }
}