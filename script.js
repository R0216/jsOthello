const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
context.scale(80, 80);

let turn = 1;
function drawBoard() {
    context.fillStyle = "green";
    context.fillRect(0, 0, 8, 8);
    context.lineWidth = 0.05;
    context.strokeStyle = "black";
    for (let i = 0; i < 8; i++){
        context.beginPath()
        context.moveTo(i, 0);
        context.lineTo(i, 8);
        context.stroke();
    }
    for (let i = 0; i < 8; i++){
        context.beginPath()
        context.moveTo(0, i);
        context.lineTo(8, i);
        context.stroke();
    }
}


const board = Array.from({length: 8}, ()=> new Array(8).fill(0));
console.table(board);
board[3][3] = 1;
board[3][4] = 2;
board[4][3] = 2;
board[4][4] = 1;

function clickHandler(board, x, y){
    if (turn === 1){
        if(board[y][x] === 0){
            board[y][x] = 1;
            turn = 2;
        }
    } else {
        if (board[y][x] === 0){
            board[y][x] = 2;
            turn = 1;
        }
    }
    console.log(board)
}

window.addEventListener("click", (e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = Math.floor(x / 80);
    const ny = Math.floor(y / 80);


    console.log(`座標は`,{nx, ny})
    clickHandler(board, nx, ny)
})

drawBoard();