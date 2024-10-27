import { ShipDragHandler } from "./shipDragHandler";

export class Player {
    #type;
    #gameboard;
    #ships;
    
    constructor(gameboard, ships, type) {
        if (type !== 'Player' && type !== 'Computer') {
            throw new Error('Type for Player is invalid! (put "player" or "computer")');
        }
        this.#type = type;
        this.#ships = ships;
        this.#gameboard = gameboard;
    }

    get type() { return this.#type; }
    get gameboard() { return this.#gameboard; }

    initGameboard() {
        const GB = document.querySelector(`.${this.#type} #gameboard`);

        // change gameboard grid to specified width and height
        GB.style.gridTemplateColumns = `repeat(${this.#gameboard.width}, 1fr)`;
        GB.style.gridTemplateRows = `repeat(${this.#gameboard.height}, 1fr)`;

        // add tiles to gameboard grid
        for (let y = 0; y < this.#gameboard.height; y++) {
            for (let x = 0; x < this.#gameboard.width; x++) {
                const tile = document.createElement('div');
                tile.setAttribute('id', 'tile');
                GB.appendChild(tile);
            }
        }
    }


    addRandomizeShipsButton() {
        const GB = document.querySelector(`.${this.#type} #gameboard`);
        // create RANDOMIZE SHIPS BUTTON
        const RandomizeShips = document.createElement('button');
        RandomizeShips.textContent = 'Randomize Ships';
        RandomizeShips.setAttribute('id', 'randomize-button');

        RandomizeShips.addEventListener('click', () => {
            this.randomlySetShips();

            // REMOVE ALL SHIPS from previous board
            let shipsToDelete = GB.querySelectorAll('[id=ship]');
            shipsToDelete.forEach(ship => {
                GB.removeChild(ship);
            });

            // allow dragging for gameboard
            const dragObj = new ShipDragHandler(this.#gameboard);

            // ADD SHIPS to the gameboard
            for (const [shipName, shipData] of Object.entries(this.#gameboard.shipsOnBoard)) {
                const { startX, endX, startY, endY } = shipData;
        
                const ship = document.createElement('div');
                ship.setAttribute('id', 'ship');
                ship.setAttribute('name', shipName);
                ship.setAttribute('orientation', shipData.orientation);
                ship.setAttribute('length', shipData.length);
        
                // Set the ship position on gameboard grid (using area)
                ship.style.gridRowStart = startY;
                ship.style.gridColumnStart = startX;
                ship.style.gridRowEnd = endY;
                ship.style.gridColumnEnd = endX;
        
                GB.appendChild(ship);

                // allow dragging for each ship
                dragObj.allowShipDragging(ship);
            }

            // Dispatch custom event after ships are randomized
            document.dispatchEvent(new CustomEvent('shipsRandomized', { detail: { type: this.#type } }));
        });
        document.querySelector(`.${this.#type}#player-container`).appendChild(RandomizeShips);
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


    randomlySetShips() {
        this.#gameboard.resetBoard();
        // Start the backtracking process with the first ship
        let shipsData = this.#ships;
        if (!this.#randomlySetShipsBacktrack(shipsData, 0)) {
            throw new Error('Unable to place all ships!');
        }
        this.#gameboard.printBoard();
    }

    #randomlySetShipsBacktrack(shipsData, index) {
        // end backtracking (all ships placed)
        if (index === shipsData.length) {
            return true;
        }

        const ship = shipsData[index];
        const validPositions = this.#getValidPositions(ship);

        // Shuffle the valid positions to introduce randomness
        this.#shuffleArray(validPositions);

        // Try each valid position
        for (const { x, y, orientation } of validPositions) {
            try {
                // try to place the ship
                this.#gameboard.placeShip(x, y, ship, orientation);
            } catch (e) {
                // if it can't be done then go to next iteration
                continue;
            }

            // Recursively place the next ship
            if (this.#randomlySetShipsBacktrack(shipsData, index + 1)) {
                return true;
            }

            // If placing the next ship fails, remove the current ship (backtrack)
            this.#gameboard.removeShip(x, y, ship, orientation);
        }

        return false;
    }

    #getValidPositions(ship) {
        const width = this.#gameboard.width;
        const height = this.#gameboard.height;
        const validPositions = [];
        
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                if (x+ship.length <= width && this.#gameboard.canPlaceShip(x, y, ship, 'x')) {
                    validPositions.push({x, y, orientation: 'x'});
                }
                if (y+ship.length <= height && this.#gameboard.canPlaceShip(x, y, ship, 'y')) {
                    validPositions.push({x, y, orientation: 'y'});
                }
            }
        }
        return validPositions;
    }

    #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}