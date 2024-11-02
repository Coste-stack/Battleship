import { Ship } from '../src/scripts/ship.js';
import { Gameboard } from '../src/scripts/gameboard.js';
import { Player } from '../src/scripts/player.js';
import { Computer } from '../src/scripts/computer.js';
import { User } from '../src/scripts/user.js';

describe('User subclasses', () => {

    let ships;
    let gb;
    beforeAll(() => {
        gb = new Gameboard(7, 7);

        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 3, 'Destroyer': 2, 'Patrol': 1};
        ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new Ship(ship, length); 
            ships.push(shipObj);
        });
    });

    test('Create User', () => {
        expect(() => new User(gb, ships)).toThrow(Error);
    });

});
