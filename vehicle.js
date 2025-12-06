// Daniel Shiffman
// http://codingtra.in
// Steering Text Paths
// Video: https://www.youtube.com/watch?v=4hA7G3gup-4

class Vehicle {
  constructor(x, y) {
    this.pos = createVector(random(width), random(height), 0);
    this.target = createVector(x, y, 0);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 8;
    // this.maxspeed = 15;
    this.maxspeed = diagonal / 50;
    // this.maxforce = 3;
    this.maxforce = this.maxspeed / 3;
  }

  behaviors() {
    let arrive = this.arrive(this.target);
    // arrive.mult(1);
    this.applyForce(arrive);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.pos); // A vector pointing from the location to the target
    let d = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (d < 100) {
      let m = map(d, 0, 100, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce); // Limit to maximum steering force
    this.applyForce(steer);
  }
}
