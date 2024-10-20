import { Gameboard } from "./gameboard"

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
}