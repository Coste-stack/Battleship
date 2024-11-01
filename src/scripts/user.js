// Abstract class User
// Subclasses: Player, Computer
export class User {
    #gameboard;
    #ships;
    static #playerTurn;
    #ripple;

    constructor(gameboard, ships) {
        if(this.constructor == User) {
            throw new Error("Class is of abstract type and can't be instantiated");
         };
        this.#gameboard = gameboard;
        this.#ships = ships;

        // generate ripple effect to apply to sunken ships
        this.#ripple = this.#getRippleSpan();
    }

    get gameboard() { return this.#gameboard; }

    static getPlayerTurn() {
        return User.#playerTurn;
    }

    static setPlayerTurn(turn) {
        User.#playerTurn = turn;
    }

    initGameboard() {
        const GB = document.querySelector(`.${this.constructor.name} #gameboard`);

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

    attack() {
        throw new Error("Attack method needs to be defined");
    }
    
    #getRippleSpan() {
        // Create the ripple element inside the container
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Create simulated ship
        const ship = document.createElement('div');
        ship.setAttribute('id', 'ship');
        ship.style.width = ship.style.height = '1px';
        
        // Get ship grayscale background color
        document.body.appendChild(ship);
        const rgbMatch = window.getComputedStyle(ship).backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        ship.remove();

        if (rgbMatch) {
            // Parse the RGB values
            const r = parseInt(rgbMatch[1], 10);
            const g = parseInt(rgbMatch[2], 10);
            const b = parseInt(rgbMatch[3], 10);

            // Calculate grayscale by averaging RGB values
            const gray = Math.round((r + g + b) / 3);
            // Create a grayscale color string with adjusted opacity for the ripple
            const grayscaleColor = `rgba(${gray}, ${gray}, ${gray}, 1)`;
            ripple.style.backgroundColor = grayscaleColor;
        }

        return ripple;
    }

    addRippleEffect(ship) {
        const ripple = this.#ripple.cloneNode(false);
        ship.appendChild(ripple);

        // Set the size of the ripple to cover the rippleEffect container
        const maxDimension = Math.max(ship.offsetWidth, ship.offsetHeight);
        ripple.style.width = ripple.style.height = maxDimension + 'px';

        // Center the ripple in the container
        ripple.style.left = `${(ship.offsetWidth - maxDimension) / 2}px`;
        ripple.style.top = `${(ship.offsetHeight - maxDimension) / 2}px`;
        
        // Trigger the ripple animation
        setTimeout(() => ripple.classList.add('animate'), 0);
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