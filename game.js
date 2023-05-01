const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};

let enemyPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function fixNumber(n) {
    return Number(n.toFixed(0))
}

function setCanvasSize () {

    if(window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7;
    } else {
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);
    
    elementsSize = canvasSize / 10;
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {

    game.font = `${elementsSize}px Verdana`;
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWinAndRecord();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    console.log({map, mapRows, mapRowCols});

    showLives()

    // Render del mapa

/*     for (let row = 1; row <= 10; row++) {

        for (let col = 1; col <= 10; col++) {
        game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row);
        }
        
    } */

    enemyPositions = [];

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
                }
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                
                enemyPositions.push({
                    x: posX,
                    y: posY,
                })
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
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    })

    if (enemyCollision) {
        levelFail();
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}

function levelWin() {
    console.log('Subiste de nivel');
    level++;
    startGame()
}

function levelFail() {
    console.log('Chocaste con un enemigo :(');
    lives--;
    

    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }
    
    playerPosition.y = undefined;
    playerPosition.x = undefined;
    startGame();
}

function gameWinAndRecord() {
    console.log('¡Terminaste el juego!')
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = 'Superaste el record!';
        } else {
            pResult.innerHTML = 'Lo siento, no superaste el record';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = 'Primera vez? Muy bien, pero ahora trata de superar tu tiempo';
    }
    console.log({recordTime, playerTime})
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']);

    spanLives.innerHTML = '';

    heartsArray.forEach(heart => {
        spanLives.append(heart);
    })
}

function showTime() {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord() {
    spanRecord.innerHTML = localStorage.getItem('record_time')
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

