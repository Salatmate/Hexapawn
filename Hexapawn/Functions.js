function GridtoNum (gridX, gridY) {
    return gridX + gridY * gridSize;
}

function NumtoGrid (num) {
    return [num % gridSize, floor(num / gridSize)];
}

function replaceAt(string,replacement,index) {
    return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

function rndInt (min,max) { //include min and max
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeMove(arr, value) {
    console.log(arr)
    let i;
    for (i = 0; i < arr.length; i++) if (arr[i] === value) break;
    if (i > -1) {
      arr.splice(i, 1);
    }
    return arr;
}

function drawArrow(start, end, colour) {
    v1 = createVector(offsetX + NumtoGrid(start)[0]*tileSize + tileSize/2,offsetY + NumtoGrid(start)[1]*tileSize + tileSize/2);
    v2 = createVector(offsetX + NumtoGrid(end)[0]*tileSize + tileSize/2,offsetY + NumtoGrid(end)[1]*tileSize + tileSize/2);
    vec = createVector(v2.x-v1.x,v2.y-v1.y)
    push();
    stroke(colour);
    strokeWeight(35);
    fill(colour);
    translate(v1.x, v1.y);
    line(0, 0, vec.x, vec.y);
    rotate(vec.heading());
    let arrowSize = 40;
    translate(vec.mag() - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
    noStroke();
  }