/*
  The AIs name is Marg
*/

var aiVAi = false;
var paddleW = 10;
var paddleH = 75;
var rPPos;
var lPPos;
var pSpeed = 7;
var ballPos = [200, 200];
var ballVel = [7.5, 0.5];
var ballW = 10;
var ballH = 20;
var aiTurn = false;
var points = [0, 0];

this.focus();

function start() {
  rPPos = [0, height / 2 - paddleH / 2];
  lPPos = [width - paddleW, height / 2 - paddleH / 2];
  ballPos = [200, 200];
  ballVel = [12, 1];
  aiTurn = false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  start();
  document.body.style.overflow = 'hidden';
  var b = createButton('AI vs. AI');
  b.position(0,height - 20);
  b.mousePressed(() => {aiVAi = !aiVAi});
}

function draw() {
  background(0);
  ellipse(ballPos[0], ballPos[1], ballW, ballH);
  rect(lPPos[0], rPPos[1], paddleW, paddleH);
  rect(rPPos[0], lPPos[1], paddleW, paddleH);
  ballPos = addVectors(ballPos, ballVel);
  ballVel = multVectors(bounce(ballPos, false), ballVel);
  
  if (keyIsDown(38) && rPPos[1] > 0) {
    rPPos[1] -= pSpeed;
  }
  if (keyIsDown(40) && rPPos[1] < height - paddleH) {
    rPPos[1] += pSpeed;
  }
  lPPos[1] += ai(1000, lPPos);
  if (aiVAi) rPPos[1] += ai(1000, rPPos);
  fill(255);
  text(points[0], 0, 10);
  text(points[1], 30, 10);
}

function addVectors(a, b) {
  var c = [];
  for (let i = 0; i < a.length; i++) {
    c[i] = a[i] + b[i];
  }
  return c;
}

function multVector(a, factor) {
  var c = [];
  for (let i = 0; i < a.length; i++) {
    c[i] = a[i] * factor;
  }
  return c;
}

function multVectors(a, b) {
  var c = [];
  for (let i = 0; i < a.length; i++) {
    c[i] = a[i] * b[i];
  }
  return c;
}

function bounce(pos, allWalls) {
  var x = pos[0];
  var y = pos[1];
  if (y < ballH / 2) {
    return [1, -1];
  }
  if (y > height - ballH / 2) {
    return [1, -1];
  }
  if (x < paddleW && aiTurn) {
    if (allWalls) return [-1, 1];
    
    if (y > lPPos[1] && y < lPPos[1] + paddleH) {
      aiTurn = false;
      ballVel = rY(y - lPPos[1], ballVel, lPPos[0]);
      return [-1, 1];
    } else {
      points[1] += 1;
      start();
    }
  }
  if (x > width - paddleW && !aiTurn) {
    if (allWalls) return [-1, 1];
    
    if (y > rPPos[1] && y < rPPos[1] + paddleH) {
      aiTurn = true;
      ballVel = rY(y - rPPos[1], ballVel, lPPos[0]);
      return [-1, 1];
    } else {
      points[0] += 1;
      start();
    }
  }
  return [1, 1];
}
function rY(diffX, vel, pX) {
  var i = PI / 4;
  var l = len(vel);
  var n = normal(vel);
  var a = map(diffX, 0, paddleH, -i, i);
  
  var r = atan2(n[1], n[0]) + a;
  return [cos(r) * l, sin(r) * l];
}
function normal(a) {
  var b = len(a);
  return [a[0] / b, a[1] / b];
}
function len(a) {
  return sqrt(a[0] * a[0] + a[1] * a[1]);
}
function ai(iters, p) {
  var tPos = ballPos;
  var tVel = ballVel;
  for (let i = 0; i < iters; i++) {
    tPos = addVectors(tPos, tVel);
    tVel = multVectors(tVel, bounce(tPos, true));

    if (p == lPPos && tPos[0] < paddleW) {
      break;
    }
    else if(tPos[0] > width - paddleW) {
      break;
    }
  }

  var diff = p[1] + paddleH / 2 - tPos[1];
  var a = 0;
  if (diff > pSpeed / 2 + 1) {
    a = pSpeed;
  }
  if (diff < -pSpeed / 2 -1) {
    a = -pSpeed;
  }
  
  return -a;
}
