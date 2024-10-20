import Ship from '../src/scripts/ship';
import Gameboard from '../src/scripts/gameboard';

describe('Gameboard Class', () => {

    let Carrier, Patrol;
    let gameboard;
    beforeEach(() => {
        Carrier = new Ship('Carrier', 5);
        Patrol = new Ship('Patrol', 1);
    });

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

    test('Set ship on {x:0, y:0} horizontally', () => {
        let width = 3, height = 3;
        let x = 0, y = 0;
        gameboard = new Gameboard(width, height);
        let cruiser = new Ship('Cruiser', 3);
        gameboard.placeShip(x, y, cruiser);

        for(let i=x; i < x; i++) {
            expect(gameboard.board[x][i]).toStrictEqual({ship: cruiser, isHit: false});
        }
    });

    test('Set ship on {x:0, y:0} vertically', () => {
        let width = 3, height = 3;
        let x = 0, y = 0;
        gameboard = new Gameboard(width, height);
        let cruiser = new Ship('Cruiser', 3);
        gameboard.placeShip(x, y, cruiser);

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

});
