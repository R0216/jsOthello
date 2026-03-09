const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const rect = canvas.getBoundingClientRect();
context.scale(80, 80);

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

window.addEventListener("click", (e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    console.log(`座標は`,{x, y})
    console.log(Math.floor(x / 80))
    console.log(Math.floor(y / 80))
})

drawBoard();