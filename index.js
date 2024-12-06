const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = './MapSources/PelletTown.png';

const playerImage = new Image();
playerImage.src = './PokemonGameSources/Images/playerDown.png';

image.onload = () => {
    c.drawImage(image, -425, -375);
    c.drawImage(
        playerImage,
        canvas.width/2 - playerImage.width/2,
        canvas.height/2 - playerImage.height/2
    );
};