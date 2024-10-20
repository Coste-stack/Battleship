import Gameboard from "./gameboard"

export default class Player {
    #type;
    #gameboard;
    
    constructor(type) {
        if (type !== 'player' && type !== 'computer') {
            throw new Error('Type for Player is invalid! (put "player" or "computer")');
        }
        this.#type = type;
        this.#gameboard = new Gameboard(10, 10);
    }

    get type() { return this.#type; }
    get gameboard() { return this.#gameboard; }
}