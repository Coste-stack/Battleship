import { Player } from './player.js';
import { Gameboard } from './gameboard.js';

export class Game {
    #player; #computer;
    #GBwidth; #GBheight;
    
    constructor(ships) {
        // Initialize Gameboards
        const GBwidth = 5;
        const GBheight = 5;
        const playerGB = new Gameboard(GBwidth, GBheight);
        const computerGB = new Gameboard(GBwidth, GBheight);

        // Initialize Players
        const player = new Player(playerGB, ships, 'Player');
        const computer = new Player(computerGB, ships, 'Computer');

        this.#player = player;
        this.#computer = computer;
        this.#GBwidth = GBwidth;
        this.#GBheight = GBheight;

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
        let computerAttacks = new Array();
        for (let x = 0; x < this.#GBwidth; x++) {
            for (let y = 0; y < this.#GBheight; y++) {
                computerAttacks.push({x: x, y: y});
            }
        }

        tiles.forEach(tile => {
            tile.addEventListener('click', () => {
                let playerTurn = true;
                // PLAYER ATTACK TURN
                try {
                    attack = this.#computer.gameboard.receiveAttack(tile.style.gridColumnStart-1, tile.style.gridRowStart-1);

                    attackEffect = document.createElement('div');
                    attackEffect.classList.add(attack);
                    tile.appendChild(attackEffect);
                    playerTurn = false;
                } catch (err) {
                    console.error(err);
                }
                
                // COMPUTER ATTACK TURN
                if (!playerTurn) {
                    const playerTiles = document.querySelector('.Player .gameboard').querySelectorAll('.tile');

                    const index = Math.floor(Math.random() * computerAttacks.length);
                    const {x, y} = computerAttacks.splice(index, 1)[0]; // get element and remove it

                    try {
                        attack = this.#player.gameboard.receiveAttack(x, y);

                        attackEffect = document.createElement('div');
                        attackEffect.classList.add(attack);
                        playerTiles[y+x*this.#GBheight].appendChild(attackEffect);
                        playerTurn = true;
                    } catch (err) {
                        console.error(err);
                    }
                }
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