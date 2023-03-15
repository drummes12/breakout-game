const canvas = document.getElementById('gameContainer')
const ctx = canvas.getContext('2d')

const retroColors = [
  '#ff6969',
  '#e8a650',
  '#ffd369',
  '#a5d296',
  '#4cbbb9',
  '#7aa5d2',
  '#be86e3',
  '#9c4f97',
  '#ff8fb2',
  '#5c5c5c'
]

let score = 0
let lives = 3
const textColor = '#eee'
const initdx = 4
const initdy = -4

function drawScore() {
  ctx.font = '16px "press_start_29"'
  ctx.fillStyle = textColor
  ctx.fillText(`Score: ${score}`, 8, 25)
}

function drawLives() {
  ctx.font = '16px "press_start_29"'
  ctx.fillStyle = textColor
  ctx.fillText(`Lives: ${lives}`, canvas.width - 140, 25)
}

const ballRadius = 10
const ballColor = '#eee'
let x = canvas.width / 2
let y = canvas.height - 30
let dx = initdx
let dy = initdy

const paddleHeight = 15
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

const brickRowCount = 8
const brickColumnCount = 10
const brickPadding = 2
const brickOffsetTop = 30
const brickOffsetLeft = 2
const brickWidth =
  (canvas.width - brickOffsetLeft * 2 - brickColumnCount * brickPadding) /
  brickColumnCount
const brickHeight = 20

let bricks = []
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, color: retroColors[r] }
  }
}

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = ballColor
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
        ctx.fillStyle = bricks[c][r].color
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r]
      if (brick.status == 1) {
        if (
          x > brick.x - ballRadius &&
          x < brick.x + brickWidth + ballRadius &&
          y > brick.y - ballRadius &&
          y < brick.y + brickHeight + ballRadius
        ) {
          // Determinar en qué lado de la caja ocurrió la colisión
          const collisionLeft = brick.x
          const collisionRight = brick.x + brickWidth
          const collisionUp = brick.y - ballRadius
          const collisionDown = brick.y + brickHeight
          let collision = null
          if (collisionLeft <= x <= collisionRight && y > collisionDown)
            collision = 'down'
          if (collisionLeft <= x <= collisionRight && y < collisionUp)
            collision = 'up'
          if (collisionUp <= y <= collisionDown && x < collisionLeft)
            collision = 'left'
          if (collisionUp <= y <= collisionDown && x > collisionRight)
            collision = 'right'
          if (['down', 'up'].includes(collision)) dy = -dy
          if (['left', 'right'].includes(collision)) dx = -dx
          brick.status = 0
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
  } else if (y + dy > canvas.height - ballRadius) {
    lives--
    if (!lives) {
      alert('GAME OVER')
      document.location.reload()
    } else {
      x = canvas.width / 2
      y = canvas.height - 30
      dx = initdx
      dy = initdy
      paddleX = (canvas.width - paddleWidth) / 2
    }
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy * 1.1
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
