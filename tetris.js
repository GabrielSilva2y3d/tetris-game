const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function collidePiece(arena, player){
  const[m, p] = [player.piece, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && 
        (arena[y + p.y] && arena[y + p.y][x + p.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h){
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPiece(type) {
  if (type === 'I') {
      return [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
      ];
  } else if (type === 'L') {
      return [
          [0, 2, 0],
          [0, 2, 0],
          [0, 2, 2],
      ];
  } else if (type === 'J') {
      return [
          [0, 3, 0],
          [0, 3, 0],
          [3, 3, 0],
      ];
  } else if (type === 'O') {
      return [
          [4, 4],
          [4, 4],
      ];
  } else if (type === 'Z') {
      return [
          [5, 5, 0],
          [0, 5, 5],
          [0, 0, 0],
      ];
  } else if (type === 'S') {
      return [
          [0, 6, 6],
          [6, 6, 0],
          [0, 0, 0],
      ];
  } else if (type === 'T') {
      return [
          [0, 7, 0],
          [7, 7, 7],
          [0, 0, 0],
      ];
  }
}

function draw(){
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawPiece(arena, {x: 0, y: 0});
  drawPiece(player.piece, player.pos);
};

function drawPiece(matrix, offset){
  matrix.forEach((row,y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = 'red';
          context.fillRect(x + offset.x, 
                           y + offset.y,
                           1, 1);
        }  
      });
  });
};

const arena = createMatrix(12, 20);

function merge(arena, player) {
  player.piece.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          arena[y + player.pos.y][x + player.pos.x] = value;
        }
      });
  });
};

const player = {
  pos: {x: 0, y: 0},
  piece: createPiece('O')
};

function playerDrop(){
    player.pos.y++
    if (collidePiece(arena, player)) {
      player.pos.y--;
      merge(arena, player);
      playerReset();
    }
    dropCounter = 0
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collidePiece(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerRotate() {
  let pos = player.pos.x;
  let offset = 1;
  rotate(player.piece);
  while (collidePiece(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.piece[0].length) {
      rotate(player.piece);
      player.pos.x = pos;
      return;
    }
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.piece = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.piece[0].length / 2 | 0)

  if (collidePiece(arena, player)) {
    arena.forEach(row => row.fill(0));
  }
}

function rotate(piece) {
  for (let y = 0; y < piece.length; ++y) {
    for (let x = 0; x < y; ++x) {
      [
        piece[x][y],
        piece[y][x],
      ] = [
        piece[y][x],
        piece[x][y],
      ];  
    }
  }
    piece.forEach(row => row.reverse());
}

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
  if (event.key == "ArrowLeft") {
    playerMove(-1);
  }else if (event.key == "ArrowRight") {
    playerMove(1);
  }else if (event.key == "ArrowDown") {
    playerDrop();
  }else if (event.key == " "){
    playerRotate();
  }
});

update();
    