const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load hình máy bay
const planeImg = new Image();
planeImg.src = "https://i.imgur.com/dwZQW4z.png"; // Bạn có thể thay bằng link ảnh khác hoặc file local

const plane = {
  x: 50,
  y: 150,
  width: 50,
  height: 40,
  gravity: 0.4,
  lift: -8,
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

// Ống (chướng ngại vật)
let pipes = [];
const pipeGap = 150;
const pipeWidth = 60;
let frame = 0;
let score = 0;

function drawPipe(pipe) {
  ctx.fillStyle = "green";
  ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
  ctx.fillRect(pipe.x, pipe.top + pipeGap, pipeWidth, canvas.height - pipe.top - pipeGap);
}

function updatePipes() {
  frame++;

  if (frame % 100 === 0) {
    const top = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
    pipes.push({ x: canvas.width, top });
  }

  pipes.forEach(pipe => pipe.x -= 2);

  // Xử lý va chạm
  pipes.forEach(pipe => {
    if (
      plane.x < pipe.x + pipeWidth &&
      plane.x + plane.width > pipe.x &&
      (
        plane.y < pipe.top ||
        plane.y + plane.height > pipe.top + pipeGap
      )
    ) {
      alert("💥 Game Over! Điểm: " + score);
      location.reload();
    }

    if (pipe.x + pipeWidth < plane.x && !pipe.passed) {
      pipe.passed = true;
      score++;
    }
  });

  // Xoá pipe ra khỏi màn hình
  if (pipes.length > 0 && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }
}

function drawScore() {
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    plane.flap();
  }
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  plane.update();
  plane.draw();

  updatePipes();
  pipes.forEach(drawPipe);

  drawScore();

  requestAnimationFrame(loop);
}

loop();
