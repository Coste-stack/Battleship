import './reset.css';
import './style.css';

import { Ship } from './scripts/ship.js';
import { Gameboard } from './scripts/gameboard.js';
import { Player } from './scripts/player.js';

(function main() {

    try {
        
        // initialize Ship objects
        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 3, 'Destroyer': 2};
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            ships.push(shipObj);
        });

        const GB1 = new Gameboard(7, 7);
        const GB2 = new Gameboard(7, 7);

        // initialize Gameboard via Player
        const P1 = new Player(GB1, ships, 'Player');
        const P2 = new Player(GB2, ships, 'Computer');
        P1.initGameboard();
        P2.initGameboard();
        
        
        P1.randomlySetShips();
        P2.randomlySetShips();
        //P2.addPlayMenu();

        P1.gameboard.printBoard();
        P2.gameboard.printBoard();


    } catch (e) {
        console.error(e);
    }

})();
