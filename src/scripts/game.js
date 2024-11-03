import { Player } from './player.js';
import { Ship } from './ship.js';
import { Computer } from './computer.js';
import { Gameboard } from './gameboard.js';

export class Game {
    #player; #computer;
    
    createShips(shipsInitial) {
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            ships.push(shipObj);
        });
        return ships
    }

    constructor(shipsInitial) {
        // Initialize Gameboards
        const GBwidth = 5;
        const GBheight = 5;
        const playerGB = new Gameboard(GBwidth, GBheight);
        const computerGB = new Gameboard(GBwidth, GBheight);

        // Initialize Players
        const player = new Player(playerGB, this.createShips(shipsInitial));
        const computer = new Computer(computerGB, this.createShips(shipsInitial));

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
                this.#computer.createPlayButton();
            }
        });

        // Start the game attack turns - when 'gamePrepared' is up
        document.addEventListener('gamePrepared', () => this.startGame());
    }

    startGame() {
        // add EventListeners to all '.tiles' to get player attacks
        const tiles = document.querySelector('.Computer #gameboard').querySelectorAll('[id=tile]');

        // set starting turn to player
        Player.setPlayerTurn(true);

        tiles.forEach((tile, tileIndex) => {
            tile.addEventListener('click', () => {

                // PLAYER ATTACK TURN
                try {
                    if (!Player.getPlayerTurn()) {
                        throw new Error('Not Player\'s turn');
                    }
                    this.#player.attack(this.#computer, tileIndex);

                    // Check for end game after player's attack
                    if (this.#computer.isDefeated()) {
                        this.endGame({ detail: { type: 'Player' } });
                        return;  // Exit to prevent computer's attack
                    }
                } catch (err) {
                    console.error(err);
                }

                // COMPUTER ATTACK TURN
                try {
                    if (!Player.getPlayerTurn()) {
                        this.#computer.attack(this.#player);

                        // Check for end game after computer's attackh
                        if (this.#player.isDefeated()) {
                            this.endGame({ detail: { type: 'Computer' } });
                            return;
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        });
    }

    endGame(event) {
        const blinder = document.createElement('div');
        blinder.classList.add('body-blinder');

        const blinderContent = document.createElement('div');
        blinderContent.classList.add('blinder-content');

        const text = document.createElement('p');
        text.classList.add('pop-in');
        text.style.display = 'block';

        switch(event.detail.type) {
            case 'Player':
                text.textContent = 'You Win';
                text.classList.add('game-win');
                break;
            case 'Computer':
                text.textContent = 'You Lose';
                text.classList.add('game-lose');
                break;
        }

        blinderContent.appendChild(text);
        blinder.appendChild(blinderContent);
        document.body.appendChild(blinder);
    }
}