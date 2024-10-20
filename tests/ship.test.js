import Ship from '../scripts/ship';

describe('Ship Class', () => {

    let Carrier, Patrol;
    beforeEach(() => {
        Carrier = new Ship('Carrier', 5);
        Patrol = new Ship('Patrol', 1);
    });

    test('Create ship with name and length', () => {
        expect(Carrier.name).toBe('Carrier');
        expect(Carrier.length).toBe(5);
        expect(Carrier.hits).toBe(0);
        expect(Carrier.orientation).toBe(undefined);
    });

    test('Create ship with invalid length', () => {
        expect(() => new Ship('Void', 0)).toThrow(Error);
    });

    test('Hit ship', () => {
        Carrier.hit();
        expect(Carrier.isSunk()).toBeFalsy();
    });

    test('Hit ship and sunk it', () => {
        Patrol.hit();
        expect(Patrol.isSunk()).toBeTruthy();
    });

});
