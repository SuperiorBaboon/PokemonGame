const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = 'MapSources/map.png';

image.onload = () => {
    c.drawImage(image, -1675, -1400)
};

const playerImage = new Image();
playerImage.src = 'C:\Users\conno\OneDrive\Games\Pokemon Review Game\CharMove\ACharDown.png';