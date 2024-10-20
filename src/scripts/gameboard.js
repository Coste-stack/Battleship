export default class Gameboard {
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
        this.#board = new Array(width);
        for(let i = 0; i < width; i++){
            this.#board[i] = new Array(height);
            for(let j = 0; j < height; j++) {
                this.#board[i][j] = {ship: undefined, isHit: false};
            }
        }
        
    };

    get width() { return this.#width; }
    get height() { return this.#height; }
    get board() { return this.#board; }

    // change '#board' indexes to 'ship' based on given index 'pos' ('x' or 'y')
    #placeShipToArray(pos, ship) {
        for(let i = pos; i < pos+ship.length; i++) {
            this.#board[i] = ship;
        }
    }

    placeShip(x, y, ship, orientation = 'x') {
        // check if ship fits the board (based on orientation)
        switch (orientation) {
            case 'x':
            if (x >= 0 && x+ship.length <= this.#width) {
                this.#placeShipToArray(x, ship);
            }
            break;
        case 'y':
            if (y >= 0 && y+ship.length <= this.#height) {
                this.#placeShipToArray(y, ship);
            }
            break;
        default:
            throw new Error('Invalid orientation!'); 
        }
    }

    receiveAttack(x, y) {

    }

}