// js/diwali.js
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("fireworksCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const particles = [];
  const rockets = [];

  const colors = [
    { r: 255, g: 215, b: 0 }, // Gold
    { r: 255, g: 100, b: 0 }, // Orange
    { r: 255, g: 50, b: 150 }, // Magenta
    { r: 0, g: 200, b: 255 }, // Cyan
  ];

  class Rocket {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = -(Math.random() * 3 + 9);
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.exploded = false;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.12;
      if (this.vy >= 0) {
        this.exploded = true;
        createBurst(this.x, this.y, this.color);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      ctx.fill();
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.015;
    }
    update() {
      this.vx *= 0.94;
      this.vy *= 0.94;
      this.vy += 0.08;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function createBurst(x, y, color) {
    for (let i = 0; i < 45; i++) {
      particles.push(new Particle(x, y, color));
    }
  }

  function animate() {
    // Fade out previous frames for a trail effect on a transparent background
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter"; // Makes explosions glow brightly

    // Limit rocket frequency so it doesn't distract too much from the website
    if (Math.random() < 0.025) rockets.push(new Rocket());

    for (let i = rockets.length - 1; i >= 0; i--) {
      rockets[i].update();
      rockets[i].draw();
      if (rockets[i].exploded) rockets.splice(i, 1);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].alpha <= 0) particles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  animate();
});
