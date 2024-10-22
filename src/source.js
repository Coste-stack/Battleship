import './reset.css';
import './style.css';

import { Ship } from './scripts/ship.js';
import { Player } from './scripts/player.js';

(function main() {

    try {
        
        // initialize Ship objects
        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 3, 'Destroyer': 2};
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            console.log(`${ship}: ${length}`);
            ships.push(shipObj);
        });

        // initialize Gameboard via Player
        const player1 = new Player('player');
        const player2 = new Player('computer');

        player1.randomlySetShips(ships);

    } catch (e) {
        console.error(e);
    }

})();
