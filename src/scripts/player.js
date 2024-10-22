import { Gameboard } from "./gameboard";

export class Player {
    #type;
    #gameboard;
    
    constructor(type) {
        if (type !== 'player' && type !== 'computer') {
            throw new Error('Type for Player is invalid! (put "player" or "computer")');
        }
        this.#type = type;
        this.#gameboard = new Gameboard(5, 5);
        this.initGameboard();
    }

    get type() { return this.#type; }
    get gameboard() { return this.#gameboard; }

    initGameboard() {
        // Create a gameboard container
        const grid = document.createElement('div');
        grid.classList.add('gameboard');
        grid.style.gridTemplateColumns = `repeat(${this.#gameboard.width}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${this.#gameboard.height}, 1fr)`;
    
        // Add empty tiles to every position of gameboard grid
        for (let y = 0; y < this.#gameboard.height; y++) {
            for (let x = 0; x < this.#gameboard.width; x++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
    
                // Set the tile position on gameboard grid (using area)
                tile.style.gridRowStart = x + 1;
                tile.style.gridColumnStart = y + 1;
                tile.style.gridRowEnd = x + 1;
                tile.style.gridColumnEnd = y + 1;
                grid.appendChild(tile);
    
                tile.addEventListener('click', () => {
                    // ADD LOGIC TO HITTING SHIPS (?)
                });
            }
        }
    
        // Iterate through the ships on the board
        for (const [shipName, shipData] of Object.entries(this.#gameboard.shipsOnBoard)) {
            const { startX, endX, startY, endY } = shipData;
    
            const ship = document.createElement('div');
            ship.classList.add('ship', shipName);
    
            // Set the ship position on gameboard grid (using area)
            ship.style.gridRowStart = startY;
            ship.style.gridColumnStart = startX;
            ship.style.gridRowEnd = endY;
            ship.style.gridColumnEnd = endX;
    
            grid.appendChild(ship);
        }
    
        document.querySelector('body').appendChild(grid);
    }

    randomlySetShips(ships) {
        // Start the backtracking process with the first ship
        if (!this.#randomlySetShipsBacktrack(ships, 0)) {
            throw new Error('Unable to place all ships!');
        }
    }

    #randomlySetShipsBacktrack(ships, index) {
        // end backtracking (all ships placed)
        if (index === ships.length) {
            return true;
        }

        const ship = ships[index];
        const validPositions = this.#getValidPositions(ship);

        // Shuffle the valid positions to introduce randomness
        this.#shuffleArray(validPositions);

        // Try each valid position
        for (const { x, y, orientation } of validPositions) {
            // Place the ship
            this.#gameboard.placeShip(x, y, ship, orientation);

            // Recursively place the next ship
            if (this.#randomlySetShipsBacktrack(ships, index + 1)) {
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