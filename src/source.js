import './reset.css';
import './style.css';

import { Game } from './scripts/game.js';

(function main() {

    try {

        // initialize Ship objects
        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 1, 'Destroyer': 2};

        new Game(shipsInitial);

    } catch (e) {
        console.error(e);
    }

})();
