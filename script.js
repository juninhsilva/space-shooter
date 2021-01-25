const ship = document.querySelector('.player-shooter');
const area = document.querySelector('#main-play-area');
const instructions = document.querySelector('.instructions');
const start = document.querySelector('.start');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];

let interval;

function flyShip(event){
    if(event.key === 'ArrowUp'){
        event.preventDefault();
        moveUp();
    }else if(event.key === 'ArrowDown'){
        event.preventDefault();
        moveDown();
    }else if(event.key === ' '){
        event.preventDefault();
        laserShot();
    }
}

function moveUp(){
    let topPosition = getComputedStyle(ship).getPropertyValue('top');
    if(topPosition === '0px'){
        return;
    }else{
        let position = parseInt(topPosition);
        position -= 10;
        ship.style.top = `${position}px`;
    }
}

function moveDown(){
    let topPosition = getComputedStyle(ship).getPropertyValue('top');
    if(topPosition === '510px'){
        return;
    }else{
        let position = parseInt(topPosition);
        position += 10;
        ship.style.top = `${position}px`;
    }
}

function laserShot(){
    let laser = createLaser();
    area.appendChild(laser);
    moveLaser(laser);
}

function createLaser() {
    let xPosition = parseInt(window.getComputedStyle(ship).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(ship).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    interval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada alien foi atingido, se sim, troca o src da imagem
            if(checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px';
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
    area.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) {
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove();
            } else {
                gameOver();
            }
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 60);
}

function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20;
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if(laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

start.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    start.style.display = 'none';
    instructions.style.display = 'none';
    window.addEventListener('keydown', flyShip); 
    interval = setInterval(() => {
        createAliens();
    }, 3000);
}

function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(interval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => { 
        alert('game over!');
        ship.style.top = "250px";
        start.style.display = "block";
        instructions.style.display = "block";
    });
}
