import { ShipDragHandler } from "./shipDragHandler";
import { User } from "./user.js";

export class Player extends User {
    #gameboard;
    #ships;
    #sunkenOpponentShips = 0;
    
    constructor(gameboard, ships) {
        super(gameboard, ships);
        this.#ships = ships;
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
                this.#sunkenOpponentShips++;

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

                // check if player sank all computer ships - end the game
                if (this.#sunkenOpponentShips === this.#ships.length) {
                    document.dispatchEvent(new CustomEvent('gameEnded', { detail: { type: this.constructor.name } }));
                }
            }
        }

        // change turn
        Player.setPlayerTurn(false);
    }

    addRandomizeShipsButton() {
        const GB = document.querySelector(`.Player #gameboard`);
        // get RANDOMIZE SHIPS BUTTON
        const RandomizeShips = document.getElementById('randomize-button');

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
    }
}