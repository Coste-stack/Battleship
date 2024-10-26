import './reset.css';
import './style.css';

import { Ship } from './scripts/ship.js';
import { Gameboard } from './scripts/gameboard.js';
import { Game } from './scripts/game.js';

(function main() {

    try {
        
        // initialize Ship objects
        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 3, 'Destroyer': 2};
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            ships.push(shipObj);
        });

        const gameboard = new Gameboard(7, 7);
        const game = new Game(gameboard, ships);

    } catch (e) {
        console.error(e);
    }

})();
