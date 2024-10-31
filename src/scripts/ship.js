export class Ship {
    #name;
    #length;
    #hits;
    #orientation;
    
    constructor(name, length) {
        if (length < 1 || length > 5) {
            throw new Error('Invalid ship length!');
        }

        this.#name = name;
        this.#length = length;
        this.#hits = 0;
    }

    get name() { return this.#name; }
    get length() { return this.#length; }
    get hits() { return this.#hits; }
    get orientation() { return this.#orientation; }
    // when changing ship's position, allow to change it's orientation
    set orientation(newOrientation) { this.#orientation = newOrientation; }

    hit() {
        this.#hits++; 
    }

    isSunk() {
        if (this.#length === this.#hits) {
            return true;
        }
        return false;
    }
}