function doMove(moveFrom,moveTo,colour,type) {
    board = replaceAt(board,'.',moveFrom);
    latestMove = [moveFrom,moveTo];

    if (type === 1) {
        [moveFromX, moveFromY] = NumtoGrid(latestMove[0]);
        [moveToX, moveToY] = NumtoGrid(latestMove[1]);
        moving = 0;
    } else {
        if (board[moveTo] === '.') {
            moveSound.play();
        } else if (!SaulMode) {
            captureSound.play();
        } else {
            saulSound.play()
        }
        board = replaceAt(board,colour,moveTo);
        turn++;
        checkGameEnd();
        if (turn % 2 === 0) startTime = currTime;
    }
}

function endMove(moveTo,colour) {
    if (board[moveTo] === '.') {
        moveSound.play();
    } else if (!SaulMode) {
        captureSound.play();
    } else {
        saulSound.play()
    }
    board = replaceAt(board,colour,moveTo);
    turn++;
    checkGameEnd();
    if (turn % 2 === 0) startTime = currTime;
}

function enemyMove() {
    if (randomPick != undefined && randomPick < botMoves[board].length) botMove = botMoves[board][randomPick];
    else botMove = botMoves[board][rndInt(0,botMoves[board].length-1)];

    latestBotMove = botMove;
    latestBotBoard = board;

    doMove(botMove[0],botMove[1],'b',1)
}

function checkGameEnd() {
    if (isGameEnd) return;
    if (botMoves[board] === undefined) generateMoves(board);
    if (turn % 2 === 0) numberOfMoves = botMoves[board].length;
    randomPickTime = 0;
    console.log(latestBotBoard)

    if (turn % 2 === 0 && (board.slice(0,gridSize).includes('w') || botMoves[board].length === 0)) { //player wins
        scorePlayer++;
        botMoves[latestBotBoard] = removeMove(botMoves[latestBotBoard],latestBotMove)
        startTime = currTime;
        gameHistory.push(0);
        gameEnd();
    } else if (turn % 2 === 1 && (board.slice(gridSize*(gridSize-1),gridSize*gridSize).includes('b')  || !whiteCanMove(board))) { //bot wins
        botMoves[latestBotBoard] = [latestBotMove];
        scoreBot++;
        startTime = currTime;
        gameHistory.push(1);
        gameEnd();
    }
}

function gameEnd() {
    isGameEnd = true;
    
    if (currTime - startTime >= 1500) resetGame();
}

function resetGame() {
    board = 'b'.repeat(gridSize) + '.'.repeat(gridSize*(gridSize-2)) + 'w'.repeat(gridSize);
    turn = 1;
    latestMove = [-1,-1];
    latestBotMove = [-1,-1];
    latestBotBoard = board;
    randomPick = undefined;
    isGameEnd = false;
    gameNumber++;

    console.log(botMoves);
}