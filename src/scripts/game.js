import { Player } from './player.js';
import { Computer } from './computer.js';
import { Gameboard } from './gameboard.js';

export class Game {
    #player; #computer;
    #GBwidth; #GBheight;
    #playerTurn;
    #computerAttacks; #lastComputerHitStack;
    
    constructor(ships) {
        // Initialize Gameboards
        const GBwidth = 7;
        const GBheight = 7;
        const playerGB = new Gameboard(GBwidth, GBheight);
        const computerGB = new Gameboard(GBwidth, GBheight);

        // Initialize Players
        const player = new Player(playerGB, ships);
        const computer = new Computer(computerGB, ships);

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
                this.#computer.createPlayButton();
            }
        });


        document.addEventListener('gamePrepared', () => this.startGame());
    }

    startGame() {
        // add EventListeners to all '.tiles' to get player attacks
        const tiles = document.querySelector('.Computer #gameboard').querySelectorAll('[id=tile]');

        let attack;
        let attackEffect;

        tiles.forEach((tile, index) => {
            tile.addEventListener('click', () => {
                this.#playerTurn = true;
                // PLAYER ATTACK TURN
                try {
                    let x = index % this.#GBwidth;
                    let y = Math.floor(index / this.#GBheight);
                    attack = this.#computer.gameboard.receiveAttack(x, y);

                    attackEffect = document.createElement('div');
                    attackEffect.classList.add(attack);
                    tile.appendChild(attackEffect);
                    this.#playerTurn = false;
                } catch (err) {
                    console.error(err);
                }
                
                // COMPUTER ATTACK TURN
                if (!this.#playerTurn) {
                    this.#computer.computerAttack(this.#player);
                }
            });
        });
    }
}