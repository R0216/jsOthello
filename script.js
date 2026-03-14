const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
context.scale(80, 80);

const dir = [
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1],
    [1, 0],
    [1, 1],
    [1, -1],
]
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

function drawPieces(){
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if(board[y][x] !== 0){
                context.beginPath();
                context.arc(x + 0.5, y + 0.5, 0.4, 0, Math.PI * 2);
                context.fillStyle = board[y][x] === 1 ? "black" : "white";
                context.fill();
                context.closePath();
            }
        }
    }
}

function updateGame(){
    drawBoard();
    drawPieces();
}


const board = Array.from({length: 8}, ()=> new Array(8).fill(0));
board[3][3] = 1;
board[3][4] = 2;
board[4][3] = 2;
board[4][4] = 1;

function canPut(board, x, y){
    if (board[y][x] !== 0) return false;

    for (const [dx, dy] of dir){
        let nx = x + dx;
        let ny = y + dy;
        let hasOpponentPiece = false;

        while(nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === 3 - turn){
            nx += dx;
            ny += dy;
            hasOpponentPiece = true;
        }
        if(hasOpponentPiece && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === turn){
            return true
        }
    }
    return false
}

function flipPieces(x, y){
    for (const [dx, dy] of dir){
        let nx = x + dx;
        let ny = y + dy;
        let canFlip = [];

        while(nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === 3 - turn){
            canFlip.push([nx, ny]);
            nx += dx;
            ny += dy;
        }

        if(canFlip.length > 0 && nx >= 0 && nx < 8 && ny >= 0 && ny < 8 && board[ny][nx] === turn){
            for (const [fx, fy] of canFlip){
                board[fy][fx] = turn;
            }
        }
    }
}

function canPlayerMove(){
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            if (canPut(board, x, y,)){
                return true;
            }
        }
    }
    return false;
} 

function clickHandler(board, x, y){
    if(canPut(board, x, y)){
        if(board[y][x] === 0){
            board[y][x] = turn;
            flipPieces(x, y);
            turn = 3 - turn;

            if (!canPlayerMove()){
                alert(turn === 1 ? "パス" : "パス")
                turn = 3 - turn;

                if (!canPlayerMove()){
                    alert("終了");
                }
            }
            updateGame();
        } else {
            console.log("そこには置けません");
        }
    }
    
    console.log(board)
}

window.addEventListener("click", (e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = Math.floor(x / 80);
    const ny = Math.floor(y / 80);


    console.clear();
    console.log(`座標は`,{nx, ny})
    console.table(board);
    clickHandler(board, nx, ny)
})

drawBoard();
drawPieces();