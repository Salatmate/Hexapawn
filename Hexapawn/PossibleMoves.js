let botMoves = {};

function generateMoves(board) {
    botMoves[board] = [];
    for (let i = 0; i < gridSize*(gridSize-1); i++) {
        if (board[i] === 'b') {
            let [x,y] = NumtoGrid(i);
            if (x > 0 && board[GridtoNum(x-1,y+1)] === 'w') botMoves[board].push([i,GridtoNum(x-1,y+1)]);
            if (board[GridtoNum(x,y+1)] === '.') botMoves[board].push([i,GridtoNum(x,y+1)]);
            if (x < gridSize-1 && board[GridtoNum(x+1,y+1)] === 'w') botMoves[board].push([i,GridtoNum(x+1,y+1)]);
        }
    }
}

function whiteCanMove(board) {
    for (let i = gridSize-1; i < gridSize*gridSize; i++) {
        if (board[i] === 'w') {
            let [x,y] = NumtoGrid(i);
            if (x > 0 && board[GridtoNum(x-1,y-1)] === 'b') return true;
            if (board[GridtoNum(x,y-1)] === '.') return true;
            if (x < gridSize-1 && board[GridtoNum(x+1,y-1)] === 'b') return true;
        }
    }
    return false;
}
