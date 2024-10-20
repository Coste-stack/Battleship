import { Gameboard } from "./gameboard"
import { Ship } from "./ship"

export class Player {
    #type;
    #gameboard;
    
    constructor(type) {
        if (type !== 'player' && type !== 'computer') {
            throw new Error('Type for Player is invalid! (put "player" or "computer")');
        }
        this.#type = type;
        this.#gameboard = new Gameboard(5, 5);
    }

    get type() { return this.#type; }
    get gameboard() { return this.#gameboard; }

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

    #removeShip(x, y, ship, orientation) {
        switch (orientation) {
            case 'x':
                for(let i = x; i < x+ship.length; i++) {
                    this.#gameboard.board[y][i] = { ship: undefined, isHit: false };
                }
                break;
            case 'y':
                for(let i = y; i < y+ship.length; i++) {
                    this.#gameboard.board[i][x] = { ship: undefined, isHit: false };
                }
                break;
            default:
                throw new Error('invalid passed "orientation"! (When removing a ship)');
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
            this.#removeShip(x, y, ship, orientation);
        }

        return false;
    }

    randomlySetShips(ships) {
        // Start the backtracking process with the first ship
        if (!this.#randomlySetShipsBacktrack(ships, 0)) {
            throw new Error('Unable to place all ships!');
        }
    }
}