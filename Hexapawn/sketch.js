//settings
let SaulMode = false;
let saulModePresses = 20;
let visualiser = false;
const gridSize = 3;
const moveSpeed = 3;
let tileSize;
let moveColours;
gameNumber = 0;
//time
let currTime;
let startTime;
//coords
let canvasX;
let offsetX;
let offsetY;
let tileX;
let tileY;
//game
let opaque = true;
let selected = -1;
let board = 'b'.repeat(gridSize) + '.'.repeat(gridSize*(gridSize-2)) + 'w'.repeat(gridSize);
let turn = 1;
let gameHistory = [];
let scorePlayer = 0;
let scoreBot = 0;
let randomPick;
let isGameEnd = false;
//moves
let moved = 0;
let moves = [];
let moving = moveSpeed + 1;
let latestMove = [-1,-1];
let latestBotMove = [-1,-1]
let latestBotBoard = board;
let moveFromX
let moveFromY;
let moveToX;
let moveToY;
let numberOfMoves;
//images
let wp;
let bp;
let wptrans;
let bsel;
let wsel;
let saul;
let saulSound;

function preload() {
    bp = loadImage('assets/bP.png');
    wp = loadImage('assets/wP.png');
    wptrans = loadImage('assets/wPtrans.png');
    bsel = loadImage('assets/bSel.png');
    wsel = loadImage('assets/wSel.png');
    saul = loadImage('assets/Saul.png');

    moveSound = loadSound('assets/move.mp3')
    captureSound = loadSound('assets/capture.mp3')
    saulSound = loadSound('assets/saul.mp3')
  }

function setup() {
    tileSize = floor(windowWidth / (3 * gridSize));
    let cnv = createCanvas(windowWidth,windowHeight);
    cnv.style('display', 'block');
    textSize(32);
    console.log(textFont())
    canvasX = windowWidth;
    offsetX = canvasX/2 - (tileSize * gridSize)/2;
    offsetY = 100;
    moveColours = [color(81,145,255),color(97,193,73),color(201,79,204),color(226,117,0)];
}

function draw() {
    currTime = millis();
    showGame();
    console.log(isGameEnd)
}

function showGame() {
    let x = mouseX;
    let y = mouseY;

    tileX = floor((x - offsetX)/tileSize);
    if (0 > tileX || tileX > (gridSize-1)) {
        tileX = 9;
    }
    tileY = floor((y - offsetY)/tileSize);
    if (0 > tileY || tileY > (gridSize-1)) {
        tileY = 9;
    }

    background(24);

    c1 = color(128);
    c2 = color(24);

    for(let bgY=0; bgY<150; bgY++){
        n = map(bgY,0,150,0,1);
        let newc = lerpColor(c1,c2,n);
        stroke(newc);
        line(0,bgY,width, bgY);
    }

    noStroke();


    /* fill(255);
    rect(0,0,250,50)
    fill(0);
    text(tileX, 10, 30);
    text(tileY, 100, 30);
    text(GridtoNum(tileX,tileY), 200, 30); */

    renderBoard();
    renderSelected();
    renderPieces();

    renderScore();
    if (!visualiser) renderRules();
    else renderVisualiser();
    if (turn % 2 === 0 && moving === moveSpeed + 1) renderMoves();
    renderOptions();
    renderHistory();

    if (isGameEnd) gameEnd();

    if (moving < moveSpeed) {
        if (turn % 2 === 1) image(wp,offsetX+(moveFromX+moving*(moveToX-moveFromX)/moveSpeed)*tileSize,offsetY+(moveFromY+moving*(moveToY-moveFromY)/moveSpeed)*tileSize,tileSize,tileSize);
        else if (!SaulMode) image(bp,offsetX+(moveFromX+moving*(moveToX-moveFromX)/moveSpeed)*tileSize,offsetY+(moveFromY+moving*(moveToY-moveFromY)/moveSpeed)*tileSize,tileSize,tileSize);
        else image(saul,offsetX+(moveFromX+moving*(moveToX-moveFromX)/moveSpeed)*tileSize,offsetY+(moveFromY+moving*(moveToY-moveFromY)/moveSpeed)*tileSize,tileSize,tileSize);
        moving++;
    } else if (moving === moveSpeed) {
        if (turn % 2 === 1) endMove(GridtoNum(moveToX,moveToY),'w');
        else endMove(GridtoNum(moveToX,moveToY),'b');
        moving++;
    }

    moves = getMoves();
}

function mousePressed() {
    if (turn % 2 === 1 && !isGameEnd) {
        opaque = false;
        moves = getMoves();

        if (board[GridtoNum(tileX,tileY)] === 'w' && 0 <= tileX && tileX <= (gridSize-1) && mouseButton === LEFT) {
            moved += 1;
            if (selected != GridtoNum(tileX,tileY)) {
                moved = 1;
            }
            selected = GridtoNum(tileX,tileY);
        } else if (selected != -1 && moves.includes(GridtoNum(tileX,tileY))) {
            console.log('move now',selected,GridtoNum(tileX,tileY))
            doMove(selected,GridtoNum(tileX,tileY),'w',1);
            selected = -1;
        } else {
            selected = -1;
        }
    }
    
    if (offsetX - 100 <= mouseX && mouseX <= offsetX - 50 && 553 <= mouseY && mouseY <= 583) {
        visualiser = !visualiser
        saulModePresses--;
        if (saulModePresses <= 0) { 
            SaulMode = true;
        }
    }
}

function mouseReleased() {
    if (turn % 2 === 1 && !isGameEnd) {
        opaque = true;
        moved = (moved + 1) % 4;

        if (selected != GridtoNum(tileX,tileY)) {
            moved = 0;
        }
        if (selected != -1 && moves.includes(GridtoNum(tileX,tileY))) {
            console.log('move now',selected,GridtoNum(tileX,tileY),'w',2)
            doMove(selected,GridtoNum(tileX,tileY),'w');
        }
        if (moved === 0) {
            selected = -1
        }
    }
}

function windowResized() {
    setup()
}