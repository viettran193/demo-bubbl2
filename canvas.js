const options = {
  method: "GET",
  headers: { "x-cg-demo-api-key": "CG-9yqMiajMmRJ9tCZLJNQTKNAX" },
};

fetch(
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10",
  options
)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FF7F66"];
function rotate(velocity, angle) {
  const rotatedVelocities = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };

  return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
  const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
  const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

  const xDist = otherParticle.x - particle.x;
  const yDist = otherParticle.y - particle.y;

  // Prevent accidental overlap of particles
  if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
    // Grab angle between the two colliding particles
    const angle = -Math.atan2(
      otherParticle.y - particle.y,
      otherParticle.x - particle.x
    );

    // Store mass in var for better readability in collision equation
    const m1 = particle.mass;
    const m2 = otherParticle.mass;

    // Velocity before equation
    const u1 = rotate(particle.velocity, angle);
    const u2 = rotate(otherParticle.velocity, angle);

    // Velocity after 1d collision equation
    const v1 = {
      x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
      y: u1.y,
    };
    const v2 = {
      x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
      y: u2.y,
    };

    // Final velocity after rotating axis back to original location
    const vFinal1 = rotate(v1, -angle);
    const vFinal2 = rotate(v2, -angle);

    // Swap particle velocities for realistic bounce effect
    particle.velocity.x = vFinal1.x;
    particle.velocity.y = vFinal1.y;

    otherParticle.velocity.x = vFinal2.x;
    otherParticle.velocity.y = vFinal2.y;
  }
}

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
addEventListener("click", () => {
  init();
});
addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});

// Objects
class Particle {
  constructor(x, y, mass, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 19,
      y: (Math.random() - 0.5) * 19,
    };
    //this.mass = Math.random(1, 10);
    this.mass = mass;
    this.opacity = 0;
    //this.number = number;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color;
    //c.fillText(this.number, this.x - 2 * this.radius * 0.1, this.y);
    c.stroke();
    c.closePath();
  }

  update(particles) {
    this.draw();
    //console.log(this.particles[2]);

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) continue;

      if (
        distance(this.x, this.y, particles[i].x, particles[i].y) -
          (this.radius + particles[i].radius) <=
        0
      ) {
        resolveCollision(this, particles[i]);
      }
    }
    if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
      this.velocity.x = -this.velocity.x * 0.75;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
      this.velocity.y = -this.velocity.y * 0.75;
    }
    //mouse collision detection
    if (
      distance(mouse.x, mouse.y, this.x, this.y) < canvas.width - this.radius &&
      this.opacity < 0.2
    ) {
      this.opacity += 0.02;
    } else if (this.opacity > 0) {
      this.opacity -= 0.02;
      this.opacity = Math.max(0, this.opacity);
      //console.log(this.opacity);
    }
    // while (this.velocity.x > 0) {
    //   this.velocity.x -= this.velocity.x / 5;
    //   //this.x += this.velocity.x;
    // }
    // while (this.velocity.x < 0) {
    //   this.velocity.x += this.velocity.x / 5;
    //   //this.y += this.velocity.y;
    // }
    this.x += this.velocity.x * 0.05;
    this.y += this.velocity.y * 0.05;
  }
}

// Implementation
let particles;
//let num = [10, 20, 30, 40, 50];

function init() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    const color = randomColor(colors);
    const radius = Math.round(
      randomIntFromRange(canvas.width / 100, canvas.width / 25)
    );

    //let number = num[i];
    //const radius = number;
    let mass = 1;
    let x = randomIntFromRange(radius, canvas.width - radius);
    let y = randomIntFromRange(radius, canvas.height - radius);
    //respawn overlay
    //if (i !== 0) {
    // for (let j = 0; j < particles.length; j++) {
    //   if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
    //     x = randomIntFromRange(radius, canvas.width - radius);
    //     y = randomIntFromRange(radius, canvas.height - radius);
    //     j = -1;
    //   }
    // }
    //}
    particles.push(new Particle(x, y, mass, radius, color)); //number
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  //c.fillText("HTML CANVAS BOILERPLATE", mouse.x, mouse.y);
  particles.forEach((particle) => {
    particle.update(particles);
  });
}

init();
animate();
