import { User } from "./user";

export class Computer extends User {
    #gameboard;
    #ships;
    #lastComputerHitStack;
    #computerAttacks;

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
        if (computerGB && !computerGB.classList.contains('blinder')) {
            computerGB.classList.add('blinder');
        }

        // dispatchEvent to create a PLAY BUTTON when there are ships placed 
        document.addEventListener('shipsRandomized', (event) => {
            // (pass 'type' from which the ships were randomized)
            document.dispatchEvent(new CustomEvent('playReady', { detail: { type: event.detail.type } }));
        });
    }

    computerAttack(playerObj) {
        const {x, y} = this.#chooseComputerAttack();

        // if attack array is empty and can't assign x, y
        if (x === undefined || y === undefined) {
            throw new Error('No possible computer attacks found');
        }

        // attack
        try {
            const attack = playerObj.gameboard.receiveAttack(x, y);

            const attackEffect = document.createElement('div');
            attackEffect.classList.add(attack);
            const playerTiles = document.querySelector('.Player #gameboard').querySelectorAll('[id=tile]');
            playerTiles[x+y*this.#gameboard.width].appendChild(attackEffect);

            if (attack === 'hit') {
                // change last successful hit
                this.#lastComputerHitStack.push({x, y});
            }
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


    createPlayButton() {
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
                this.randomlySetShips();
                // START GAME TURNS
                document.dispatchEvent(new CustomEvent('gamePrepared'));
            });
        }
    }
}