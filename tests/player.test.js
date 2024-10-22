import { Ship } from '../src/scripts/ship.js';
import { Player } from '../src/scripts/player.js';

describe('Player Class', () => {

    test('Create Player class object', () => {
        expect(() => new Player('player')).not.toThrow(Error);
        expect(() => new Player('computer')).not.toThrow(Error);
        expect(() => new Player([])).toThrow(Error);
    });

    test('Randomly place ships', () => {
        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 3, 'Destroyer': 2, 'Patrol': 1};
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            ships.push(shipObj);
        });

        const player = new Player('player');
        expect(() => player.randomlySetShips(ships)).not.toThrow(Error);
    });

});
