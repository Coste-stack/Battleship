import './reset.css';
import './style.css';

import { Ship } from './scripts/ship.js';

(function main() {

    try {
        
        const shipsInitial = {'Carrier': 5, 'Battleship': 4, 'Cruiser': 3, 'Submarine': 3, 'Destroyer': 2, 'Patrol': 1};
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            console.log(`${ship}: ${length}`);
            ships.push(shipObj);
        });

    } catch (error) {
        console.error(erorr.message);
    }

})();
