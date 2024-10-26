import { Player } from './player.js';

export class Game {
    #player; #computer;
    
    constructor(gameboard, ships) {
        // Initialize Players
        const player = new Player(gameboard, ships, 'Player');
        const computer = new Player(gameboard, ships, 'Computer');
        this.#player = player;
        this.#computer = computer;

        // Use methods to initialize the game 
        player.initGameboard();
        computer.initGameboard();
        
        player.addRandomizeShipsButton();
        computer.addRandomizeShipsButton();

        // Add blinder and play button
        computer.addPlayMenu();
        document.addEventListener('playReady', (event) => {
            // if player's ships were randomized
            if (event.detail.type === 'Player') { 
                this.#createPlayButton();
            }
        });
    }

    #createPlayButton() {
        const container = document.querySelector('.Computer.blinder');

        if (container && document.querySelector('.play-button') === null) {
            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.classList.add('play-button');
            container.appendChild(playButton);

            playButton.addEventListener('click', () => {
                // hide 'randomize ships' button (hide and not remove - to keep space)
                const randomizeButton = document.querySelector('.randomize-button');
                if (randomizeButton) randomizeButton.style.visibility = 'hidden';
                // remove 'play' button
                playButton.remove();
                // remove blinder class from wrapper
                container.classList.remove('blinder');
                // RANDOMIZE COMPUTERS's SHIPS
                this.#computer.randomlySetShips();
                // START GAME TURNS
                //this.startGame();
            });
        }
    }
}