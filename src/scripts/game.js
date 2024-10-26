import { Player } from './player.js';

export class Game {
    #player; #computer;
    #gameboard;
    #ships;
    
    constructor(gameboard, ships) {
        // Initialize Players
        const player = new Player(gameboard, ships, 'Player');
        const computer = new Player(gameboard, ships, 'Computer');
        this.#player = player;
        this.#computer = computer;
        this.#gameboard = gameboard;
        this.#ships = ships;

        // Use methods to initialize the game 
        player.initGameboard();
        computer.initGameboard();
        
        player.addRandomizeShipsButton();
        computer.addRandomizeShipsButton();
        //computer.addPlayMenu();
        //P1.randomlySetShips();
        //P2.randomlySetShips();
        //P2.addPlayMenu();
    }

    #createPlayButton() {
        const container = document.querySelector('.Computer.blinder');

        if (container && document.querySelector('.play-button') === null) {
            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.classList.add('play-button');
            container.appendChild(playButton);

            playButton.addEventListener('click', () => {
                // hide 'randomize ships' button to keep space
                const randomizeButton = document.querySelector('.randomize-button');
                if (randomizeButton) randomizeButton.style.visibility = 'hidden';
                // remove 'play' button
                playButton.remove();
                // remove blinder class from wrapper
                container.classList.remove('blinder');
                // RANDOMIZE COMPUTERS's SHIPS
                this.randomlySetShips();
                // START GAME TURNS
                //this.startGame();
            });
        }
    }

    addPlayMenu() {
        // add a BLINDER (if there's none)
        if (!document.querySelector('.gameboard-wrapper.Computer').classList.contains('blinder')) {
            document.querySelector('.gameboard-wrapper.Computer').classList.add('blinder');
        }
        // create a PLAY BUTTON  if there are ships  placed (and if it doesn't exist)
        if(document.querySelector('.ship') !== null) {
            this.#createPlayButton();
        }
    }
}