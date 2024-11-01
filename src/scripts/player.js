import { ShipDragHandler } from "./shipDragHandler";
import { User } from "./user.js";

export class Player extends User {
    #gameboard;
    
    constructor(gameboard, ships) {
        super(gameboard, ships);
        this.#gameboard = gameboard;
    }

    attack(computerObj, tileIndex) {
        let x = tileIndex % this.#gameboard.width;
        let y = Math.floor(tileIndex / this.#gameboard.height);
        const attack = computerObj.gameboard.receiveAttack(x, y);

        // add hit effect
        const attackEffect = document.createElement('div');
        attackEffect.classList.add(attack);
        const computerGbHTML = document.querySelector('.Computer #gameboard');
        
        const playerTiles = computerGbHTML.querySelectorAll('[id=tile]');
        playerTiles[x+y*this.#gameboard.width].appendChild(attackEffect);

        const computerGbObj = computerObj.gameboard;
        if (attack === 'hit') {

            if (computerGbObj.board[y][x].ship.isSunk()) {
                const shipName = computerGbObj.board[y][x].ship.name;
                // display it
                console.log('sunk', shipName);
                
                // make the ship appear
                const { startX, endX, startY, endY } = computerGbObj.shipsOnBoard[shipName];
    
                const ship = document.createElement('div');
                ship.setAttribute('id', 'ship');
                ship.setAttribute('name', shipName);
        
                // Set the ship position on gameboard grid (using area)
                ship.style.gridRowStart = startY;
                ship.style.gridColumnStart = startX;
                ship.style.gridRowEnd = endY;
                ship.style.gridColumnEnd = endX;
                computerGbHTML.appendChild(ship);

                this.addRippleEffect(ship);
            }
        }

        // change turn
        Player.setPlayerTurn(false);
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
                // when game is started - remove dragging for each ship
                document.addEventListener('gamePrepared', () => dragObj.removeShipDragging(ship));
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