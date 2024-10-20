export class Gameboard {
    #board;
    #width; #height;

    // create a board of width x height
    constructor(width, height) {

        if (typeof width !== 'number' || typeof height !== 'number') {
            throw new Error('Width or Height is not a number!');
        }
        if (width === 0 && height === 0) {
            throw new Error('Board is empty!');
        }

        this.#width = width;
        this.#height = height;
        
        // create the board, every tile has 'ship' object, and a bool 'isHit'
        this.#board = new Array(height);
        for(let i = 0; i < height; i++){
            this.#board[i] = new Array(width);
            for(let j = 0; j < width; j++) {
                this.#board[i][j] = {ship: undefined, isHit: false};
            }
        }
        
    };

    get width() { return this.#width; }
    get height() { return this.#height; }
    get board() { return this.#board; }

    placeShip(x, y, ship, orientation = 'x') {
        // check if ship fits the board (based on orientation)
        switch (orientation) {
            case 'x':
            if (x >= 0 && x+ship.length <= this.#width) {
                // change '#board' tiles on the horizontal
                for(let i = x; i < x+ship.length; i++) {
                    this.#board[y][i] = {ship: ship, isHit: false};
                }
            } else {
                throw new Error('Not enough room for ship to be placed! (horizontally)');
            }
            break;
        case 'y':
            if (y >= 0 && y+ship.length <= this.#height) {
                // change '#board' tiles on the vertical
                for(let i = x; i < x+ship.length; i++) {
                    this.#board[i][x] = {ship: ship, isHit: false};
                }
            } else {
                throw new Error('Not enough room for ship to be placed! (vertically)');
            }
            break;
        default:
            throw new Error('Invalid orientation!'); 
        }
    }

    receiveAttack(x, y) {
        // if already shot this tile
        if (this.#board[y][x]['isHit']) {
            // check if there's a ship or not
            if (this.#board[y][x]['ship'] === undefined) {
                throw new Error('Tile(blank) already shot');
            } else if (typeof this.#board[y][x]['ship'] === 'object') {
                throw new Error('Tile(ship) already shot');
            } else {
                throw new Error('Tile(unknown) already shot');
            }
        } 
        // if not shot, shoot!
        else {
            if (this.#board[y][x]['ship'] === undefined) {
                // not a ship, MISSED!
                this.#board[y][x]['isHit'] = true;
            } else if (typeof this.#board[y][x]['ship'] === 'object') {
                // a ship, HIT!
                this.#board[y][x]['isHit'] = true;
                this.#board[y][x]['ship'].hit();
            }
        }

    }

}