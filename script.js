const canvas = document.getElementById('gameContainer')
const ctx = canvas.getContext('2d')

let score = 0
let lives = 3

function drawScore() {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText(`Score: ${score}`, 8, 20)
}

function drawLives() {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20)
}

const ballRadius = 10
const ballColor = '#0095DD'
let x = canvas.width / 2
let y = canvas.height - 30
let dx = 2
let dy = -2

const paddleHeight = 10
const paddleWidth = 75
const paddleColor = '#0095DD'
let paddleX = (canvas.width - paddleWidth) / 2

let rightPressed = false
let leftPressed = false

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true
  } else if (e.keyCode == 37) {
    leftPressed = true
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false
  } else if (e.keyCode == 37) {
    leftPressed = false
  }
}

document.addEventListener('mousemove', mouseMoveHandler, false)

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft
  if (
    relativeX > paddleWidth / 2 &&
    relativeX < canvas.width - paddleWidth / 2
  ) {
    paddleX = relativeX - paddleWidth / 2
  }
}

const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 30

let bricks = []
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = `#${ballColor}`
  ctx.fill()
  ctx.closePath()
}

function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = paddleColor
  ctx.fill()
  ctx.closePath()
}

function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop

        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r]
      if (b.status == 1) {
        if (
          x > b.x - ballRadius &&
          x < b.x + brickWidth + ballRadius &&
          y > b.y - ballRadius &&
          y < b.y + brickHeight + ballRadius
        ) {
          dy = -dy
          b.status = 0
          score++
          if (score == brickRowCount * brickColumnCount) {
            alert('You win, CONGRATULATIONS!')
            document.location.reload()
          }
        }
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall()

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy * 1.1
    } else {
      lives--
      if (!lives) {
        alert('GAME OVER')
        document.location.reload()
      } else {
        x = canvas.width / 2
        y = canvas.height - 30
        dx = 2
        dy = -2
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }
  x += dx
  y += dy

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }

  drawScore()
  drawLives()
  drawPaddle()
  drawBricks()
  collisionDetection()
  requestAnimationFrame(draw)
}

draw()
