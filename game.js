const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

let canvasSize;
let elementsSize;

const playerPosition = {
    x: undefined,
    y: undefined,
}

const giftPosition = {
    x: undefined,
    y: undefined,
}

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);


function setCanvasSize () {

    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementsSize = canvasSize / 10;

    startGame();
}

function startGame() {

    game.font = `${elementsSize}px Verdana`;
    game.textAlign = 'end';

    const map = maps[1];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    console.log({map, mapRows, mapRowCols});

    // Render del mapa

/*     for (let row = 1; row <= 10; row++) {

        for (let col = 1; col <= 10; col++) {
        game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row);
        }
        
    } */

    game.clearRect(0,0,canvasSize,canvasSize)

    // Refactor del render del mapa

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log(playerPosition)
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }

            game.fillText(emoji, posX, posY);

        })
    })
    
    movePlayer();

    /* game.fillRect(0,0,100,100);
    game.clearRect(50,50,50,50);
    game.font = '25px Verdana';
    game.fillStyle = 'purple';
    game.textAlign = 'end';
    game.fillText('Santi', 25, 25); */
}

function movePlayer(){

    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision) {
        console.log('Subiste de nivel')
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click',moveUp);
btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight);
btnDown.addEventListener('click',moveDown);


function moveUp() {
    console.log('Me quiero mover hacia arriba');

    if ((playerPosition.y - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();
    }
}

function moveLeft() {
    console.log('Me quiero mover hacia la izquierda');

    if ((playerPosition.x - elementsSize) < elementsSize) {
        console.log('OUT');
    } else {
        playerPosition.x -= elementsSize;
        startGame();
    }

}

function moveRight() {
    console.log('Me quiero mover hacia la derecha');

    if ((playerPosition.x + elementsSize) > canvasSize) {
        console.log('OUT');
    } else {
        playerPosition.x += elementsSize;
        startGame();
    }

}

function moveDown() {
    console.log('Me quiero mover hacia abajo');
    
   if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
   } else {
    playerPosition.y += elementsSize;
    startGame()
   }
    
}

function moveByKeys(event) {

    /* if(event.key == 'ArrowUp'){
        console.log('Me quiero mover hacia arriba');
    }else if(event.key == 'ArrowLeft'){
        console.log('Me quiero mover hacia la izquierda');
    }else if(event.key == 'ArrowRight'){
        console.log('Me quiero mover hacia la derecha');
    }else if(event.key == 'ArrowDown'){
        console.log('Me quiero mover hacia abajo');
    }else{
        console.log(event)
    } */


    // Refactor abreviando el If

    if (event.key == 'ArrowUp' || event.key == 'w') moveUp();
    else if(event.key == 'ArrowLeft' || event.key == 'a') moveLeft();
    else if(event.key == 'ArrowRight' || event.key == 'd') moveRight();
    else if(event.key == 'ArrowDown' || event.key == 's') moveDown();


    // Refactor con switch

    /* switch(event.key){
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        default:
            console.log(event.key)
    } */

}

