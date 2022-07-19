let highX;
let highY;
let randomPickTime = 0;

function renderBoard() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if ((i + j) % 2 == 1) {
                fill(181,135,99);
            } else {
                fill(240,218,181);
            }
            rect(offsetX + i*tileSize, offsetY + j*tileSize, tileSize, tileSize);
        }
    }
}

function renderSelected() {
    if (1 <= selected && selected <= gridSize*gridSize) {
        [highX, highY] = NumtoGrid(selected);
        if ((highX + highY) % 2 == 1) {
            fill(100,109,64);
        } else {
            fill(129,150,105);
        }
        rect(offsetX + highX*tileSize, offsetY + highY*tileSize, tileSize, tileSize);
        let moves = getMoves();
        moves.forEach(function(move) {
            let moveX = move % gridSize;
            let moveY = floor(move / gridSize);
            if (tileX + tileY*gridSize != move) {
                if (board[move] === '.') {
                    if ((highX + highY) % 2 == 0) {
                        fill(100,109,64);
                    } else {
                        fill(129,150,105);
                    }
                    circle(offsetX + moveX*tileSize + tileSize/2, offsetY + moveY*tileSize + tileSize/2, tileSize/5);
                } else if (board[move] === 'b') {
                    if ((highX + highY) % 2 == 1) {
                        image(bsel,offsetX + moveX*tileSize, offsetY + moveY*tileSize, tileSize, tileSize)
                    } else {
                        image(wsel,offsetX + moveX*tileSize, offsetY + moveY*tileSize, tileSize, tileSize)
                    }
                }
            } else {
                if ((highX + highY) % 2 == 1) {
                    fill(133,120,78);
                } else {
                    fill(174,177,136);
                }
                rect(offsetX + tileX*tileSize, offsetY + tileY*tileSize, tileSize, tileSize);
            }
        })
    }
}

function getMoves() {
    let moves = [];
    if (selected === -1) return moves;
    if (board[highX + (highY-1)*gridSize] === '.') {
        moves.push(GridtoNum(highX,(highY-1)))
    }
    if (0 <= highX && highX <= (gridSize-2) && board[GridtoNum((highX+1),(highY-1))] === 'b') {
        moves.push(GridtoNum((highX+1),(highY-1)))
    }
    if (1 <= highX && highX <= (gridSize-1) && board[GridtoNum((highX-1),(highY-1))] === 'b') {
        moves.push(GridtoNum((highX-1),(highY-1)))
    }
    return moves;
}

function renderPieces() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        let [gridX,gridY] = NumtoGrid(i);
        if (board[i] === 'b' && !SaulMode) {
            image(bp, offsetX + gridX*tileSize, offsetY + gridY*tileSize, tileSize, tileSize)
        } else if (board[i] === 'b' && SaulMode) {
            image(saul, offsetX + gridX*tileSize, offsetY + gridY*tileSize, tileSize, tileSize)
        } else if (selected === i && !opaque) {
            image(wptrans, offsetX + gridX*tileSize, offsetY + gridY*tileSize, tileSize, tileSize)
        } else if (board[i] === 'w') {  
            image(wp, offsetX + gridX*tileSize, offsetY + gridY*tileSize, tileSize, tileSize)
        }
    }

    if (moved === 1 || moved === 3) {
        image(wp, mouseX - tileSize/2, mouseY - tileSize/2, tileSize, tileSize);
    }
}

function renderScore() {
    fill(64);
    rect(offsetX + tileSize*gridSize + 25, 100, 300, 200, 0, 10, 10, 0);
    fill(255);
    textSize(32);
    text('Score',offsetX + tileSize*gridSize + 125, 150)
    text('Player',offsetX + tileSize*gridSize + 60, 225)
    if (SaulMode) text('Saul',offsetX + tileSize*gridSize + 220, 225);
    else text('Bot',offsetX + tileSize*gridSize + 210, 225);
    text(scorePlayer,offsetX + tileSize*gridSize + 90, 275)
    text(scoreBot,offsetX + tileSize*gridSize + 240, 275)
    stroke(192);
    line(offsetX + tileSize*gridSize + 50, 175, offsetX + tileSize*gridSize + 300,175)
    noStroke();
}

function renderRules() {
    fill(64);
    rect(offsetX - 325, 100, 300, 400, 10, 0, 0, 10);
    fill(255);
    textSize(32);
    text('How to play',offsetX - 255, 150)
    textSize(16);
    text('Based on chess rules\nYou play as white and go first\nThe AI plays as black\nTo win:\n• Get a piece to the end\n• Leave enemy with no possible moves\n\nThe AI will start by playing randomly\nIf it wins it will only do that move\nIf it loses it will remove that move\n\nAs the games happen it will get better\nEventually it will become unbeatable',offsetX - 310, 215)

    textSize(32);
    stroke(192);
    line(offsetX - 300, 175, offsetX - 50,175)
    noStroke();
}

function renderVisualiser() {
    fill(64);
    rect(offsetX - 325, 100, 300, 400, 10, 0, 0, 10);
    fill(255);
    textSize(32);
    text('Move Visualiser',offsetX - 287, 150)

    if (turn % 2 === 0 && !isGameEnd) {
        if (randomPickTime === 0) {
            randomPick = rndInt(0,numberOfMoves-1) 
            randomPickTime = 4
        }
        textSize(24);
        fill(255);
        text('Picking move...',offsetX - 300, 275);
    }
    if (randomPick != undefined) {
        visualX = offsetX - 275
        visualY = 212
        for (let i = 0; i < numberOfMoves; i++) {
            fill(moveColours[i]);
            if (i === randomPick) {
                stroke(0);
                strokeWeight(3);
            }
            circle(visualX,visualY,40);
            noStroke();
            visualX += 65;
        }
        randomPickTime--;
        if (turn % 2 === 1 && !isGameEnd) {
            textSize(24);
            fill(255);
            text('Move picked',offsetX - 300, 275);
        }
    }
    if (isGameEnd) {
        textSize(24);
        fill(255);
        text('Removing losing moves...',offsetX - 300, 275);
    }

    stroke(192);
    strokeWeight(1);
    line(offsetX - 300, 175, offsetX - 50,175)
    noStroke();
}

function renderMoves() {
    if (!isGameEnd && visualiser) for (let i = 0; i < botMoves[board].length; i++) drawArrow(botMoves[board][i][0],botMoves[board][i][1],moveColours[i]);
    
    if (!isGameEnd && (currTime - startTime >= 2000 || (!visualiser && currTime - startTime >= 500))) enemyMove();
}

function renderOptions() {
    fill(64);
    rect(offsetX - 325, 525, 300, 87, 10, 0, 0, 10);
    textSize(24);
    fill(255);
    text('Move Visualiser', offsetX - 290, 575);
    if (visualiser) fill(29,198,0);
    else fill(196,45,45);
    rect(offsetX - 100, 553, 50, 30, 15,15,15,15)
}

function renderHistory() {
    fill(64);
    rect(offsetX + tileSize*gridSize + 25, 325, 300, 287, 0, 10, 10, 0);
    fill(255);
    textSize(32);
    text('Game History',offsetX + tileSize*gridSize + 75, 375)
    gameX = offsetX + tileSize*gridSize + 57;
    gameY = 407;
    for (let i = 0; i < 42; i++) {
        if (gameHistory[i] === 0) fill(29,198,0);
        else if (gameHistory[i] === 1) fill(196,45,45);
        else fill(48);
        rect(gameX,gameY,25,25,5,5,5,5);
        gameX += 35;
        if ((i + 1) % 7 === 0) {
            gameX = offsetX + tileSize*gridSize + 57;
            gameY += 35;
        }
    }

    stroke(192);
    line(offsetX + tileSize*gridSize + 50, 400, offsetX + tileSize*gridSize + 300,400)
    noStroke();
}