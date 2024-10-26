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
        
        // Add blinder and play button
        computer.addPlayMenu();
        document.addEventListener('playReady', (event) => {
            // if player's ships were randomized
            if (event.detail.type === 'Player') { 
                this.#createPlayButton();
            }
        });
    }

    startGame() {
        // add EventListeners to all '.tiles' to get player attacks
        const tiles = document.querySelector('.Computer .gameboard').querySelectorAll('.tile');

        tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                console.log(111);
                // TO FIX, CAN'T CLICK !!!

                // player attack turn
                this.#player.receiveAttack(tile.style.gridRowStart-1, tile.style.gridColumnStart-1);
                this.#player.printBoard();
                // computer attack turn
                playerTurn = false;
            });
        });
    }

    #createPlayButton() {
        const blinder = document.querySelector('.Computer .blinder');
        if (blinder && document.querySelector('.play-button') === null) {
            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.classList.add('play-button');
            const container = document.querySelector('.Computer .gameboard-wrapper')
            container.appendChild(playButton);

            playButton.addEventListener('click', () => {
                // hide 'randomize ships' button (hide and not remove - to keep space)
                const randomizeButton = document.querySelector('.randomize-button');
                if (randomizeButton) randomizeButton.style.visibility = 'hidden';
                // remove 'play' button
                playButton.remove();
                // remove blinder class from wrapper
                blinder.classList.remove('blinder');
                // RANDOMIZE COMPUTERS's SHIPS
                this.#computer.randomlySetShips();
                // START GAME TURNS
                this.startGame();
            });
        }
    }
}