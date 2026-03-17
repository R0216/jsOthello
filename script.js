const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
context.scale(80, 80);

function resetGame(){
    for (let y = 0; y < 8; y++){
        for (let x = 0; x < 8; x++){
            board[y][x] = 0;
        }
    }

    board[3][3] = 1;
    board[3][4] = 2;
    board[4][3] = 2;
    board[4][4] = 1;
    turn = 1;

    updateGame();
}

function updateScore(){
    let black = 0;
    let white = 0;

    board.forEach(row => {
        row.forEach(cell => {
            if (cell === 1) black++;
            if (cell === 2) white++;
        });
    });

    document.getElementById('black-score').textContent = black;
    document.getElementById('white-score').textContent = white;
    document.getElementById('current-turn').textContent = (turn === 1) ? "黒" :"白";
}

function drawGuide(){
    const canList = randomCPU();
    canList.forEach(move => {
        context.beginPath();
        context.arc(move.x + 0.5, move.y + 0.5, 0.15, 0, Math.PI * 2);
        context.fillStyle = "rgba(0, 0, 0, 0.2)";
        context.fill();
        context.closePath();
    });

}

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
    updateScore();
    drawGuide();
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

const weight = [
    [100, -20, 10,  5,  5, 10, -20, 100],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [ 10,  -2,  5,  1,  1,  5,  -2,  10],
    [  5,  -2,  1,  0,  0,  1,  -2,   5],
    [  5,  -2,  1,  0,  0,  1,  -2,   5],
    [ 10,  -2,  5,  1,  1,  5,  -2,  10],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [100, -20, 10,  5,  5, 10, -20, 100]
];

function getBestMove(canMove){
    return canMove.reduce((best, current) => {
        return (weight[current.y][current.x] > weight[best.y][best.x]) ? current : best;
    });
}

function randomCPU(){
    const canList = []
    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if(canPut(board, x, y)){
                canList.push({x, y})
            }
        });
    });
    return canList
}

function turnCPU(){
    const canMove = randomCPU();
    if(canMove.length === 0) return;

    const level = document.getElementById("difficulty").value;
    let choice;

    if(level === "1"){
        choice = canMove[Math.floor(Math.random() * canMove.length)];
    } else if (level === "2") {
        const corners = [{x: 0, y: 0}, {x: 7, y: 0}, {x: 0, y: 7}, {x: 7, y: 7}];
        const cornerMove = canMove.find(move =>
            corners.some(corner => corner.x === move.x && corner.y === move.y)
        );
        choice = cornerMove || canMove[Math.floor(Math.random() * canMove.length)];
    } else {
        choice = getBestMove(canMove);
    }
    
    

    setTimeout(() => {
        clickHandler(board, choice.x, choice.y)
    }, 1000)
}

function clickHandler(board, x, y){
    if(canPut(board, x, y)){
        board[y][x] = turn;
        flipPieces(x, y);
        turn = 3 - turn;
        updateGame();

        
        if (!canPlayerMove()){
            alert(turn === 1 ? "パス" : "パス")
            turn = 3 - turn;
            updateGame();

            if (!canPlayerMove()){
                alert("終了");
            }
        }
        

        if(turn === 2){
            turnCPU();
        }
    } else {
        console.log("そこには置けません");
    }
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

document.getElementById("reset-button").addEventListener("click", ()=> {
    if(confirm("リセットしますか？")){
        resetGame();
    }
});

updateGame();


