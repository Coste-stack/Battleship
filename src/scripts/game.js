import { User } from './user.js';
import { Player } from './player.js';
import { Computer } from './computer.js';
import { Gameboard } from './gameboard.js';

export class Game {
    #player; #computer;
    #GBwidth; #GBheight;
    
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

        // Start the game attack turns - when 'gamePrepared' is up
        document.addEventListener('gamePrepared', () => this.startGame());
    }

    startGame() {
        // add EventListeners to all '.tiles' to get player attacks
        const tiles = document.querySelector('.Computer #gameboard').querySelectorAll('[id=tile]');

        let attack;
        let attackEffect;
        // set starting turn to player
        Player.setPlayerTurn(true);

        tiles.forEach((tile, index) => {
            tile.addEventListener('click', () => {

                // PLAYER ATTACK TURN
                try {
                    if (!Player.getPlayerTurn()) {
                        throw new Error('Not Player\'s turn');
                    }
                    let x = index % this.#GBwidth;
                    let y = Math.floor(index / this.#GBheight);
                    attack = this.#computer.gameboard.receiveAttack(x, y);

                    attackEffect = document.createElement('div');
                    attackEffect.classList.add(attack);
                    tile.appendChild(attackEffect);

                    // change turn
                    Player.setPlayerTurn(false);
                    //this.#computer.setPlayerTurn(true);
                } catch (err) {
                    console.error(err);
                }

                // COMPUTER ATTACK TURN
                try {
                    if (!Player.getPlayerTurn()) {
                        this.#computer.computerAttack(this.#player);
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        });
    }
}