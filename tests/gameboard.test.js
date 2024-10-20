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

});
