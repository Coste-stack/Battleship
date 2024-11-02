import { Ship } from '../src/scripts/ship.js';
import { Gameboard } from '../src/scripts/gameboard.js';

describe('Gameboard Class', () => {

    let gameboard;

    /* TESTS TO CHECK FOR GAMEBOARD VALIDITY */

    test('Create gameboard', () => {
        gameboard = new Gameboard(12, 3);
        expect(gameboard.width).toBe(12);
        expect(gameboard.height).toBe(3);
        expect(Array.isArray(gameboard.board)).toBe(true);
    });

    test('Create empty gameboard', () => {
        expect(() => new Gameboard(0, 0)).toThrow(Error);
    });

    test('Create gameboard (width not a number)', () => {
        expect(() => new Gameboard('a', 1)).toThrow(Error);
    });

    test('Create gameboard (height not a number)', () => {
        expect(() => new Gameboard(2, [])).toThrow(Error);
    });


    /* TESTS TO CHECK FOR PLACEMENT */

    test('Set ship on {x:0, y:0} horizontally', () => {
        let width = 3, height = 3;
        let x = 0, y = 0;
        gameboard = new Gameboard(width, height);
        let cruiser = new Ship('Cruiser', 3);
        gameboard.placeShip(x, y, cruiser, 'x');

        for(let i=x; i < x; i++) {
            expect(gameboard.board[x][i]).toStrictEqual({ship: cruiser, isHit: false});
        }
    });

    test('Set ship on {x:0, y:0} vertically', () => {
        let width = 3, height = 3;
        let x = 0, y = 0;
        gameboard = new Gameboard(width, height);
        let cruiser = new Ship('Cruiser', 3);
        gameboard.placeShip(x, y, cruiser, 'y');

        for(let i=y; i < y; y++) {
            expect(gameboard.board[i][y]).toStrictEqual({ship: cruiser, isHit: false});
        }
    });

    test('Set ship on {x:2, y:2} horizontally (to fail)', () => {
        let width = 3, height = 3;
        let x = 2, y = 2;
        gameboard = new Gameboard(width, height);
        let cruiser = new Ship('Cruiser', 3);
        
        expect(() => gameboard.placeShip(x, y, cruiser)).toThrow(Error);
    });

    /* TESTS TO CHECK FOR SHOOTING */

    test('Shoot at {x:0, y:0}, no ship', () => {
        gameboard = new Gameboard(3, 3);
        gameboard.receiveAttack(0, 0);
        expect(gameboard.board[0][0]).toStrictEqual({ship: undefined, isHit: true});
    });

    test('Shoot at {x:1, y:0}, with ship', () => {
        gameboard = new Gameboard(3, 3);
        let cruiser = new Ship('Cruiser', 3);
        gameboard.placeShip(0, 0, cruiser, 'x');


        gameboard.receiveAttack(1, 0);
        expect(gameboard.board[0][1]).toStrictEqual({ship: cruiser, isHit: true});
    });

});
