import { Player } from './player.js';
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
        const tiles = document.querySelector('.Computer #gameboard').querySelectorAll('[id=tile]');

        let attack;
        let attackEffect;
        this.#lastComputerHitStack = [];
        this.#computerAttacks = [];
        for (let x = 0; x < this.#GBwidth; x++) {
            for (let y = 0; y < this.#GBheight; y++) {
                this.#computerAttacks.push({x: x, y: y});
            }
        }

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
                    this.#computerAttack();
                }
            });
        });
    }

    #computerAttack() {
        const {x, y} = this.#chooseComputerAttack();

        // if attack array is empty and can't assign x, y
        if (x === undefined || y === undefined) {
            throw new Error('No possible computer attacks found');
        }

        // attack
        try {
            const attack = this.#player.gameboard.receiveAttack(x, y);

            const attackEffect = document.createElement('div');
            attackEffect.classList.add(attack);
            const playerTiles = document.querySelector('.Player #gameboard').querySelectorAll('[id=tile]');
            playerTiles[x+y*this.#GBwidth].appendChild(attackEffect);

            if (attack === 'hit') {
                // change last successful hit
                this.#lastComputerHitStack.push({x, y});
            }

            this.#playerTurn = true;
        } catch (err) {
            console.error(err);
        }
    }

    #chooseComputerAttack() {
        if (this.#lastComputerHitStack.length === 0) {
            return this.#chooseComputerAttackRandom();
        } else {
            // hit around last attack
            const {x: lastX, y: lastY} = this.#lastComputerHitStack[0];
            const currComputerAttacks = [];

            const newAttacks = [
                {x: lastX+1, y: lastY},
                {x: lastX-1, y: lastY},
                {x: lastX  , y: lastY+1},
                {x: lastX  , y: lastY-1}
            ];
            // generate all possible moves around last hit 
            newAttacks.forEach(newAttack => {
                // exclude duplicates
                if (this.#computerAttacks.findIndex(attack => attack.x === newAttack.x && attack.y === newAttack.y) !== -1) {
                    currComputerAttacks.push(newAttack);
                }
            });

            if (currComputerAttacks.length > 0) {
                // choose one random attack
                let index = Math.floor(Math.random() * currComputerAttacks.length);
                const {x, y} = currComputerAttacks[index];
                // remove taken attack from the pull of 'computerAttacks'
                this.#computerAttacks = this.#computerAttacks.filter(attack => !(attack.x === x && attack.y === y));
                return {x, y};
            } else {
                // no moves around found
                this.#lastComputerHitStack.shift();  // Remove last hit if no valid attacks around
                // restart chooseComputerAttack
                return this.#chooseComputerAttack();
            }
        }
    }

    #chooseComputerAttackRandom() {
        const index = Math.floor(Math.random() * this.#computerAttacks.length);
        return this.#computerAttacks.splice(index, 1)[0]; // get element and remove it
    }


    #createPlayButton() {
        const blinder = document.querySelector('.Computer .blinder');
        if (blinder && document.querySelector('#play-button') === null) {
            const playButton = document.createElement('button');
            playButton.textContent = 'Play';
            playButton.setAttribute('id', 'play-button');
            const container = document.querySelector('.Computer #gameboard-wrapper')
            container.appendChild(playButton);

            playButton.addEventListener('click', () => {
                // hide 'randomize ships' button (hide and not remove - to keep space)
                const randomizeButton = document.querySelector('#randomize-button');
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