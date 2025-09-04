const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load hình nền núi
const bgImg = new Image();
bgImg.src = "https://i.imgur.com/JkYDjUR.jpg"; // Replace with your own background

// Load logo RECALL làm máy bay
const planeImg = new Image();
planeImg.src = "https://i.imgur.com/hR8Yx3k.png"; // Replace with your RECALL logo

// Load hình chữ "RECALL" làm chướng ngại vật
const obstacleImg = new Image();
obstacleImg.src = "https://i.imgur.com/7C4fq7X.png"; // Replace with RECALL-text image

const plane = {
  x: 50,
  y: 150,
  width: 60,
  height: 40,
  gravity: 0.3,
  lift: -6,
  velocity: 0,
  draw() {
    ctx.drawImage(planeImg, this.x, this.y, this.width, this.height);
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velocity = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  flap() {
    this.velocity = this.lift;
  }
};

let pipes = [];
const pipeGap = 180;
const pipeWidth = 70;
let frame = 0;
let score = 0;

function drawPipe(pipe) {
  // Vẽ ảnh chữ "RECALL" thay cho ống
  ctx.drawImage(obstacleImg, pipe.x, 0, pipeWidth, pipe.top);
  ctx.drawImage(obstacleImg, pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
}

function updatePipes() {
  frame++;
  if (frame % 100 === 0) {
    const top = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({ x: canvas.width, top });
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    // Va chạm
    if (
      plane.x < pipe.x + pipeWidth &&
      plane.x + plane.width > pipe.x &&
      (
        plane.y < pipe.top ||
        plane.y + plane.height > pipe.top + pipeGap
      )
    ) {
      alert("Game Over! Score: " + score);
      location.reload();
    }

    if (pipe.x + pipeWidth < plane.x && !pipe.passed) {
      pipe.passed = true;
      score++;
    }
  });

  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "22px Arial";
  ctx.fillText("Score: " + score, 20, 30);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    plane.flap();
  }
});

function loop() {
  drawBackground();
  plane.update();
  plane.draw();
  updatePipes();
  pipes.forEach(drawPipe);
  drawScore();
  requestAnimationFrame(loop);
}

loop();
