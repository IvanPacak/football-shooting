let timeRef;

let x = 0;
let y  = 0;

let countGoals = 0; 

let velocity = 1;

const gameCanvas = {
    canvas: $('#canvas'),
    width: this.canvas.width,
    height: this.canvas.height,
    ctx: this.canvas.getContext("2d")
}

const ball = {
    radius: 12,
    posX: 200,
    posY: 300
}

const goal = {
    width: 60,
    height: 10,
    posX: gameCanvas.width / 2,
    posY: 10
}

const line = {
    posX: ball.posX,
    posY: ball.posY,
    width: 40,
    currentPosX: 0,
    currentPosY: 0
}

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

const drawGoal = () => {
    gameCanvas.ctx.fillStyle = "#504847";
    gameCanvas.ctx.fillRect(goal.posX - goal.width / 2, goal.posY, goal.width, goal.height);
}

const drawBall = (posX, posY) => {
    gameCanvas.ctx.fillStyle = "#2B57AC";
    gameCanvas.ctx.font=`${ball.radius}px FontAwesome`;
    gameCanvas.ctx.fillText('\uf1e3', posX - ball.radius / 2, posY + ball.radius / 4);
}

const moveLine = (x, y) => {
    gameCanvas.ctx.strokeStyle = "#504847";
    gameCanvas.ctx.beginPath();
    gameCanvas.ctx.setLineDash([5, 5]);
    line.currentPosX = line.width * Math.cos(x);
    if(Math.sin(y) >= 0){
        gameCanvas.ctx.moveTo(ball.posX + line.width * Math.cos(x), ball.posY - line.width * Math.sin(y));
        line.currentPosY = -line.width * Math.sin(y);
    }
    else{
        gameCanvas.ctx.moveTo(ball.posX + line.width * Math.cos(x), ball.posY + line.width * Math.sin(y));
        line.currentPosY = line.width * Math.sin(y);
    }
    gameCanvas.ctx.lineTo(ball.posX, ball.posY);
    gameCanvas.ctx.lineWidth = 2;
    gameCanvas.ctx.stroke();
}

const moveGoal = () => {
    if(countGoals >= 20){
        if(goal.posX === (3/4) * gameCanvas.width ) velocity *= -1;
        if(goal.posX === (1/4) * gameCanvas.width) velocity *= -1;

        goal.posX += velocity;
    }
}

const kickBall = () => {
    clearInterval(timeRef);
    timeRef = setInterval(() => {
        gameCanvas.ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawGoal();
        moveGoal();
        drawBall(ball.posX, ball.posY);
        ball.posX += 0.3 * line.currentPosX;
        ball.posY += 0.3 * line.currentPosY;
        scoringGoal();
        if(isBallOut()){
            newShot();
        }
    }, 25);
}

const newShot = () => {
    clearInterval(timeRef);
    setTimeout(() => {
        ball.posX = getRndInteger(20, 380);
        ball.posY = getRndInteger(100, 380);
        startGame();
    }, 100)
}

let isBallOut = () => ((ball.posX < 0 || ball.posX > gameCanvas.width || ball.posY < 0 || ball.posY > gameCanvas.height) ? true : false);

const scoringGoal = () => {
    if(ball.posX - ball.radius / 2 > goal.posX - goal.width / 2 && ball.posX - ball.radius / 2 < goal.posX + goal.width / 2 && ball.posY + ball.radius / 4 <= goal.posY + goal.height){
        countGoals++;
        $('.count-goal').text(countGoals);
        newShot();
    }
}

const startGame = () => {
    clearInterval(timeRef)
    timeRef = setInterval(() => { 
        gameCanvas.ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawGoal();
        moveGoal();
        drawBall(ball.posX, ball.posY);
        moveLine(x, y);
        x += 0.05;
        y += 0.05;
    }, 25)
}

$('.start-btn').click(() => {
    $('.glass-filter').hide();
    startGame();
});

$('#canvas').click(() => {
    kickBall();
});