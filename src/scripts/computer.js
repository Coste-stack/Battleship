import { User } from "./user.js";

export class Computer extends User {
    #gameboard;
    #ships;
    #lastComputerHitStack;
    #computerAttacks;
    #sunkenOpponentShips = 0;

    constructor(gameboard, ships) {
        super(gameboard, ships);
        this.#gameboard = gameboard;
        this.#ships = ships;

        this.#lastComputerHitStack = [];
        this.#computerAttacks = [];
        for (let x = 0; x < this.#gameboard.width; x++) {
            for (let y = 0; y < this.#gameboard.height; y++) {
                this.#computerAttacks.push({x: x, y: y});
            }
        }
    }

    addPlayMenu() {
        // add a BLINDER (if there's none)
        const computerGB = document.querySelector('.Computer #gameboard')
        if (computerGB && !computerGB.classList.contains('gameboard-blinder')) {
            computerGB.classList.add('gameboard-blinder');
        }

        // dispatchEvent to create a PLAY BUTTON when there are ships placed 
        document.addEventListener('shipsRandomized', (event) => {
            // (pass 'type' from which the ships were randomized)
            document.dispatchEvent(new CustomEvent('playReady', { detail: { type: event.detail.type } }));
        });
    }

    attack(playerObj) {
        const {x, y} = this.#chooseComputerAttack();

        // if attack array is empty and can't assign x, y
        if (x === undefined || y === undefined) {
            throw new Error('No possible computer attacks found');
        }

        // attack
        const attack = playerObj.gameboard.receiveAttack(x, y);

        const attackEffect = document.createElement('div');
        attackEffect.classList.add(attack);
        const playerTiles = document.querySelector('.Player #gameboard').querySelectorAll('[id=tile]');
        playerTiles[x+y*this.#gameboard.width].appendChild(attackEffect);

        
        if (attack === 'hit') {
            // change last successful hit
            this.#lastComputerHitStack.push({x, y});

            // check if ship sunk
            if (playerObj.gameboard.board[y][x].ship.isSunk()) {
                this.#sunkenOpponentShips++;

                // display it
                console.log('sunk', playerObj.gameboard.board[y][x].ship.name);
                
                const ship = document.querySelector(`.Player #gameboard [id=ship][name=${playerObj.gameboard.board[y][x].ship.name}`);
                this.addRippleEffect(ship);

                // check if computer sank all player ships - end the game
                if (this.#sunkenOpponentShips === this.#ships.length) {
                    document.dispatchEvent(new CustomEvent('gameEnded', { detail: { type: this.constructor.name } }));
                }
            }
        }
        Computer.setPlayerTurn(true);
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


    createPlayButton() {
        const blinder = document.querySelector('.Computer .gameboard-blinder');
        const playButton = document.getElementById('play-button');
        
        if (blinder && playButton) {
            playButton.style.visibility = 'visible';
            playButton.classList.add('pop-in');

            playButton.addEventListener('click', () => {
                // remove blinder class from wrapper
                blinder.classList.remove('gameboard-blinder');
                // RANDOMIZE COMPUTERS's SHIPS
                this.randomlySetShips();
                // START GAME TURNS
                document.dispatchEvent(new CustomEvent('gamePrepared'));
                setTimeout(() => {
                    // hide 'randomize ships' button (hide and not remove - to keep space)
                    const randomizeButton = document.querySelector('#randomize-button');
                    if (randomizeButton) randomizeButton.classList.add('fade-out');
                    // make 'play' button hidden
                    playButton.classList.remove('pop-in');
                    playButton.classList.add('fade-out');
                }, 100);
            });
        }
    }
}