import { Player } from './player.js';
import { Gameboard } from './gameboard.js';

export class Game {
    #player; #computer;
    #playerGB; #computerGB;
    
    constructor(ships) {
        // Initialize Gameboards
        const playerGB = new Gameboard(5, 5);
        const computerGB = new Gameboard(5, 5);

        // Initialize Players
        const player = new Player(playerGB, ships, 'Player');
        const computer = new Player(computerGB, ships, 'Computer');

        this.#player = player;
        this.#computer = computer;
        this.#playerGB = playerGB;
        this.#computerGB = computerGB;

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

        let attack;
        let attackEffect;
        tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                // player attack turn
                attack = this.#computer.gameboard.receiveAttack(tile.style.gridColumnStart-1, tile.style.gridRowStart-1);

                attackEffect = document.createElement('div');
                attackEffect.classList.add(attack);
                tile.appendChild(attackEffect);

                // computer attack turn
                const playerTiles = document.querySelector('.Player .gameboard').querySelectorAll('.tile');
                const x = Math.floor(Math.random() * this.#playerGB.width);
                const y = Math.floor(Math.random() * this.#playerGB.height);
                console.log(x, y, y+x*this.#playerGB.height);
                this.#player.gameboard.printBoard();
                attack = this.#player.gameboard.receiveAttack(x, y);

                attackEffect = document.createElement('div');
                attackEffect.classList.add(attack);
                playerTiles[y+x*this.#playerGB.height].appendChild(attackEffect);
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