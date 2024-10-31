import { ShipDragHandler } from "./shipDragHandler";
import { User } from "./user.js";

export class Player extends User {
    #gameboard;
    #ships;
    
    constructor(gameboard, ships) {
        super(gameboard, ships);
        this.#gameboard = gameboard;
        this.#ships = ships;
    }

    addRandomizeShipsButton() {
        const GB = document.querySelector(`.Player #gameboard`);
        // create RANDOMIZE SHIPS BUTTON
        const RandomizeShips = document.createElement('button');
        RandomizeShips.textContent = 'Randomize Ships';
        RandomizeShips.setAttribute('id', 'randomize-button');

        // allow drag/drop for gameboard
        const dragObj = new ShipDragHandler(this.#gameboard);

        RandomizeShips.addEventListener('click', () => {
            this.randomlySetShips();

            // REMOVE ALL SHIPS from previous board
            let shipsToDelete = GB.querySelectorAll('[id=ship]');
            shipsToDelete.forEach(ship => {
                GB.removeChild(ship);
            });

            // ADD SHIPS to the gameboard
            for (const [shipName, shipData] of Object.entries(this.#gameboard.shipsOnBoard)) {
                const { startX, endX, startY, endY } = shipData;
        
                const ship = document.createElement('div');
                ship.setAttribute('id', 'ship');
                ship.setAttribute('name', shipName);
        
                // Set the ship position on gameboard grid (using area)
                ship.style.gridRowStart = startY;
                ship.style.gridColumnStart = startX;
                ship.style.gridRowEnd = endY;
                ship.style.gridColumnEnd = endX;
        
                GB.appendChild(ship);

                // allow dragging for each ship
                dragObj.allowShipDragging(ship);
            }

            // Dispatch custom event after ships are randomized
            document.dispatchEvent(new CustomEvent('shipsRandomized', { detail: { type: 'Player' } }));
        });
        document.querySelector(`.Player#player-container`).appendChild(RandomizeShips);
    }

    addPlayMenu() {
        // add a BLINDER (if there's none)
        const computerGB = document.querySelector('.Computer #gameboard')
        if (computerGB && !computerGB.classList.contains('blinder')) {
            computerGB.classList.add('blinder');
        }

        // dispatchEvent to create a PLAY BUTTON when there are ships placed 
        document.addEventListener('shipsRandomized', (event) => {
            // (pass 'type' from which the ships were randomized)
            document.dispatchEvent(new CustomEvent('playReady', { detail: { type: event.detail.type } }));
        });
    }
}