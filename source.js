/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/reset.css":
/*!***********************!*\
  !*** ./src/reset.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/scripts/computer.js":
/*!*********************************!*\
  !*** ./src/scripts/computer.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Computer: () => (/* binding */ Computer)
/* harmony export */ });
/* harmony import */ var _user_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user.js */ "./src/scripts/user.js");


class Computer extends _user_js__WEBPACK_IMPORTED_MODULE_0__.User {
    #gameboard;
    #ships;
    #sunkenOpponentShips = 0;
    #lastComputerHitStack;
    #computerAttacks;

    constructor(gameboard, ships) {
        super(gameboard, ships);
        this.#gameboard = gameboard;
        this.#ships = ships;

        this.#lastComputerHitStack = [];
        this.#computerAttacks = [];
        for (let x = 0; x < this.#gameboard.width; x++) {
            for (let y = 0; y < this.#gameboard.height; y++) {
                this.#computerAttacks.push({x: x, y: y});
            }
        }
    }

    addPlayMenu() {
        // add a BLINDER (if there's none)
        const computerGB = document.querySelector('.Computer #gameboard')
        if (computerGB && !computerGB.classList.contains('gameboard-blinder')) {
            computerGB.classList.add('gameboard-blinder');
        }

        // dispatchEvent to create a PLAY BUTTON when there are ships placed 
        document.addEventListener('shipsRandomized', (event) => {
            // (pass 'type' from which the ships were randomized)
            document.dispatchEvent(new CustomEvent('playReady', { detail: { type: event.detail.type } }));
        });
    }

    attack(playerObj) {
        const {x, y} = this.#chooseComputerAttack();

        // if attack array is empty and can't assign x, y
        if (x === undefined || y === undefined) {
            throw new Error('No possible computer attacks found');
        }

        // attack
        const attack = playerObj.gameboard.receiveAttack(x, y);

        const attackEffect = document.createElement('div');
        attackEffect.classList.add(attack);
        const playerTiles = document.querySelector('.Player #gameboard').querySelectorAll('[id=tile]');
        playerTiles[x+y*this.#gameboard.width].appendChild(attackEffect);

        
        if (attack === 'hit') {
            // change last successful hit
            this.#lastComputerHitStack.push({x, y});

            // check if ship sunk
            if (playerObj.gameboard.board[y][x].ship.isSunk()) {
                this.#sunkenOpponentShips++;

                // display it
                console.log('sunk', playerObj.gameboard.board[y][x].ship.name);
                
                const ship = document.querySelector(`.Player #gameboard [id=ship][name=${playerObj.gameboard.board[y][x].ship.name}`);
                this.addRippleEffect(ship);
            }
        }
        Computer.setPlayerTurn(true);
    }

    isDefeated() {
        return this.#sunkenOpponentShips === this.#ships.length;
    }

    #chooseComputerAttack() {
        if (this.#lastComputerHitStack.length === 0) {
            return this.#chooseComputerAttackRandom();
        } else {
            // hit around last attack
            const {x: lastX, y: lastY} = this.#lastComputerHitStack[0];
            const currComputerAttacks = [];

            const newAttacks = [
                {x: lastX+1, y: lastY},
                {x: lastX-1, y: lastY},
                {x: lastX  , y: lastY+1},
                {x: lastX  , y: lastY-1}
            ];
            // generate all possible moves around last hit 
            newAttacks.forEach(newAttack => {
                // exclude duplicates
                if (this.#computerAttacks.findIndex(attack => attack.x === newAttack.x && attack.y === newAttack.y) !== -1) {
                    currComputerAttacks.push(newAttack);
                }
            });

            if (currComputerAttacks.length > 0) {
                // choose one random attack
                let index = Math.floor(Math.random() * currComputerAttacks.length);
                const {x, y} = currComputerAttacks[index];
                // remove taken attack from the pull of 'computerAttacks'
                this.#computerAttacks = this.#computerAttacks.filter(attack => !(attack.x === x && attack.y === y));
                return {x, y};
            } else {
                // no moves around found
                this.#lastComputerHitStack.shift();  // Remove last hit if no valid attacks around
                // restart chooseComputerAttack
                return this.#chooseComputerAttack();
            }
        }
    }

    #chooseComputerAttackRandom() {
        const index = Math.floor(Math.random() * this.#computerAttacks.length);
        return this.#computerAttacks.splice(index, 1)[0]; // get element and remove it
    }


    createPlayButton() {
        const blinder = document.querySelector('.Computer .gameboard-blinder');
        const playButton = document.getElementById('play-button');
        
        if (blinder && playButton) {
            playButton.style.visibility = 'visible';
            playButton.classList.add('pop-in');

            playButton.addEventListener('click', () => {
                // remove blinder class from wrapper
                blinder.classList.remove('gameboard-blinder');
                // RANDOMIZE COMPUTERS's SHIPS
                this.randomlySetShips();
                // START GAME TURNS
                document.dispatchEvent(new CustomEvent('gamePrepared'));
                setTimeout(() => {
                    // hide 'randomize ships' button (hide and not remove - to keep space)
                    const randomizeButton = document.querySelector('#randomize-button');
                    if (randomizeButton) randomizeButton.classList.add('fade-out');
                    // make 'play' button hidden
                    playButton.classList.remove('pop-in');
                    playButton.classList.add('fade-out');
                }, 100);
            });
        }
    }
}

/***/ }),

/***/ "./src/scripts/game.js":
/*!*****************************!*\
  !*** ./src/scripts/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Game: () => (/* binding */ Game)
/* harmony export */ });
/* harmony import */ var _player_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player.js */ "./src/scripts/player.js");
/* harmony import */ var _ship_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship.js */ "./src/scripts/ship.js");
/* harmony import */ var _computer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computer.js */ "./src/scripts/computer.js");
/* harmony import */ var _gameboard_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gameboard.js */ "./src/scripts/gameboard.js");





class Game {
    #player; #computer;
    #shipsInitial;
    
    createShips(shipsInitial) {
        this.#shipsInitial = shipsInitial;
        const ships = [];
        Object.entries(shipsInitial).forEach(([ship, length]) => {
            const shipObj = new _ship_js__WEBPACK_IMPORTED_MODULE_1__.Ship(ship, length); 
            ships.push(shipObj);
        });
        return ships
    }

    constructor(shipsInitial) {
        // Initialize Gameboards
        const GBwidth = 5;
        const GBheight = 5;
        const playerGB = new _gameboard_js__WEBPACK_IMPORTED_MODULE_3__.Gameboard(GBwidth, GBheight);
        const computerGB = new _gameboard_js__WEBPACK_IMPORTED_MODULE_3__.Gameboard(GBwidth, GBheight);

        // Initialize Players
        const player = new _player_js__WEBPACK_IMPORTED_MODULE_0__.Player(playerGB, this.createShips(shipsInitial));
        const computer = new _computer_js__WEBPACK_IMPORTED_MODULE_2__.Computer(computerGB, this.createShips(shipsInitial));

        this.#player = player;
        this.#computer = computer;

        // Use methods to initialize the game 
        player.initGameboard();
        computer.initGameboard();
        
        player.addRandomizeShipsButton();
        
        // Add blinder and play button
        computer.addPlayMenu();
        document.addEventListener('playReady', (event) => {
            // if player's ships were randomized
            if (event.detail.type === 'Player') { 
                this.#computer.createPlayButton();
            }
        });

        // Start the game attack turns - when 'gamePrepared' is up
        document.addEventListener('gamePrepared', () => this.startGame());
    }

    startGame() {
        // add EventListeners to all '.tiles' to get player attacks
        const tiles = document.querySelector('.Computer #gameboard').querySelectorAll('[id=tile]');

        // set starting turn to player
        _player_js__WEBPACK_IMPORTED_MODULE_0__.Player.setPlayerTurn(true);

        tiles.forEach((tile, tileIndex) => {
            tile.addEventListener('click', () => {

                // PLAYER ATTACK TURN
                try {
                    if (!_player_js__WEBPACK_IMPORTED_MODULE_0__.Player.getPlayerTurn()) {
                        throw new Error('Not Player\'s turn');
                    }
                    this.#player.attack(this.#computer, tileIndex);

                    // Check for end game after player's attack
                    if (this.#computer.isDefeated()) {
                        this.endGame({ detail: { type: 'Player' } });
                        return;  // Exit to prevent computer's attack
                    }
                } catch (err) {
                    console.error(err);
                }

                // COMPUTER ATTACK TURN
                try {
                    if (!_player_js__WEBPACK_IMPORTED_MODULE_0__.Player.getPlayerTurn()) {
                        this.#computer.attack(this.#player);

                        // Check for end game after computer's attackh
                        if (this.#player.isDefeated()) {
                            this.endGame({ detail: { type: 'Computer' } });
                            return;
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        });
    }

    endGame(event) {
        const blinder = document.createElement('div');
        blinder.classList.add('body-blinder');

        const blinderContent = document.createElement('div');
        blinderContent.classList.add('blinder-content');

        const text = document.createElement('p');
        text.classList.add('pop-in');
        text.style.display = 'block';

        switch(event.detail.type) {
            case 'Computer':
                text.textContent = 'You Win';
                text.classList.add('game-win');
                break;
            case 'Player':
                text.textContent = 'You Lose';
                text.classList.add('game-lose');
                break;
        }

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.classList.add('restart-button');

        // When clicked, restart the page
        restartButton.addEventListener('click', () => {
            location.reload();
        });

        blinderContent.appendChild(text);
        blinderContent.appendChild(restartButton);
        blinder.appendChild(blinderContent);
        document.body.appendChild(blinder);
    }
}

/***/ }),

/***/ "./src/scripts/gameboard.js":
/*!**********************************!*\
  !*** ./src/scripts/gameboard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Gameboard: () => (/* binding */ Gameboard)
/* harmony export */ });
class Gameboard {
    #board;
    #width; #height;
    #shipsOnBoard = {};

    // create a board of width x height
    constructor(width, height) {

        if (typeof width !== 'number' || typeof height !== 'number') {
            throw new Error('Width or Height is not a number!');
        }
        if (width === 0 && height === 0) {
            throw new Error('Board is empty!');
        }

        this.#width = width;
        this.#height = height;
        
        // create the board, every tile has 'ship' object, and a bool 'isHit'
        this.#board = new Array(height);
        for(let i = 0; i < height; i++){
            this.#board[i] = new Array(width);
            for(let j = 0; j < width; j++) {
                this.#board[i][j] = {ship: undefined, isHit: false};
            }
        }
        
    };

    get width() { return this.#width; }
    get height() { return this.#height; }
    get board() { return this.#board; }
    get shipsOnBoard() { return this.#shipsOnBoard; }

    resetBoard() {
        for(let i = 0; i < this.#height; i++) {
            for(let j = 0; j < this.#width; j++) {
                this.#board[i][j].ship = undefined;
                this.#board[i][j].isHit = false;
            }
        }
    }

    printBoard() {
        let text = '';
        for(let i = 0; i < this.#height; i++) {
            for(let j = 0; j < this.#width; j++) {
                if (this.#board[i][j].ship !== undefined) {
                    text += '1 ';
                } else {
                    text += '0 ';
                }
            }
            text += '\n';
        }
        console.log(text);
    }

    // checks if (on ship placement) there is another ship (that prevents placement)
    canPlaceShip(x, y, ship, orientation) {
        switch (orientation) {
            case 'x':
                for(let i = x; i < x+ship.length; i++) {
                    if (this.#board[y][i].ship !== undefined) {
                        return false;
                    }
                }
                break;
            case 'y':
                for(let i = y; i < y+ship.length; i++) {
                    if (this.#board[i][x].ship !== undefined) {
                        return false;
                    }
                }
                break;
            default:
                throw new Error('invalid passed "orientation"! (When checking for valid ship placement)');
        }
        return true;
    }

    placeShip(x, y, ship, orientation) {
        // check if ship fits the board (based on orientation)
        switch (orientation) {
        case 'x':
            if (!this.canPlaceShip(x, y, ship, orientation)) {
                throw new Error('Another ship is in path of ship placement! (horizontally)');
            }
            if (x >= 0 && x+ship.length <= this.#width) {
                // change '#board' tiles on the horizontal
                for(let i = x; i < x+ship.length; i++) {
                    this.#board[y][i] = {ship: ship, isHit: false};
                }
                ship.orientation = orientation;
                // add ship coordinates to a list that tracks all of them
                this.#shipsOnBoard[ship.name] = { 
                    startX: x + 1,
                    endX: x + ship.length + 1,
                    startY: y + 1,
                    endY: y + 1,
                    orientation: orientation,
                    length: ship.length
                };
            } else {
                throw new Error('Not enough room for ship to be placed! (horizontally)');
            }
            break;
        case 'y':
            if (!this.canPlaceShip(x, y, ship, orientation)) {
                throw new Error('Another ship is in path of ship placement! (vertically)');
            }
            if (y >= 0 && y+ship.length <= this.#height) {
                // change '#board' tiles on the vertical
                for(let i = y; i < y+ship.length; i++) {
                    this.#board[i][x] = {ship: ship, isHit: false};
                }
                ship.orientation = orientation;
                // add ship coordinates to a list that tracks all of them
                this.#shipsOnBoard[ship.name] = { 
                    startX: x + 1,
                    endX: x + 1,
                    startY: y + 1,
                    endY: y + ship.length + 1,
                    orientation: orientation,
                    length: ship.length
                };
            } else {
                throw new Error('Not enough room for ship to be placed! (vertically)');
            }
            break;
        default:
            throw new Error('Invalid orientation!'); 
        }
    }

    receiveAttack(x, y) {
        // if already shot this tile
        if (this.#board[y][x].isHit) {
            // check if there's a ship or not
            if (this.#board[y][x].ship === undefined) {
                throw new Error('Tile(blank) already shot');
            } else if (typeof this.#board[y][x].ship === 'object') {
                throw new Error('Tile(ship) already shot');
            } else {
                throw new Error('Tile(unknown) already shot');
            }
        } 
        // if not shot, shoot!
        else {
            if (this.#board[y][x].ship === undefined) {
                // not a ship, MISSED!
                this.#board[y][x].isHit = true;
                return 'miss';
            } else if (typeof this.#board[y][x].ship === 'object') {
                // a ship, HIT!
                this.#board[y][x].isHit = true;
                this.#board[y][x].ship.hit();
                return 'hit';
            }
        }
    }

    removeShip(x, y, ship, orientation) {
        switch (orientation) {
            case 'x':
                for(let i = x; i < x+ship.length; i++) {
                    this.#board[y][i] = { ship: undefined, isHit: false };
                }
                break;
            case 'y':
                for(let i = y; i < y+ship.length; i++) {
                    this.#board[i][x] = { ship: undefined, isHit: false };
                }
                break;
            default:
                throw new Error('invalid passed "orientation"! (When removing a ship)');
        }
    }
}

/***/ }),

/***/ "./src/scripts/player.js":
/*!*******************************!*\
  !*** ./src/scripts/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Player: () => (/* binding */ Player)
/* harmony export */ });
/* harmony import */ var _shipDragHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shipDragHandler */ "./src/scripts/shipDragHandler.js");
/* harmony import */ var _user_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user.js */ "./src/scripts/user.js");



class Player extends _user_js__WEBPACK_IMPORTED_MODULE_1__.User {
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
            }
        }

        // change turn
        Player.setPlayerTurn(false);
    }

    isDefeated() {
        return this.#sunkenOpponentShips === this.#ships.length;
    }

    addRandomizeShipsButton() {
        const GB = document.querySelector(`.Player #gameboard`);
        // get RANDOMIZE SHIPS BUTTON
        const RandomizeShips = document.getElementById('randomize-button');

        // allow drag/drop for gameboard
        const dragObj = new _shipDragHandler__WEBPACK_IMPORTED_MODULE_0__.ShipDragHandler(this.#gameboard);

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

/***/ }),

/***/ "./src/scripts/ship.js":
/*!*****************************!*\
  !*** ./src/scripts/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ship: () => (/* binding */ Ship)
/* harmony export */ });
class Ship {
    #name;
    #length;
    #hits;
    #orientation;
    
    constructor(name, length) {
        if (length < 1 || length > 5) {
            throw new Error('Invalid ship length!');
        }

        this.#name = name;
        this.#length = length;
        this.#hits = 0;
    }

    get name() { return this.#name; }
    get length() { return this.#length; }
    get hits() { return this.#hits; }
    get orientation() { return this.#orientation; }
    // when changing ship's position, allow to change it's orientation
    set orientation(newOrientation) { this.#orientation = newOrientation; }

    hit() {
        this.#hits++; 
    }

    isSunk() {
        if (this.#length === this.#hits) {
            return true;
        }
        return false;
    }
}

/***/ }),

/***/ "./src/scripts/shipDragHandler.js":
/*!****************************************!*\
  !*** ./src/scripts/shipDragHandler.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShipDragHandler: () => (/* binding */ ShipDragHandler)
/* harmony export */ });
class ShipDragHandler {
    #eventListeners = [];

    constructor(gameboard) {
        this.gameboardObj = gameboard;
        this.gameboardElement = document.querySelector('.Player #gameboard');
        this.startShip = null; // To keep track of the ship's starting data
        this.currentShip = null; // To keep track of the ship being dragged
        this.offset = { x: 0, y: 0 }; // To store the drag offset

        // Desktop support
        this.addEventListener(this.gameboardElement, 'dragover', (e) => this.#dragOver(e));
        this.addEventListener(this.gameboardElement, 'drop', (e) => this.#drop(e));
    }

    // override addEventListener
    addEventListener(element, type, handler) {
        element.addEventListener(type, handler);
        this.#eventListeners.push({ element, type, handler }); // store this eventListener
    }

    allowShipDragging(ship) {
        ship.setAttribute('draggable', 'true');
        // Desktop support
        this.addEventListener(ship, 'dragstart', (e) => this.#dragStart(e, ship));
        this.addEventListener(ship, 'dragend', () => this.#dragEnd());
        // Mobile support
        this.addEventListener(ship, 'touchstart', (e) => this.#touchStart(e, ship));
        this.addEventListener(ship, 'touchend', () => this.#touchEnd());
        
    }

    removeShipDragging(ship) {
        ship.setAttribute('draggable', 'false');

        // Remove all event listeners associated with the ship and gameboard
        this.#eventListeners = this.#eventListeners.filter(listener => {
            const isShipListener = listener.element === ship;
            const isGameboardListener = listener.element === this.gameboardElement;

            if (isShipListener || isGameboardListener) {
                // Remove the listener
                listener.element.removeEventListener(listener.type, listener.handler);
                return false; // Remove this listener from the array
            }
            return true; // Keep this listener
        });
    }

    /* DESKTOP SUPPORT */

    #dragStart(e, ship) {
        this.startShip = ship.cloneNode(false); // store the ship's starting position
        this.currentShip = ship;

        e.dataTransfer.setData('text/plain', ship.id);
    }

    #dragEnd() {
        // Reset offset (so that next click has new offset)
        this.offset = { x: 0, y: 0 };
        // Clear the ship references
        this.startShip = null;
        this.currentShip = null;
    }

    #dragOver(e) {
        e.preventDefault(); // Prevent default to allow dropping
    }

    #drop(e) {
        e.preventDefault(); // Prevent default behavior

        const dropPosition = this.#getDropPosition(e);
        this.#placeShip(dropPosition);
    }

    /* MOBILE SUPPORT */

    #touchStart(e, ship) {
        e.preventDefault();
        this.startShip = ship.cloneNode(false); // store the ship's starting position
        this.currentShip = ship; // pass by reference to currentShip
        
        // Calculate the offset of the mouse pointer relative to the ship's top-left corner
        const touch = e.targetTouches[0];
        const shipRect = this.currentShip.getBoundingClientRect();
        this.offset = {
            x: touch.clientX - window.scrollY - shipRect.left,
            y: touch.clientY - window.scrollY - shipRect.top
        };

        ship.style.width = window.getComputedStyle(ship).getPropertyValue('width');
        ship.style.height = window.getComputedStyle(ship).getPropertyValue('height');
        ship.style.gridArea = ''; // remove the grid-area to allow calculating the new position

        // Calculate ship starting position so that it doesnt appear in top left corner
        const gameboardRect = this.gameboardElement.getBoundingClientRect();
        this.currentShip.style.left = `${touch.clientX - gameboardRect.left - this.offset.x}px`;
        this.currentShip.style.top = `${touch.clientY - gameboardRect.top - this.offset.y}px`;

        this.gameboardElement.addEventListener('touchmove', (e) => this.#touchDrag(e), { passive: false });
    }

    #touchDrag(e) {
        if (this.currentShip) {
            e.preventDefault();

            const gameboardRect  = this.gameboardElement.getBoundingClientRect();
            const touch = e.targetTouches[0];
            this.currentShip.style.left = `${touch.clientX - gameboardRect.left - this.offset.x}px`;
            this.currentShip.style.top = `${touch.clientY - gameboardRect.top - this.offset.y}px`;
        }
    }

    #touchEnd() {
        const dropPosition = this.#getDropPositionTouch();
        this.#placeShip(dropPosition);

        this.gameboardElement.removeEventListener('touchmove', (e) => this.#touchDrag(e));
        // Reset offset (so that next click has new offset)
        this.offset = { x: 0, y: 0 };
        // Clear the ship references
        this.startShip = null;
        this.currentShip = null;
    }

    /* OTHER FUNCTIONS */

    // Desktop
    #getDropPosition(e) {
        const gameboardRect = this.gameboardElement.getBoundingClientRect();
        const cellWidth = gameboardRect.width / this.gameboardObj.width;
        const cellHeight = gameboardRect.height / this.gameboardObj.height;

        const xPos = Math.floor((e.clientX - gameboardRect.left) / cellWidth);
        const yPos = Math.floor((e.clientY - gameboardRect.top) / cellHeight);

        return { x: xPos, y: yPos };
    }

    // Mobile
    #getDropPositionTouch() {
        const gameboardRect = this.gameboardElement.getBoundingClientRect();
        const cellWidth = gameboardRect.width / this.gameboardObj.width;
        const cellHeight = gameboardRect.height / this.gameboardObj.height;

        // calculate current ship position
        // currentShip.style.top/left to take left upper corner of ship
        // add cellWidth/Height to take the center of left ship corner
        const xPos = Math.floor((parseFloat(this.currentShip.style.left) + cellWidth/2) / cellWidth);
        const yPos = Math.floor((parseFloat(this.currentShip.style.top) + cellHeight/2) / cellHeight);

        return { x: xPos, y: yPos };
    }

    #placeShip(dropPosition) {
        if (this.#isValidDrop(this.currentShip, dropPosition)) {
            const prevX = this.startShip.style.gridColumnStart - 1;
            const prevY = this.startShip.style.gridRowStart - 1;
            const shipObj = this.gameboardObj.board[prevY][prevX].ship; // Get 'ship' object from previous position
            const prevOrientation = shipObj.orientation;

            this.#placeShipVisually(dropPosition, shipObj);

            /* Adress the ship position changes */
            const newX = dropPosition.x;
            const newY = dropPosition.y;
            const newOrientation = shipObj.orientation;
            
            // Refresh gameboard.board
            this.gameboardObj.removeShip(prevX, prevY, shipObj, prevOrientation);
            this.gameboardObj.placeShip(newX, newY, shipObj, newOrientation);
            this.gameboardObj.printBoard(); // Debug
        } else {
            console.log('Invalid drop position'); // Handle invalid drop
        }
    }

    // Logic to visually place the ship on the gameboard
    #placeShipVisually(dropPosition, shipObj) {
        const shipSize = shipObj.length;
        const shipOrientation = shipObj.orientation;

        // remove previous 'width', 'height' to allow grid snapping
        this.currentShip.style.width = '';
        this.currentShip.style.height = '';
        this.currentShip.style.left = '';
        this.currentShip.style.top = '';
        
        switch(shipOrientation) {
            case 'x':
                this.currentShip.style.gridRowStart = dropPosition.y + 1;
                this.currentShip.style.gridRowEnd = dropPosition.y + 1;
                this.currentShip.style.gridColumnStart = dropPosition.x + 1;
                this.currentShip.style.gridColumnEnd = dropPosition.x + shipSize + 1;
                break;
            case 'y':
                this.currentShip.style.gridRowStart = dropPosition.y + 1;
                this.currentShip.style.gridRowEnd = dropPosition.y + shipSize + 1;
                this.currentShip.style.gridColumnStart = dropPosition.x + 1;
                this.currentShip.style.gridColumnEnd = dropPosition.x + 1;
                break;
        }
    }

    #isValidDrop(ship, dropPosition) {
        // Implement logic to check if the ship can be placed at dropPosition
        // Check if the area occupied by the ship is free, considering its size and orientation
        // Return true if valid, false otherwise
        return true; // Replace with actual validation logic
    }
}


/***/ }),

/***/ "./src/scripts/user.js":
/*!*****************************!*\
  !*** ./src/scripts/user.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   User: () => (/* binding */ User)
/* harmony export */ });
// Abstract class User
// Subclasses: Player, Computer
class User {
    #gameboard;
    #ships;
    static #playerTurn;
    #ripple;

    constructor(gameboard, ships) {
        if(this.constructor == User) {
            throw new Error("Class is of abstract type and can't be instantiated");
         };
        this.#gameboard = gameboard;
        this.#ships = ships;
        User.sunkenOpponentShips = 0;

        // generate ripple effect to apply to sunken ships
        this.#ripple = this.#getRippleSpan();
    }

    get gameboard() { return this.#gameboard; }

    static getPlayerTurn() {
        return User.#playerTurn;
    }

    static setPlayerTurn(turn) {
        User.#playerTurn = turn;
    }

    initGameboard() {
        const GB = document.querySelector(`.${this.constructor.name} #gameboard`);

        // change gameboard grid to specified width and height
        GB.style.gridTemplateColumns = `repeat(${this.#gameboard.width}, 1fr)`;
        GB.style.gridTemplateRows = `repeat(${this.#gameboard.height}, 1fr)`;

        // add tiles to gameboard grid
        for (let y = 0; y < this.#gameboard.height; y++) {
            for (let x = 0; x < this.#gameboard.width; x++) {
                const tile = document.createElement('div');
                tile.setAttribute('id', 'tile');
                GB.appendChild(tile);
            }
        }
    }

    attack() {
        throw new Error("Attack method needs to be defined");
    }

    // check if user sank all opponent's ships - end the game
    isDefeated() {
        throw new Error("isDefeated method needs to be defined");
    }
    
    #getRippleSpan() {
        // Create the ripple element inside the container
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Create simulated ship
        const ship = document.createElement('div');
        ship.setAttribute('id', 'ship');
        ship.style.width = ship.style.height = '1px';
        
        // Get ship grayscale background color
        document.body.appendChild(ship);
        const rgbMatch = window.getComputedStyle(ship).backgroundColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        ship.remove();

        if (rgbMatch) {
            // Parse the RGB values
            const r = parseInt(rgbMatch[1], 10);
            const g = parseInt(rgbMatch[2], 10);
            const b = parseInt(rgbMatch[3], 10);

            // Calculate grayscale by averaging RGB values
            const gray = Math.round((r + g + b) / 3);
            // Create a grayscale color string with adjusted opacity for the ripple
            const grayscaleColor = `rgba(${gray}, ${gray}, ${gray}, 1)`;
            ripple.style.backgroundColor = grayscaleColor;
        }

        return ripple;
    }

    addRippleEffect(ship) {
        const ripple = this.#ripple.cloneNode(false);
        ship.appendChild(ripple);

        // Set the size of the ripple to cover the rippleEffect container
        const maxDimension = Math.max(ship.offsetWidth, ship.offsetHeight);
        ripple.style.width = ripple.style.height = maxDimension + 'px';

        // Center the ripple in the container
        ripple.style.left = `${(ship.offsetWidth - maxDimension) / 2}px`;
        ripple.style.top = `${(ship.offsetHeight - maxDimension) / 2}px`;
        
        // Trigger the ripple animation
        setTimeout(() => ripple.classList.add('animate'), 0);
    }

    randomlySetShips() {
        this.#gameboard.resetBoard();
        // Start the backtracking process with the first ship
        let shipsData = this.#ships;
        if (!this.#randomlySetShipsBacktrack(shipsData, 0)) {
            throw new Error('Unable to place all ships!');
        }
        this.#gameboard.printBoard();
    }

    #randomlySetShipsBacktrack(shipsData, index) {
        // end backtracking (all ships placed)
        if (index === shipsData.length) {
            return true;
        }

        const ship = shipsData[index];
        const validPositions = this.#getValidPositions(ship);

        // Shuffle the valid positions to introduce randomness
        this.#shuffleArray(validPositions);

        // Try each valid position
        for (const { x, y, orientation } of validPositions) {
            try {
                // try to place the ship
                this.#gameboard.placeShip(x, y, ship, orientation);
            } catch (e) {
                // if it can't be done then go to next iteration
                continue;
            }

            // Recursively place the next ship
            if (this.#randomlySetShipsBacktrack(shipsData, index + 1)) {
                return true;
            }

            // If placing the next ship fails, remove the current ship (backtrack)
            this.#gameboard.removeShip(x, y, ship, orientation);
        }

        return false;
    }

    #getValidPositions(ship) {
        const width = this.#gameboard.width;
        const height = this.#gameboard.height;
        const validPositions = [];
        
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                if (x+ship.length <= width && this.#gameboard.canPlaceShip(x, y, ship, 'x')) {
                    validPositions.push({x, y, orientation: 'x'});
                }
                if (y+ship.length <= height && this.#gameboard.canPlaceShip(x, y, ship, 'y')) {
                    validPositions.push({x, y, orientation: 'y'});
                }
            }
        }
        return validPositions;
    }

    #shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/source.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _reset_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reset.css */ "./src/reset.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _scripts_game_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/game.js */ "./src/scripts/game.js");





(function main() {

    try {

        // initialize Ship objects
        const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 1, 'Destroyer': 2};

        new _scripts_game_js__WEBPACK_IMPORTED_MODULE_2__.Game(shipsInitial);

    } catch (e) {
        console.error(e);
    }

})();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkMsMkJBQTJCLFdBQVc7QUFDdEM7QUFDQSx5Q0FBeUMsdUJBQXVCO0FBQ2hFO0FBQ0E7QUFDQSx5Q0FBeUMsdUJBQXVCO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLE9BQU87QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDM0tBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7OztBQ05xQjtBQUNBO0FBQ3JCO0FBQ3lDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBLFlBQVksa0RBQUk7QUFDaEI7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsQ0FBQyxJIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9yZXNldC5jc3M/Y2UzOCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3N0eWxlLmNzcz9lMzIwIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0cy9jb21wdXRlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdHMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdHMvZ2FtZWJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvc2NyaXB0cy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHRzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zY3JpcHRzL3NoaXBEcmFnSGFuZGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3NjcmlwdHMvdXNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zb3VyY2UuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL3VzZXIuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBDb21wdXRlciBleHRlbmRzIFVzZXIge1xyXG4gICAgI2dhbWVib2FyZDtcclxuICAgICNzaGlwcztcclxuICAgICNzdW5rZW5PcHBvbmVudFNoaXBzID0gMDtcclxuICAgICNsYXN0Q29tcHV0ZXJIaXRTdGFjaztcclxuICAgICNjb21wdXRlckF0dGFja3M7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZWJvYXJkLCBzaGlwcykge1xyXG4gICAgICAgIHN1cGVyKGdhbWVib2FyZCwgc2hpcHMpO1xyXG4gICAgICAgIHRoaXMuI2dhbWVib2FyZCA9IGdhbWVib2FyZDtcclxuICAgICAgICB0aGlzLiNzaGlwcyA9IHNoaXBzO1xyXG5cclxuICAgICAgICB0aGlzLiNsYXN0Q29tcHV0ZXJIaXRTdGFjayA9IFtdO1xyXG4gICAgICAgIHRoaXMuI2NvbXB1dGVyQXR0YWNrcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy4jZ2FtZWJvYXJkLndpZHRoOyB4KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLiNnYW1lYm9hcmQuaGVpZ2h0OyB5KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuI2NvbXB1dGVyQXR0YWNrcy5wdXNoKHt4OiB4LCB5OiB5fSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkUGxheU1lbnUoKSB7XHJcbiAgICAgICAgLy8gYWRkIGEgQkxJTkRFUiAoaWYgdGhlcmUncyBub25lKVxyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyR0IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuQ29tcHV0ZXIgI2dhbWVib2FyZCcpXHJcbiAgICAgICAgaWYgKGNvbXB1dGVyR0IgJiYgIWNvbXB1dGVyR0IuY2xhc3NMaXN0LmNvbnRhaW5zKCdnYW1lYm9hcmQtYmxpbmRlcicpKSB7XHJcbiAgICAgICAgICAgIGNvbXB1dGVyR0IuY2xhc3NMaXN0LmFkZCgnZ2FtZWJvYXJkLWJsaW5kZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGRpc3BhdGNoRXZlbnQgdG8gY3JlYXRlIGEgUExBWSBCVVRUT04gd2hlbiB0aGVyZSBhcmUgc2hpcHMgcGxhY2VkIFxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3NoaXBzUmFuZG9taXplZCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAvLyAocGFzcyAndHlwZScgZnJvbSB3aGljaCB0aGUgc2hpcHMgd2VyZSByYW5kb21pemVkKVxyXG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgncGxheVJlYWR5JywgeyBkZXRhaWw6IHsgdHlwZTogZXZlbnQuZGV0YWlsLnR5cGUgfSB9KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNrKHBsYXllck9iaikge1xyXG4gICAgICAgIGNvbnN0IHt4LCB5fSA9IHRoaXMuI2Nob29zZUNvbXB1dGVyQXR0YWNrKCk7XHJcblxyXG4gICAgICAgIC8vIGlmIGF0dGFjayBhcnJheSBpcyBlbXB0eSBhbmQgY2FuJ3QgYXNzaWduIHgsIHlcclxuICAgICAgICBpZiAoeCA9PT0gdW5kZWZpbmVkIHx8IHkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHBvc3NpYmxlIGNvbXB1dGVyIGF0dGFja3MgZm91bmQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGF0dGFja1xyXG4gICAgICAgIGNvbnN0IGF0dGFjayA9IHBsYXllck9iai5nYW1lYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcclxuXHJcbiAgICAgICAgY29uc3QgYXR0YWNrRWZmZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgYXR0YWNrRWZmZWN0LmNsYXNzTGlzdC5hZGQoYXR0YWNrKTtcclxuICAgICAgICBjb25zdCBwbGF5ZXJUaWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5QbGF5ZXIgI2dhbWVib2FyZCcpLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZD10aWxlXScpO1xyXG4gICAgICAgIHBsYXllclRpbGVzW3greSp0aGlzLiNnYW1lYm9hcmQud2lkdGhdLmFwcGVuZENoaWxkKGF0dGFja0VmZmVjdCk7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChhdHRhY2sgPT09ICdoaXQnKSB7XHJcbiAgICAgICAgICAgIC8vIGNoYW5nZSBsYXN0IHN1Y2Nlc3NmdWwgaGl0XHJcbiAgICAgICAgICAgIHRoaXMuI2xhc3RDb21wdXRlckhpdFN0YWNrLnB1c2goe3gsIHl9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHNoaXAgc3Vua1xyXG4gICAgICAgICAgICBpZiAocGxheWVyT2JqLmdhbWVib2FyZC5ib2FyZFt5XVt4XS5zaGlwLmlzU3VuaygpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNzdW5rZW5PcHBvbmVudFNoaXBzKys7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gZGlzcGxheSBpdFxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3N1bmsnLCBwbGF5ZXJPYmouZ2FtZWJvYXJkLmJvYXJkW3ldW3hdLnNoaXAubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuUGxheWVyICNnYW1lYm9hcmQgW2lkPXNoaXBdW25hbWU9JHtwbGF5ZXJPYmouZ2FtZWJvYXJkLmJvYXJkW3ldW3hdLnNoaXAubmFtZX1gKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUmlwcGxlRWZmZWN0KHNoaXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIENvbXB1dGVyLnNldFBsYXllclR1cm4odHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEZWZlYXRlZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy4jc3Vua2VuT3Bwb25lbnRTaGlwcyA9PT0gdGhpcy4jc2hpcHMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgICNjaG9vc2VDb21wdXRlckF0dGFjaygpIHtcclxuICAgICAgICBpZiAodGhpcy4jbGFzdENvbXB1dGVySGl0U3RhY2subGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiNjaG9vc2VDb21wdXRlckF0dGFja1JhbmRvbSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGhpdCBhcm91bmQgbGFzdCBhdHRhY2tcclxuICAgICAgICAgICAgY29uc3Qge3g6IGxhc3RYLCB5OiBsYXN0WX0gPSB0aGlzLiNsYXN0Q29tcHV0ZXJIaXRTdGFja1swXTtcclxuICAgICAgICAgICAgY29uc3QgY3VyckNvbXB1dGVyQXR0YWNrcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbmV3QXR0YWNrcyA9IFtcclxuICAgICAgICAgICAgICAgIHt4OiBsYXN0WCsxLCB5OiBsYXN0WX0sXHJcbiAgICAgICAgICAgICAgICB7eDogbGFzdFgtMSwgeTogbGFzdFl9LFxyXG4gICAgICAgICAgICAgICAge3g6IGxhc3RYICAsIHk6IGxhc3RZKzF9LFxyXG4gICAgICAgICAgICAgICAge3g6IGxhc3RYICAsIHk6IGxhc3RZLTF9XHJcbiAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlIGFsbCBwb3NzaWJsZSBtb3ZlcyBhcm91bmQgbGFzdCBoaXQgXHJcbiAgICAgICAgICAgIG5ld0F0dGFja3MuZm9yRWFjaChuZXdBdHRhY2sgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gZXhjbHVkZSBkdXBsaWNhdGVzXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy4jY29tcHV0ZXJBdHRhY2tzLmZpbmRJbmRleChhdHRhY2sgPT4gYXR0YWNrLnggPT09IG5ld0F0dGFjay54ICYmIGF0dGFjay55ID09PSBuZXdBdHRhY2sueSkgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VyckNvbXB1dGVyQXR0YWNrcy5wdXNoKG5ld0F0dGFjayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKGN1cnJDb21wdXRlckF0dGFja3MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hvb3NlIG9uZSByYW5kb20gYXR0YWNrXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjdXJyQ29tcHV0ZXJBdHRhY2tzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7eCwgeX0gPSBjdXJyQ29tcHV0ZXJBdHRhY2tzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0YWtlbiBhdHRhY2sgZnJvbSB0aGUgcHVsbCBvZiAnY29tcHV0ZXJBdHRhY2tzJ1xyXG4gICAgICAgICAgICAgICAgdGhpcy4jY29tcHV0ZXJBdHRhY2tzID0gdGhpcy4jY29tcHV0ZXJBdHRhY2tzLmZpbHRlcihhdHRhY2sgPT4gIShhdHRhY2sueCA9PT0geCAmJiBhdHRhY2sueSA9PT0geSkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt4LCB5fTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIG5vIG1vdmVzIGFyb3VuZCBmb3VuZFxyXG4gICAgICAgICAgICAgICAgdGhpcy4jbGFzdENvbXB1dGVySGl0U3RhY2suc2hpZnQoKTsgIC8vIFJlbW92ZSBsYXN0IGhpdCBpZiBubyB2YWxpZCBhdHRhY2tzIGFyb3VuZFxyXG4gICAgICAgICAgICAgICAgLy8gcmVzdGFydCBjaG9vc2VDb21wdXRlckF0dGFja1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuI2Nob29zZUNvbXB1dGVyQXR0YWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgI2Nob29zZUNvbXB1dGVyQXR0YWNrUmFuZG9tKCkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy4jY29tcHV0ZXJBdHRhY2tzLmxlbmd0aCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI2NvbXB1dGVyQXR0YWNrcy5zcGxpY2UoaW5kZXgsIDEpWzBdOyAvLyBnZXQgZWxlbWVudCBhbmQgcmVtb3ZlIGl0XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNyZWF0ZVBsYXlCdXR0b24oKSB7XHJcbiAgICAgICAgY29uc3QgYmxpbmRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5Db21wdXRlciAuZ2FtZWJvYXJkLWJsaW5kZXInKTtcclxuICAgICAgICBjb25zdCBwbGF5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXktYnV0dG9uJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGJsaW5kZXIgJiYgcGxheUJ1dHRvbikge1xyXG4gICAgICAgICAgICBwbGF5QnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgICAgIHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgncG9wLWluJyk7XHJcblxyXG4gICAgICAgICAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGJsaW5kZXIgY2xhc3MgZnJvbSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICBibGluZGVyLmNsYXNzTGlzdC5yZW1vdmUoJ2dhbWVib2FyZC1ibGluZGVyJyk7XHJcbiAgICAgICAgICAgICAgICAvLyBSQU5ET01JWkUgQ09NUFVURVJTJ3MgU0hJUFNcclxuICAgICAgICAgICAgICAgIHRoaXMucmFuZG9tbHlTZXRTaGlwcygpO1xyXG4gICAgICAgICAgICAgICAgLy8gU1RBUlQgR0FNRSBUVVJOU1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ2dhbWVQcmVwYXJlZCcpKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGhpZGUgJ3JhbmRvbWl6ZSBzaGlwcycgYnV0dG9uIChoaWRlIGFuZCBub3QgcmVtb3ZlIC0gdG8ga2VlcCBzcGFjZSlcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCByYW5kb21pemVCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmFuZG9taXplLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5kb21pemVCdXR0b24pIHJhbmRvbWl6ZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdmYWRlLW91dCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgJ3BsYXknIGJ1dHRvbiBoaWRkZW5cclxuICAgICAgICAgICAgICAgICAgICBwbGF5QnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcC1pbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXlCdXR0b24uY2xhc3NMaXN0LmFkZCgnZmFkZS1vdXQnKTtcclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFBsYXllciB9IGZyb20gJy4vcGxheWVyLmpzJztcclxuaW1wb3J0IHsgU2hpcCB9IGZyb20gJy4vc2hpcC5qcyc7XHJcbmltcG9ydCB7IENvbXB1dGVyIH0gZnJvbSAnLi9jb21wdXRlci5qcyc7XHJcbmltcG9ydCB7IEdhbWVib2FyZCB9IGZyb20gJy4vZ2FtZWJvYXJkLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lIHtcclxuICAgICNwbGF5ZXI7ICNjb21wdXRlcjtcclxuICAgICNzaGlwc0luaXRpYWw7XHJcbiAgICBcclxuICAgIGNyZWF0ZVNoaXBzKHNoaXBzSW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMuI3NoaXBzSW5pdGlhbCA9IHNoaXBzSW5pdGlhbDtcclxuICAgICAgICBjb25zdCBzaGlwcyA9IFtdO1xyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHNoaXBzSW5pdGlhbCkuZm9yRWFjaCgoW3NoaXAsIGxlbmd0aF0pID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2hpcE9iaiA9IG5ldyBTaGlwKHNoaXAsIGxlbmd0aCk7IFxyXG4gICAgICAgICAgICBzaGlwcy5wdXNoKHNoaXBPYmopO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBzaGlwc1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNoaXBzSW5pdGlhbCkge1xyXG4gICAgICAgIC8vIEluaXRpYWxpemUgR2FtZWJvYXJkc1xyXG4gICAgICAgIGNvbnN0IEdCd2lkdGggPSA1O1xyXG4gICAgICAgIGNvbnN0IEdCaGVpZ2h0ID0gNTtcclxuICAgICAgICBjb25zdCBwbGF5ZXJHQiA9IG5ldyBHYW1lYm9hcmQoR0J3aWR0aCwgR0JoZWlnaHQpO1xyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVyR0IgPSBuZXcgR2FtZWJvYXJkKEdCd2lkdGgsIEdCaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBQbGF5ZXJzXHJcbiAgICAgICAgY29uc3QgcGxheWVyID0gbmV3IFBsYXllcihwbGF5ZXJHQiwgdGhpcy5jcmVhdGVTaGlwcyhzaGlwc0luaXRpYWwpKTtcclxuICAgICAgICBjb25zdCBjb21wdXRlciA9IG5ldyBDb21wdXRlcihjb21wdXRlckdCLCB0aGlzLmNyZWF0ZVNoaXBzKHNoaXBzSW5pdGlhbCkpO1xyXG5cclxuICAgICAgICB0aGlzLiNwbGF5ZXIgPSBwbGF5ZXI7XHJcbiAgICAgICAgdGhpcy4jY29tcHV0ZXIgPSBjb21wdXRlcjtcclxuXHJcbiAgICAgICAgLy8gVXNlIG1ldGhvZHMgdG8gaW5pdGlhbGl6ZSB0aGUgZ2FtZSBcclxuICAgICAgICBwbGF5ZXIuaW5pdEdhbWVib2FyZCgpO1xyXG4gICAgICAgIGNvbXB1dGVyLmluaXRHYW1lYm9hcmQoKTtcclxuICAgICAgICBcclxuICAgICAgICBwbGF5ZXIuYWRkUmFuZG9taXplU2hpcHNCdXR0b24oKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBBZGQgYmxpbmRlciBhbmQgcGxheSBidXR0b25cclxuICAgICAgICBjb21wdXRlci5hZGRQbGF5TWVudSgpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlSZWFkeScsIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAvLyBpZiBwbGF5ZXIncyBzaGlwcyB3ZXJlIHJhbmRvbWl6ZWRcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmRldGFpbC50eXBlID09PSAnUGxheWVyJykgeyBcclxuICAgICAgICAgICAgICAgIHRoaXMuI2NvbXB1dGVyLmNyZWF0ZVBsYXlCdXR0b24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTdGFydCB0aGUgZ2FtZSBhdHRhY2sgdHVybnMgLSB3aGVuICdnYW1lUHJlcGFyZWQnIGlzIHVwXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZ2FtZVByZXBhcmVkJywgKCkgPT4gdGhpcy5zdGFydEdhbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIC8vIGFkZCBFdmVudExpc3RlbmVycyB0byBhbGwgJy50aWxlcycgdG8gZ2V0IHBsYXllciBhdHRhY2tzXHJcbiAgICAgICAgY29uc3QgdGlsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuQ29tcHV0ZXIgI2dhbWVib2FyZCcpLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZD10aWxlXScpO1xyXG5cclxuICAgICAgICAvLyBzZXQgc3RhcnRpbmcgdHVybiB0byBwbGF5ZXJcclxuICAgICAgICBQbGF5ZXIuc2V0UGxheWVyVHVybih0cnVlKTtcclxuXHJcbiAgICAgICAgdGlsZXMuZm9yRWFjaCgodGlsZSwgdGlsZUluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHRpbGUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUExBWUVSIEFUVEFDSyBUVVJOXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghUGxheWVyLmdldFBsYXllclR1cm4oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBQbGF5ZXJcXCdzIHR1cm4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jcGxheWVyLmF0dGFjayh0aGlzLiNjb21wdXRlciwgdGlsZUluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIGVuZCBnYW1lIGFmdGVyIHBsYXllcidzIGF0dGFja1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiNjb21wdXRlci5pc0RlZmVhdGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRHYW1lKHsgZGV0YWlsOiB7IHR5cGU6ICdQbGF5ZXInIH0gfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgIC8vIEV4aXQgdG8gcHJldmVudCBjb21wdXRlcidzIGF0dGFja1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDT01QVVRFUiBBVFRBQ0sgVFVSTlxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIVBsYXllci5nZXRQbGF5ZXJUdXJuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4jY29tcHV0ZXIuYXR0YWNrKHRoaXMuI3BsYXllcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgZW5kIGdhbWUgYWZ0ZXIgY29tcHV0ZXIncyBhdHRhY2toXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiNwbGF5ZXIuaXNEZWZlYXRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZEdhbWUoeyBkZXRhaWw6IHsgdHlwZTogJ0NvbXB1dGVyJyB9IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBlbmRHYW1lKGV2ZW50KSB7XHJcbiAgICAgICAgY29uc3QgYmxpbmRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGJsaW5kZXIuY2xhc3NMaXN0LmFkZCgnYm9keS1ibGluZGVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGJsaW5kZXJDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgYmxpbmRlckNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnYmxpbmRlci1jb250ZW50Jyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgdGV4dC5jbGFzc0xpc3QuYWRkKCdwb3AtaW4nKTtcclxuICAgICAgICB0ZXh0LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cclxuICAgICAgICBzd2l0Y2goZXZlbnQuZGV0YWlsLnR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnQ29tcHV0ZXInOlxyXG4gICAgICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9ICdZb3UgV2luJztcclxuICAgICAgICAgICAgICAgIHRleHQuY2xhc3NMaXN0LmFkZCgnZ2FtZS13aW4nKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdQbGF5ZXInOlxyXG4gICAgICAgICAgICAgICAgdGV4dC50ZXh0Q29udGVudCA9ICdZb3UgTG9zZSc7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LmNsYXNzTGlzdC5hZGQoJ2dhbWUtbG9zZScpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgcmVzdGFydEJ1dHRvbi50ZXh0Q29udGVudCA9ICdSZXN0YXJ0JztcclxuICAgICAgICByZXN0YXJ0QnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3Jlc3RhcnQtYnV0dG9uJyk7XHJcblxyXG4gICAgICAgIC8vIFdoZW4gY2xpY2tlZCwgcmVzdGFydCB0aGUgcGFnZVxyXG4gICAgICAgIHJlc3RhcnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGxvY2F0aW9uLnJlbG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBibGluZGVyQ29udGVudC5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICBibGluZGVyQ29udGVudC5hcHBlbmRDaGlsZChyZXN0YXJ0QnV0dG9uKTtcclxuICAgICAgICBibGluZGVyLmFwcGVuZENoaWxkKGJsaW5kZXJDb250ZW50KTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJsaW5kZXIpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEdhbWVib2FyZCB7XHJcbiAgICAjYm9hcmQ7XHJcbiAgICAjd2lkdGg7ICNoZWlnaHQ7XHJcbiAgICAjc2hpcHNPbkJvYXJkID0ge307XHJcblxyXG4gICAgLy8gY3JlYXRlIGEgYm9hcmQgb2Ygd2lkdGggeCBoZWlnaHRcclxuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB3aWR0aCAhPT0gJ251bWJlcicgfHwgdHlwZW9mIGhlaWdodCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaWR0aCBvciBIZWlnaHQgaXMgbm90IGEgbnVtYmVyIScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod2lkdGggPT09IDAgJiYgaGVpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQm9hcmQgaXMgZW1wdHkhJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiN3aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuI2hlaWdodCA9IGhlaWdodDtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjcmVhdGUgdGhlIGJvYXJkLCBldmVyeSB0aWxlIGhhcyAnc2hpcCcgb2JqZWN0LCBhbmQgYSBib29sICdpc0hpdCdcclxuICAgICAgICB0aGlzLiNib2FyZCA9IG5ldyBBcnJheShoZWlnaHQpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBoZWlnaHQ7IGkrKyl7XHJcbiAgICAgICAgICAgIHRoaXMuI2JvYXJkW2ldID0gbmV3IEFycmF5KHdpZHRoKTtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHdpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW2ldW2pdID0ge3NoaXA6IHVuZGVmaW5lZCwgaXNIaXQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH07XHJcblxyXG4gICAgZ2V0IHdpZHRoKCkgeyByZXR1cm4gdGhpcy4jd2lkdGg7IH1cclxuICAgIGdldCBoZWlnaHQoKSB7IHJldHVybiB0aGlzLiNoZWlnaHQ7IH1cclxuICAgIGdldCBib2FyZCgpIHsgcmV0dXJuIHRoaXMuI2JvYXJkOyB9XHJcbiAgICBnZXQgc2hpcHNPbkJvYXJkKCkgeyByZXR1cm4gdGhpcy4jc2hpcHNPbkJvYXJkOyB9XHJcblxyXG4gICAgcmVzZXRCb2FyZCgpIHtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy4jaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHRoaXMuI3dpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW2ldW2pdLnNoaXAgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNib2FyZFtpXVtqXS5pc0hpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaW50Qm9hcmQoKSB7XHJcbiAgICAgICAgbGV0IHRleHQgPSAnJztcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy4jaGVpZ2h0OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IHRoaXMuI3dpZHRoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLiNib2FyZFtpXVtqXS5zaGlwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0ICs9ICcxICc7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQgKz0gJzAgJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0ICs9ICdcXG4nO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLmxvZyh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGVja3MgaWYgKG9uIHNoaXAgcGxhY2VtZW50KSB0aGVyZSBpcyBhbm90aGVyIHNoaXAgKHRoYXQgcHJldmVudHMgcGxhY2VtZW50KVxyXG4gICAgY2FuUGxhY2VTaGlwKHgsIHksIHNoaXAsIG9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgc3dpdGNoIChvcmllbnRhdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlICd4JzpcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IHg7IGkgPCB4K3NoaXAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4jYm9hcmRbeV1baV0uc2hpcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAneSc6XHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSB5OyBpIDwgeStzaGlwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuI2JvYXJkW2ldW3hdLnNoaXAgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGFzc2VkIFwib3JpZW50YXRpb25cIiEgKFdoZW4gY2hlY2tpbmcgZm9yIHZhbGlkIHNoaXAgcGxhY2VtZW50KScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwbGFjZVNoaXAoeCwgeSwgc2hpcCwgb3JpZW50YXRpb24pIHtcclxuICAgICAgICAvLyBjaGVjayBpZiBzaGlwIGZpdHMgdGhlIGJvYXJkIChiYXNlZCBvbiBvcmllbnRhdGlvbilcclxuICAgICAgICBzd2l0Y2ggKG9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgY2FzZSAneCc6XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYW5QbGFjZVNoaXAoeCwgeSwgc2hpcCwgb3JpZW50YXRpb24pKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Fub3RoZXIgc2hpcCBpcyBpbiBwYXRoIG9mIHNoaXAgcGxhY2VtZW50ISAoaG9yaXpvbnRhbGx5KScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh4ID49IDAgJiYgeCtzaGlwLmxlbmd0aCA8PSB0aGlzLiN3aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlICcjYm9hcmQnIHRpbGVzIG9uIHRoZSBob3Jpem9udGFsXHJcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgPSB4OyBpIDwgeCtzaGlwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4jYm9hcmRbeV1baV0gPSB7c2hpcDogc2hpcCwgaXNIaXQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHNoaXAub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcclxuICAgICAgICAgICAgICAgIC8vIGFkZCBzaGlwIGNvb3JkaW5hdGVzIHRvIGEgbGlzdCB0aGF0IHRyYWNrcyBhbGwgb2YgdGhlbVxyXG4gICAgICAgICAgICAgICAgdGhpcy4jc2hpcHNPbkJvYXJkW3NoaXAubmFtZV0gPSB7IFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WDogeCArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kWDogeCArIHNoaXAubGVuZ3RoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFk6IHkgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZFk6IHkgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yaWVudGF0aW9uOiBvcmllbnRhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBsZW5ndGg6IHNoaXAubGVuZ3RoXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgZW5vdWdoIHJvb20gZm9yIHNoaXAgdG8gYmUgcGxhY2VkISAoaG9yaXpvbnRhbGx5KScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FuUGxhY2VTaGlwKHgsIHksIHNoaXAsIG9yaWVudGF0aW9uKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbm90aGVyIHNoaXAgaXMgaW4gcGF0aCBvZiBzaGlwIHBsYWNlbWVudCEgKHZlcnRpY2FsbHkpJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkgPj0gMCAmJiB5K3NoaXAubGVuZ3RoIDw9IHRoaXMuI2hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlICcjYm9hcmQnIHRpbGVzIG9uIHRoZSB2ZXJ0aWNhbFxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0geTsgaSA8IHkrc2hpcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW2ldW3hdID0ge3NoaXA6IHNoaXAsIGlzSGl0OiBmYWxzZX07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzaGlwLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgc2hpcCBjb29yZGluYXRlcyB0byBhIGxpc3QgdGhhdCB0cmFja3MgYWxsIG9mIHRoZW1cclxuICAgICAgICAgICAgICAgIHRoaXMuI3NoaXBzT25Cb2FyZFtzaGlwLm5hbWVdID0geyBcclxuICAgICAgICAgICAgICAgICAgICBzdGFydFg6IHggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZFg6IHggKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0WTogeSArIDEsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5kWTogeSArIHNoaXAubGVuZ3RoICsgMSxcclxuICAgICAgICAgICAgICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgbGVuZ3RoOiBzaGlwLmxlbmd0aFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGVub3VnaCByb29tIGZvciBzaGlwIHRvIGJlIHBsYWNlZCEgKHZlcnRpY2FsbHkpJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG9yaWVudGF0aW9uIScpOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVjZWl2ZUF0dGFjayh4LCB5KSB7XHJcbiAgICAgICAgLy8gaWYgYWxyZWFkeSBzaG90IHRoaXMgdGlsZVxyXG4gICAgICAgIGlmICh0aGlzLiNib2FyZFt5XVt4XS5pc0hpdCkge1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiB0aGVyZSdzIGEgc2hpcCBvciBub3RcclxuICAgICAgICAgICAgaWYgKHRoaXMuI2JvYXJkW3ldW3hdLnNoaXAgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaWxlKGJsYW5rKSBhbHJlYWR5IHNob3QnKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy4jYm9hcmRbeV1beF0uc2hpcCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGlsZShzaGlwKSBhbHJlYWR5IHNob3QnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGlsZSh1bmtub3duKSBhbHJlYWR5IHNob3QnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgLy8gaWYgbm90IHNob3QsIHNob290IVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy4jYm9hcmRbeV1beF0uc2hpcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBub3QgYSBzaGlwLCBNSVNTRUQhXHJcbiAgICAgICAgICAgICAgICB0aGlzLiNib2FyZFt5XVt4XS5pc0hpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ21pc3MnO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLiNib2FyZFt5XVt4XS5zaGlwID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgLy8gYSBzaGlwLCBISVQhXHJcbiAgICAgICAgICAgICAgICB0aGlzLiNib2FyZFt5XVt4XS5pc0hpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiNib2FyZFt5XVt4XS5zaGlwLmhpdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICdoaXQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVNoaXAoeCwgeSwgc2hpcCwgb3JpZW50YXRpb24pIHtcclxuICAgICAgICBzd2l0Y2ggKG9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0geDsgaSA8IHgrc2hpcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW3ldW2ldID0geyBzaGlwOiB1bmRlZmluZWQsIGlzSGl0OiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3knOlxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCBpID0geTsgaSA8IHkrc2hpcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuI2JvYXJkW2ldW3hdID0geyBzaGlwOiB1bmRlZmluZWQsIGlzSGl0OiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcGFzc2VkIFwib3JpZW50YXRpb25cIiEgKFdoZW4gcmVtb3ZpbmcgYSBzaGlwKScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCB7IFNoaXBEcmFnSGFuZGxlciB9IGZyb20gXCIuL3NoaXBEcmFnSGFuZGxlclwiO1xyXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4vdXNlci5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBsYXllciBleHRlbmRzIFVzZXIge1xyXG4gICAgI2dhbWVib2FyZDtcclxuICAgICNzaGlwcztcclxuICAgICNzdW5rZW5PcHBvbmVudFNoaXBzID0gMDtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoZ2FtZWJvYXJkLCBzaGlwcykge1xyXG4gICAgICAgIHN1cGVyKGdhbWVib2FyZCwgc2hpcHMpO1xyXG4gICAgICAgIHRoaXMuI3NoaXBzID0gc2hpcHM7XHJcbiAgICAgICAgdGhpcy4jZ2FtZWJvYXJkID0gZ2FtZWJvYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjayhjb21wdXRlck9iaiwgdGlsZUluZGV4KSB7XHJcbiAgICAgICAgbGV0IHggPSB0aWxlSW5kZXggJSB0aGlzLiNnYW1lYm9hcmQud2lkdGg7XHJcbiAgICAgICAgbGV0IHkgPSBNYXRoLmZsb29yKHRpbGVJbmRleCAvIHRoaXMuI2dhbWVib2FyZC5oZWlnaHQpO1xyXG4gICAgICAgIGNvbnN0IGF0dGFjayA9IGNvbXB1dGVyT2JqLmdhbWVib2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xyXG5cclxuICAgICAgICAvLyBhZGQgaGl0IGVmZmVjdFxyXG4gICAgICAgIGNvbnN0IGF0dGFja0VmZmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGF0dGFja0VmZmVjdC5jbGFzc0xpc3QuYWRkKGF0dGFjayk7XHJcbiAgICAgICAgY29uc3QgY29tcHV0ZXJHYkhUTUwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuQ29tcHV0ZXIgI2dhbWVib2FyZCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHBsYXllclRpbGVzID0gY29tcHV0ZXJHYkhUTUwucXVlcnlTZWxlY3RvckFsbCgnW2lkPXRpbGVdJyk7XHJcbiAgICAgICAgcGxheWVyVGlsZXNbeCt5KnRoaXMuI2dhbWVib2FyZC53aWR0aF0uYXBwZW5kQ2hpbGQoYXR0YWNrRWZmZWN0KTtcclxuXHJcbiAgICAgICAgY29uc3QgY29tcHV0ZXJHYk9iaiA9IGNvbXB1dGVyT2JqLmdhbWVib2FyZDtcclxuICAgICAgICBpZiAoYXR0YWNrID09PSAnaGl0Jykge1xyXG5cclxuICAgICAgICAgICAgaWYgKGNvbXB1dGVyR2JPYmouYm9hcmRbeV1beF0uc2hpcC5pc1N1bmsoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4jc3Vua2VuT3Bwb25lbnRTaGlwcysrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXBOYW1lID0gY29tcHV0ZXJHYk9iai5ib2FyZFt5XVt4XS5zaGlwLm5hbWU7XHJcbiAgICAgICAgICAgICAgICAvLyBkaXNwbGF5IGl0XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3VuaycsIHNoaXBOYW1lKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gbWFrZSB0aGUgc2hpcCBhcHBlYXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhcnRYLCBlbmRYLCBzdGFydFksIGVuZFkgfSA9IGNvbXB1dGVyR2JPYmouc2hpcHNPbkJvYXJkW3NoaXBOYW1lXTtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgc2hpcC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ3NoaXAnKTtcclxuICAgICAgICAgICAgICAgIHNoaXAuc2V0QXR0cmlidXRlKCduYW1lJywgc2hpcE5hbWUpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBzaGlwIHBvc2l0aW9uIG9uIGdhbWVib2FyZCBncmlkICh1c2luZyBhcmVhKVxyXG4gICAgICAgICAgICAgICAgc2hpcC5zdHlsZS5ncmlkUm93U3RhcnQgPSBzdGFydFk7XHJcbiAgICAgICAgICAgICAgICBzaGlwLnN0eWxlLmdyaWRDb2x1bW5TdGFydCA9IHN0YXJ0WDtcclxuICAgICAgICAgICAgICAgIHNoaXAuc3R5bGUuZ3JpZFJvd0VuZCA9IGVuZFk7XHJcbiAgICAgICAgICAgICAgICBzaGlwLnN0eWxlLmdyaWRDb2x1bW5FbmQgPSBlbmRYO1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZXJHYkhUTUwuYXBwZW5kQ2hpbGQoc2hpcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRSaXBwbGVFZmZlY3Qoc2hpcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNoYW5nZSB0dXJuXHJcbiAgICAgICAgUGxheWVyLnNldFBsYXllclR1cm4oZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRGVmZWF0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuI3N1bmtlbk9wcG9uZW50U2hpcHMgPT09IHRoaXMuI3NoaXBzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRSYW5kb21pemVTaGlwc0J1dHRvbigpIHtcclxuICAgICAgICBjb25zdCBHQiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5QbGF5ZXIgI2dhbWVib2FyZGApO1xyXG4gICAgICAgIC8vIGdldCBSQU5ET01JWkUgU0hJUFMgQlVUVE9OXHJcbiAgICAgICAgY29uc3QgUmFuZG9taXplU2hpcHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmFuZG9taXplLWJ1dHRvbicpO1xyXG5cclxuICAgICAgICAvLyBhbGxvdyBkcmFnL2Ryb3AgZm9yIGdhbWVib2FyZFxyXG4gICAgICAgIGNvbnN0IGRyYWdPYmogPSBuZXcgU2hpcERyYWdIYW5kbGVyKHRoaXMuI2dhbWVib2FyZCk7XHJcblxyXG4gICAgICAgIFJhbmRvbWl6ZVNoaXBzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbWx5U2V0U2hpcHMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJFTU9WRSBBTEwgU0hJUFMgZnJvbSBwcmV2aW91cyBib2FyZFxyXG4gICAgICAgICAgICBsZXQgc2hpcHNUb0RlbGV0ZSA9IEdCLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZD1zaGlwXScpO1xyXG4gICAgICAgICAgICBzaGlwc1RvRGVsZXRlLmZvckVhY2goc2hpcCA9PiB7XHJcbiAgICAgICAgICAgICAgICBHQi5yZW1vdmVDaGlsZChzaGlwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBREQgU0hJUFMgdG8gdGhlIGdhbWVib2FyZFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtzaGlwTmFtZSwgc2hpcERhdGFdIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuI2dhbWVib2FyZC5zaGlwc09uQm9hcmQpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IHN0YXJ0WCwgZW5kWCwgc3RhcnRZLCBlbmRZIH0gPSBzaGlwRGF0YTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIHNoaXAuc2V0QXR0cmlidXRlKCdpZCcsICdzaGlwJyk7XHJcbiAgICAgICAgICAgICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnbmFtZScsIHNoaXBOYW1lKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgc2hpcCBwb3NpdGlvbiBvbiBnYW1lYm9hcmQgZ3JpZCAodXNpbmcgYXJlYSlcclxuICAgICAgICAgICAgICAgIHNoaXAuc3R5bGUuZ3JpZFJvd1N0YXJ0ID0gc3RhcnRZO1xyXG4gICAgICAgICAgICAgICAgc2hpcC5zdHlsZS5ncmlkQ29sdW1uU3RhcnQgPSBzdGFydFg7XHJcbiAgICAgICAgICAgICAgICBzaGlwLnN0eWxlLmdyaWRSb3dFbmQgPSBlbmRZO1xyXG4gICAgICAgICAgICAgICAgc2hpcC5zdHlsZS5ncmlkQ29sdW1uRW5kID0gZW5kWDtcclxuICAgICAgICBcclxuICAgICAgICAgICAgICAgIEdCLmFwcGVuZENoaWxkKHNoaXApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGFsbG93IGRyYWdnaW5nIGZvciBlYWNoIHNoaXBcclxuICAgICAgICAgICAgICAgIGRyYWdPYmouYWxsb3dTaGlwRHJhZ2dpbmcoc2hpcCk7XHJcbiAgICAgICAgICAgICAgICAvLyB3aGVuIGdhbWUgaXMgc3RhcnRlZCAtIHJlbW92ZSBkcmFnZ2luZyBmb3IgZWFjaCBzaGlwXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdnYW1lUHJlcGFyZWQnLCAoKSA9PiBkcmFnT2JqLnJlbW92ZVNoaXBEcmFnZ2luZyhzaGlwKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIERpc3BhdGNoIGN1c3RvbSBldmVudCBhZnRlciBzaGlwcyBhcmUgcmFuZG9taXplZFxyXG4gICAgICAgICAgICBkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnc2hpcHNSYW5kb21pemVkJywgeyBkZXRhaWw6IHsgdHlwZTogJ1BsYXllcicgfSB9KSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgU2hpcCB7XHJcbiAgICAjbmFtZTtcclxuICAgICNsZW5ndGg7XHJcbiAgICAjaGl0cztcclxuICAgICNvcmllbnRhdGlvbjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IobmFtZSwgbGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKGxlbmd0aCA8IDEgfHwgbGVuZ3RoID4gNSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc2hpcCBsZW5ndGghJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiNuYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLiNsZW5ndGggPSBsZW5ndGg7XHJcbiAgICAgICAgdGhpcy4jaGl0cyA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5hbWUoKSB7IHJldHVybiB0aGlzLiNuYW1lOyB9XHJcbiAgICBnZXQgbGVuZ3RoKCkgeyByZXR1cm4gdGhpcy4jbGVuZ3RoOyB9XHJcbiAgICBnZXQgaGl0cygpIHsgcmV0dXJuIHRoaXMuI2hpdHM7IH1cclxuICAgIGdldCBvcmllbnRhdGlvbigpIHsgcmV0dXJuIHRoaXMuI29yaWVudGF0aW9uOyB9XHJcbiAgICAvLyB3aGVuIGNoYW5naW5nIHNoaXAncyBwb3NpdGlvbiwgYWxsb3cgdG8gY2hhbmdlIGl0J3Mgb3JpZW50YXRpb25cclxuICAgIHNldCBvcmllbnRhdGlvbihuZXdPcmllbnRhdGlvbikgeyB0aGlzLiNvcmllbnRhdGlvbiA9IG5ld09yaWVudGF0aW9uOyB9XHJcblxyXG4gICAgaGl0KCkge1xyXG4gICAgICAgIHRoaXMuI2hpdHMrKzsgXHJcbiAgICB9XHJcblxyXG4gICAgaXNTdW5rKCkge1xyXG4gICAgICAgIGlmICh0aGlzLiNsZW5ndGggPT09IHRoaXMuI2hpdHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBTaGlwRHJhZ0hhbmRsZXIge1xyXG4gICAgI2V2ZW50TGlzdGVuZXJzID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2FtZWJvYXJkKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lYm9hcmRPYmogPSBnYW1lYm9hcmQ7XHJcbiAgICAgICAgdGhpcy5nYW1lYm9hcmRFbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLlBsYXllciAjZ2FtZWJvYXJkJyk7XHJcbiAgICAgICAgdGhpcy5zdGFydFNoaXAgPSBudWxsOyAvLyBUbyBrZWVwIHRyYWNrIG9mIHRoZSBzaGlwJ3Mgc3RhcnRpbmcgZGF0YVxyXG4gICAgICAgIHRoaXMuY3VycmVudFNoaXAgPSBudWxsOyAvLyBUbyBrZWVwIHRyYWNrIG9mIHRoZSBzaGlwIGJlaW5nIGRyYWdnZWRcclxuICAgICAgICB0aGlzLm9mZnNldCA9IHsgeDogMCwgeTogMCB9OyAvLyBUbyBzdG9yZSB0aGUgZHJhZyBvZmZzZXRcclxuXHJcbiAgICAgICAgLy8gRGVza3RvcCBzdXBwb3J0XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHRoaXMuZ2FtZWJvYXJkRWxlbWVudCwgJ2RyYWdvdmVyJywgKGUpID0+IHRoaXMuI2RyYWdPdmVyKGUpKTtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIodGhpcy5nYW1lYm9hcmRFbGVtZW50LCAnZHJvcCcsIChlKSA9PiB0aGlzLiNkcm9wKGUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBvdmVycmlkZSBhZGRFdmVudExpc3RlbmVyXHJcbiAgICBhZGRFdmVudExpc3RlbmVyKGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIpIHtcclxuICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy4jZXZlbnRMaXN0ZW5lcnMucHVzaCh7IGVsZW1lbnQsIHR5cGUsIGhhbmRsZXIgfSk7IC8vIHN0b3JlIHRoaXMgZXZlbnRMaXN0ZW5lclxyXG4gICAgfVxyXG5cclxuICAgIGFsbG93U2hpcERyYWdnaW5nKHNoaXApIHtcclxuICAgICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnZHJhZ2dhYmxlJywgJ3RydWUnKTtcclxuICAgICAgICAvLyBEZXNrdG9wIHN1cHBvcnRcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoc2hpcCwgJ2RyYWdzdGFydCcsIChlKSA9PiB0aGlzLiNkcmFnU3RhcnQoZSwgc2hpcCkpO1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihzaGlwLCAnZHJhZ2VuZCcsICgpID0+IHRoaXMuI2RyYWdFbmQoKSk7XHJcbiAgICAgICAgLy8gTW9iaWxlIHN1cHBvcnRcclxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoc2hpcCwgJ3RvdWNoc3RhcnQnLCAoZSkgPT4gdGhpcy4jdG91Y2hTdGFydChlLCBzaGlwKSk7XHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKHNoaXAsICd0b3VjaGVuZCcsICgpID0+IHRoaXMuI3RvdWNoRW5kKCkpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVNoaXBEcmFnZ2luZyhzaGlwKSB7XHJcbiAgICAgICAgc2hpcC5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICdmYWxzZScpO1xyXG5cclxuICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycyBhc3NvY2lhdGVkIHdpdGggdGhlIHNoaXAgYW5kIGdhbWVib2FyZFxyXG4gICAgICAgIHRoaXMuI2V2ZW50TGlzdGVuZXJzID0gdGhpcy4jZXZlbnRMaXN0ZW5lcnMuZmlsdGVyKGxpc3RlbmVyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXNTaGlwTGlzdGVuZXIgPSBsaXN0ZW5lci5lbGVtZW50ID09PSBzaGlwO1xyXG4gICAgICAgICAgICBjb25zdCBpc0dhbWVib2FyZExpc3RlbmVyID0gbGlzdGVuZXIuZWxlbWVudCA9PT0gdGhpcy5nYW1lYm9hcmRFbGVtZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzU2hpcExpc3RlbmVyIHx8IGlzR2FtZWJvYXJkTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgbGlzdGVuZXJcclxuICAgICAgICAgICAgICAgIGxpc3RlbmVyLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihsaXN0ZW5lci50eXBlLCBsaXN0ZW5lci5oYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gUmVtb3ZlIHRoaXMgbGlzdGVuZXIgZnJvbSB0aGUgYXJyYXlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gS2VlcCB0aGlzIGxpc3RlbmVyXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogREVTS1RPUCBTVVBQT1JUICovXHJcblxyXG4gICAgI2RyYWdTdGFydChlLCBzaGlwKSB7XHJcbiAgICAgICAgdGhpcy5zdGFydFNoaXAgPSBzaGlwLmNsb25lTm9kZShmYWxzZSk7IC8vIHN0b3JlIHRoZSBzaGlwJ3Mgc3RhcnRpbmcgcG9zaXRpb25cclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwID0gc2hpcDtcclxuXHJcbiAgICAgICAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dC9wbGFpbicsIHNoaXAuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgICNkcmFnRW5kKCkge1xyXG4gICAgICAgIC8vIFJlc2V0IG9mZnNldCAoc28gdGhhdCBuZXh0IGNsaWNrIGhhcyBuZXcgb2Zmc2V0KVxyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHNoaXAgcmVmZXJlbmNlc1xyXG4gICAgICAgIHRoaXMuc3RhcnRTaGlwID0gbnVsbDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAjZHJhZ092ZXIoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCBkZWZhdWx0IHRvIGFsbG93IGRyb3BwaW5nXHJcbiAgICB9XHJcblxyXG4gICAgI2Ryb3AoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCBkZWZhdWx0IGJlaGF2aW9yXHJcblxyXG4gICAgICAgIGNvbnN0IGRyb3BQb3NpdGlvbiA9IHRoaXMuI2dldERyb3BQb3NpdGlvbihlKTtcclxuICAgICAgICB0aGlzLiNwbGFjZVNoaXAoZHJvcFBvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBNT0JJTEUgU1VQUE9SVCAqL1xyXG5cclxuICAgICN0b3VjaFN0YXJ0KGUsIHNoaXApIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdGhpcy5zdGFydFNoaXAgPSBzaGlwLmNsb25lTm9kZShmYWxzZSk7IC8vIHN0b3JlIHRoZSBzaGlwJ3Mgc3RhcnRpbmcgcG9zaXRpb25cclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwID0gc2hpcDsgLy8gcGFzcyBieSByZWZlcmVuY2UgdG8gY3VycmVudFNoaXBcclxuICAgICAgICBcclxuICAgICAgICAvLyBDYWxjdWxhdGUgdGhlIG9mZnNldCBvZiB0aGUgbW91c2UgcG9pbnRlciByZWxhdGl2ZSB0byB0aGUgc2hpcCdzIHRvcC1sZWZ0IGNvcm5lclxyXG4gICAgICAgIGNvbnN0IHRvdWNoID0gZS50YXJnZXRUb3VjaGVzWzBdO1xyXG4gICAgICAgIGNvbnN0IHNoaXBSZWN0ID0gdGhpcy5jdXJyZW50U2hpcC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB0aGlzLm9mZnNldCA9IHtcclxuICAgICAgICAgICAgeDogdG91Y2guY2xpZW50WCAtIHdpbmRvdy5zY3JvbGxZIC0gc2hpcFJlY3QubGVmdCxcclxuICAgICAgICAgICAgeTogdG91Y2guY2xpZW50WSAtIHdpbmRvdy5zY3JvbGxZIC0gc2hpcFJlY3QudG9wXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2hpcC5zdHlsZS53aWR0aCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHNoaXApLmdldFByb3BlcnR5VmFsdWUoJ3dpZHRoJyk7XHJcbiAgICAgICAgc2hpcC5zdHlsZS5oZWlnaHQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShzaGlwKS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKTtcclxuICAgICAgICBzaGlwLnN0eWxlLmdyaWRBcmVhID0gJyc7IC8vIHJlbW92ZSB0aGUgZ3JpZC1hcmVhIHRvIGFsbG93IGNhbGN1bGF0aW5nIHRoZSBuZXcgcG9zaXRpb25cclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHNoaXAgc3RhcnRpbmcgcG9zaXRpb24gc28gdGhhdCBpdCBkb2VzbnQgYXBwZWFyIGluIHRvcCBsZWZ0IGNvcm5lclxyXG4gICAgICAgIGNvbnN0IGdhbWVib2FyZFJlY3QgPSB0aGlzLmdhbWVib2FyZEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2hpcC5zdHlsZS5sZWZ0ID0gYCR7dG91Y2guY2xpZW50WCAtIGdhbWVib2FyZFJlY3QubGVmdCAtIHRoaXMub2Zmc2V0Lnh9cHhgO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNoaXAuc3R5bGUudG9wID0gYCR7dG91Y2guY2xpZW50WSAtIGdhbWVib2FyZFJlY3QudG9wIC0gdGhpcy5vZmZzZXQueX1weGA7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZWJvYXJkRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCAoZSkgPT4gdGhpcy4jdG91Y2hEcmFnKGUpLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICN0b3VjaERyYWcoZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTaGlwKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdhbWVib2FyZFJlY3QgID0gdGhpcy5nYW1lYm9hcmRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IGUudGFyZ2V0VG91Y2hlc1swXTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U2hpcC5zdHlsZS5sZWZ0ID0gYCR7dG91Y2guY2xpZW50WCAtIGdhbWVib2FyZFJlY3QubGVmdCAtIHRoaXMub2Zmc2V0Lnh9cHhgO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLnRvcCA9IGAke3RvdWNoLmNsaWVudFkgLSBnYW1lYm9hcmRSZWN0LnRvcCAtIHRoaXMub2Zmc2V0Lnl9cHhgO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAjdG91Y2hFbmQoKSB7XHJcbiAgICAgICAgY29uc3QgZHJvcFBvc2l0aW9uID0gdGhpcy4jZ2V0RHJvcFBvc2l0aW9uVG91Y2goKTtcclxuICAgICAgICB0aGlzLiNwbGFjZVNoaXAoZHJvcFBvc2l0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5nYW1lYm9hcmRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChlKSA9PiB0aGlzLiN0b3VjaERyYWcoZSkpO1xyXG4gICAgICAgIC8vIFJlc2V0IG9mZnNldCAoc28gdGhhdCBuZXh0IGNsaWNrIGhhcyBuZXcgb2Zmc2V0KVxyXG4gICAgICAgIHRoaXMub2Zmc2V0ID0geyB4OiAwLCB5OiAwIH07XHJcbiAgICAgICAgLy8gQ2xlYXIgdGhlIHNoaXAgcmVmZXJlbmNlc1xyXG4gICAgICAgIHRoaXMuc3RhcnRTaGlwID0gbnVsbDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKiBPVEhFUiBGVU5DVElPTlMgKi9cclxuXHJcbiAgICAvLyBEZXNrdG9wXHJcbiAgICAjZ2V0RHJvcFBvc2l0aW9uKGUpIHtcclxuICAgICAgICBjb25zdCBnYW1lYm9hcmRSZWN0ID0gdGhpcy5nYW1lYm9hcmRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGNlbGxXaWR0aCA9IGdhbWVib2FyZFJlY3Qud2lkdGggLyB0aGlzLmdhbWVib2FyZE9iai53aWR0aDtcclxuICAgICAgICBjb25zdCBjZWxsSGVpZ2h0ID0gZ2FtZWJvYXJkUmVjdC5oZWlnaHQgLyB0aGlzLmdhbWVib2FyZE9iai5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHhQb3MgPSBNYXRoLmZsb29yKChlLmNsaWVudFggLSBnYW1lYm9hcmRSZWN0LmxlZnQpIC8gY2VsbFdpZHRoKTtcclxuICAgICAgICBjb25zdCB5UG9zID0gTWF0aC5mbG9vcigoZS5jbGllbnRZIC0gZ2FtZWJvYXJkUmVjdC50b3ApIC8gY2VsbEhlaWdodCk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IHg6IHhQb3MsIHk6IHlQb3MgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBNb2JpbGVcclxuICAgICNnZXREcm9wUG9zaXRpb25Ub3VjaCgpIHtcclxuICAgICAgICBjb25zdCBnYW1lYm9hcmRSZWN0ID0gdGhpcy5nYW1lYm9hcmRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGNlbGxXaWR0aCA9IGdhbWVib2FyZFJlY3Qud2lkdGggLyB0aGlzLmdhbWVib2FyZE9iai53aWR0aDtcclxuICAgICAgICBjb25zdCBjZWxsSGVpZ2h0ID0gZ2FtZWJvYXJkUmVjdC5oZWlnaHQgLyB0aGlzLmdhbWVib2FyZE9iai5oZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIGNhbGN1bGF0ZSBjdXJyZW50IHNoaXAgcG9zaXRpb25cclxuICAgICAgICAvLyBjdXJyZW50U2hpcC5zdHlsZS50b3AvbGVmdCB0byB0YWtlIGxlZnQgdXBwZXIgY29ybmVyIG9mIHNoaXBcclxuICAgICAgICAvLyBhZGQgY2VsbFdpZHRoL0hlaWdodCB0byB0YWtlIHRoZSBjZW50ZXIgb2YgbGVmdCBzaGlwIGNvcm5lclxyXG4gICAgICAgIGNvbnN0IHhQb3MgPSBNYXRoLmZsb29yKChwYXJzZUZsb2F0KHRoaXMuY3VycmVudFNoaXAuc3R5bGUubGVmdCkgKyBjZWxsV2lkdGgvMikgLyBjZWxsV2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IHlQb3MgPSBNYXRoLmZsb29yKChwYXJzZUZsb2F0KHRoaXMuY3VycmVudFNoaXAuc3R5bGUudG9wKSArIGNlbGxIZWlnaHQvMikgLyBjZWxsSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgeDogeFBvcywgeTogeVBvcyB9O1xyXG4gICAgfVxyXG5cclxuICAgICNwbGFjZVNoaXAoZHJvcFBvc2l0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuI2lzVmFsaWREcm9wKHRoaXMuY3VycmVudFNoaXAsIGRyb3BQb3NpdGlvbikpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJldlggPSB0aGlzLnN0YXJ0U2hpcC5zdHlsZS5ncmlkQ29sdW1uU3RhcnQgLSAxO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2WSA9IHRoaXMuc3RhcnRTaGlwLnN0eWxlLmdyaWRSb3dTdGFydCAtIDE7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoaXBPYmogPSB0aGlzLmdhbWVib2FyZE9iai5ib2FyZFtwcmV2WV1bcHJldlhdLnNoaXA7IC8vIEdldCAnc2hpcCcgb2JqZWN0IGZyb20gcHJldmlvdXMgcG9zaXRpb25cclxuICAgICAgICAgICAgY29uc3QgcHJldk9yaWVudGF0aW9uID0gc2hpcE9iai5vcmllbnRhdGlvbjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuI3BsYWNlU2hpcFZpc3VhbGx5KGRyb3BQb3NpdGlvbiwgc2hpcE9iaik7XHJcblxyXG4gICAgICAgICAgICAvKiBBZHJlc3MgdGhlIHNoaXAgcG9zaXRpb24gY2hhbmdlcyAqL1xyXG4gICAgICAgICAgICBjb25zdCBuZXdYID0gZHJvcFBvc2l0aW9uLng7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1kgPSBkcm9wUG9zaXRpb24ueTtcclxuICAgICAgICAgICAgY29uc3QgbmV3T3JpZW50YXRpb24gPSBzaGlwT2JqLm9yaWVudGF0aW9uO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gUmVmcmVzaCBnYW1lYm9hcmQuYm9hcmRcclxuICAgICAgICAgICAgdGhpcy5nYW1lYm9hcmRPYmoucmVtb3ZlU2hpcChwcmV2WCwgcHJldlksIHNoaXBPYmosIHByZXZPcmllbnRhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZWJvYXJkT2JqLnBsYWNlU2hpcChuZXdYLCBuZXdZLCBzaGlwT2JqLCBuZXdPcmllbnRhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZWJvYXJkT2JqLnByaW50Qm9hcmQoKTsgLy8gRGVidWdcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSW52YWxpZCBkcm9wIHBvc2l0aW9uJyk7IC8vIEhhbmRsZSBpbnZhbGlkIGRyb3BcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTG9naWMgdG8gdmlzdWFsbHkgcGxhY2UgdGhlIHNoaXAgb24gdGhlIGdhbWVib2FyZFxyXG4gICAgI3BsYWNlU2hpcFZpc3VhbGx5KGRyb3BQb3NpdGlvbiwgc2hpcE9iaikge1xyXG4gICAgICAgIGNvbnN0IHNoaXBTaXplID0gc2hpcE9iai5sZW5ndGg7XHJcbiAgICAgICAgY29uc3Qgc2hpcE9yaWVudGF0aW9uID0gc2hpcE9iai5vcmllbnRhdGlvbjtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHByZXZpb3VzICd3aWR0aCcsICdoZWlnaHQnIHRvIGFsbG93IGdyaWQgc25hcHBpbmdcclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLndpZHRoID0gJyc7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2hpcC5zdHlsZS5oZWlnaHQgPSAnJztcclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLmxlZnQgPSAnJztcclxuICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLnRvcCA9ICcnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaChzaGlwT3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgY2FzZSAneCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLmdyaWRSb3dTdGFydCA9IGRyb3BQb3NpdGlvbi55ICsgMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNoaXAuc3R5bGUuZ3JpZFJvd0VuZCA9IGRyb3BQb3NpdGlvbi55ICsgMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNoaXAuc3R5bGUuZ3JpZENvbHVtblN0YXJ0ID0gZHJvcFBvc2l0aW9uLnggKyAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2hpcC5zdHlsZS5ncmlkQ29sdW1uRW5kID0gZHJvcFBvc2l0aW9uLnggKyBzaGlwU2l6ZSArIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAneSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLmdyaWRSb3dTdGFydCA9IGRyb3BQb3NpdGlvbi55ICsgMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFNoaXAuc3R5bGUuZ3JpZFJvd0VuZCA9IGRyb3BQb3NpdGlvbi55ICsgc2hpcFNpemUgKyAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2hpcC5zdHlsZS5ncmlkQ29sdW1uU3RhcnQgPSBkcm9wUG9zaXRpb24ueCArIDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTaGlwLnN0eWxlLmdyaWRDb2x1bW5FbmQgPSBkcm9wUG9zaXRpb24ueCArIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgI2lzVmFsaWREcm9wKHNoaXAsIGRyb3BQb3NpdGlvbikge1xyXG4gICAgICAgIC8vIEltcGxlbWVudCBsb2dpYyB0byBjaGVjayBpZiB0aGUgc2hpcCBjYW4gYmUgcGxhY2VkIGF0IGRyb3BQb3NpdGlvblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBhcmVhIG9jY3VwaWVkIGJ5IHRoZSBzaGlwIGlzIGZyZWUsIGNvbnNpZGVyaW5nIGl0cyBzaXplIGFuZCBvcmllbnRhdGlvblxyXG4gICAgICAgIC8vIFJldHVybiB0cnVlIGlmIHZhbGlkLCBmYWxzZSBvdGhlcndpc2VcclxuICAgICAgICByZXR1cm4gdHJ1ZTsgLy8gUmVwbGFjZSB3aXRoIGFjdHVhbCB2YWxpZGF0aW9uIGxvZ2ljXHJcbiAgICB9XHJcbn1cclxuIiwiLy8gQWJzdHJhY3QgY2xhc3MgVXNlclxyXG4vLyBTdWJjbGFzc2VzOiBQbGF5ZXIsIENvbXB1dGVyXHJcbmV4cG9ydCBjbGFzcyBVc2VyIHtcclxuICAgICNnYW1lYm9hcmQ7XHJcbiAgICAjc2hpcHM7XHJcbiAgICBzdGF0aWMgI3BsYXllclR1cm47XHJcbiAgICAjcmlwcGxlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGdhbWVib2FyZCwgc2hpcHMpIHtcclxuICAgICAgICBpZih0aGlzLmNvbnN0cnVjdG9yID09IFVzZXIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2xhc3MgaXMgb2YgYWJzdHJhY3QgdHlwZSBhbmQgY2FuJ3QgYmUgaW5zdGFudGlhdGVkXCIpO1xyXG4gICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuI2dhbWVib2FyZCA9IGdhbWVib2FyZDtcclxuICAgICAgICB0aGlzLiNzaGlwcyA9IHNoaXBzO1xyXG4gICAgICAgIFVzZXIuc3Vua2VuT3Bwb25lbnRTaGlwcyA9IDA7XHJcblxyXG4gICAgICAgIC8vIGdlbmVyYXRlIHJpcHBsZSBlZmZlY3QgdG8gYXBwbHkgdG8gc3Vua2VuIHNoaXBzXHJcbiAgICAgICAgdGhpcy4jcmlwcGxlID0gdGhpcy4jZ2V0UmlwcGxlU3BhbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBnYW1lYm9hcmQoKSB7IHJldHVybiB0aGlzLiNnYW1lYm9hcmQ7IH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0UGxheWVyVHVybigpIHtcclxuICAgICAgICByZXR1cm4gVXNlci4jcGxheWVyVHVybjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0UGxheWVyVHVybih0dXJuKSB7XHJcbiAgICAgICAgVXNlci4jcGxheWVyVHVybiA9IHR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEdhbWVib2FyZCgpIHtcclxuICAgICAgICBjb25zdCBHQiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke3RoaXMuY29uc3RydWN0b3IubmFtZX0gI2dhbWVib2FyZGApO1xyXG5cclxuICAgICAgICAvLyBjaGFuZ2UgZ2FtZWJvYXJkIGdyaWQgdG8gc3BlY2lmaWVkIHdpZHRoIGFuZCBoZWlnaHRcclxuICAgICAgICBHQi5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gYHJlcGVhdCgke3RoaXMuI2dhbWVib2FyZC53aWR0aH0sIDFmcilgO1xyXG4gICAgICAgIEdCLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KCR7dGhpcy4jZ2FtZWJvYXJkLmhlaWdodH0sIDFmcilgO1xyXG5cclxuICAgICAgICAvLyBhZGQgdGlsZXMgdG8gZ2FtZWJvYXJkIGdyaWRcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMuI2dhbWVib2FyZC5oZWlnaHQ7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMuI2dhbWVib2FyZC53aWR0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0aWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICB0aWxlLnNldEF0dHJpYnV0ZSgnaWQnLCAndGlsZScpO1xyXG4gICAgICAgICAgICAgICAgR0IuYXBwZW5kQ2hpbGQodGlsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXR0YWNrKCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkF0dGFjayBtZXRob2QgbmVlZHMgdG8gYmUgZGVmaW5lZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBjaGVjayBpZiB1c2VyIHNhbmsgYWxsIG9wcG9uZW50J3Mgc2hpcHMgLSBlbmQgdGhlIGdhbWVcclxuICAgIGlzRGVmZWF0ZWQoKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaXNEZWZlYXRlZCBtZXRob2QgbmVlZHMgdG8gYmUgZGVmaW5lZFwiKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgI2dldFJpcHBsZVNwYW4oKSB7XHJcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSByaXBwbGUgZWxlbWVudCBpbnNpZGUgdGhlIGNvbnRhaW5lclxyXG4gICAgICAgIGNvbnN0IHJpcHBsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICByaXBwbGUuY2xhc3NMaXN0LmFkZCgncmlwcGxlJyk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBzaW11bGF0ZWQgc2hpcFxyXG4gICAgICAgIGNvbnN0IHNoaXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBzaGlwLnNldEF0dHJpYnV0ZSgnaWQnLCAnc2hpcCcpO1xyXG4gICAgICAgIHNoaXAuc3R5bGUud2lkdGggPSBzaGlwLnN0eWxlLmhlaWdodCA9ICcxcHgnO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEdldCBzaGlwIGdyYXlzY2FsZSBiYWNrZ3JvdW5kIGNvbG9yXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzaGlwKTtcclxuICAgICAgICBjb25zdCByZ2JNYXRjaCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHNoaXApLmJhY2tncm91bmRDb2xvci5tYXRjaCgvcmdiXFwoKFxcZCspLCAoXFxkKyksIChcXGQrKVxcKS8pO1xyXG4gICAgICAgIHNoaXAucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgIGlmIChyZ2JNYXRjaCkge1xyXG4gICAgICAgICAgICAvLyBQYXJzZSB0aGUgUkdCIHZhbHVlc1xyXG4gICAgICAgICAgICBjb25zdCByID0gcGFyc2VJbnQocmdiTWF0Y2hbMV0sIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgZyA9IHBhcnNlSW50KHJnYk1hdGNoWzJdLCAxMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSBwYXJzZUludChyZ2JNYXRjaFszXSwgMTApO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIGdyYXlzY2FsZSBieSBhdmVyYWdpbmcgUkdCIHZhbHVlc1xyXG4gICAgICAgICAgICBjb25zdCBncmF5ID0gTWF0aC5yb3VuZCgociArIGcgKyBiKSAvIDMpO1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBncmF5c2NhbGUgY29sb3Igc3RyaW5nIHdpdGggYWRqdXN0ZWQgb3BhY2l0eSBmb3IgdGhlIHJpcHBsZVxyXG4gICAgICAgICAgICBjb25zdCBncmF5c2NhbGVDb2xvciA9IGByZ2JhKCR7Z3JheX0sICR7Z3JheX0sICR7Z3JheX0sIDEpYDtcclxuICAgICAgICAgICAgcmlwcGxlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGdyYXlzY2FsZUNvbG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJpcHBsZTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRSaXBwbGVFZmZlY3Qoc2hpcCkge1xyXG4gICAgICAgIGNvbnN0IHJpcHBsZSA9IHRoaXMuI3JpcHBsZS5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgICAgIHNoaXAuYXBwZW5kQ2hpbGQocmlwcGxlKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRoZSBzaXplIG9mIHRoZSByaXBwbGUgdG8gY292ZXIgdGhlIHJpcHBsZUVmZmVjdCBjb250YWluZXJcclxuICAgICAgICBjb25zdCBtYXhEaW1lbnNpb24gPSBNYXRoLm1heChzaGlwLm9mZnNldFdpZHRoLCBzaGlwLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgcmlwcGxlLnN0eWxlLndpZHRoID0gcmlwcGxlLnN0eWxlLmhlaWdodCA9IG1heERpbWVuc2lvbiArICdweCc7XHJcblxyXG4gICAgICAgIC8vIENlbnRlciB0aGUgcmlwcGxlIGluIHRoZSBjb250YWluZXJcclxuICAgICAgICByaXBwbGUuc3R5bGUubGVmdCA9IGAkeyhzaGlwLm9mZnNldFdpZHRoIC0gbWF4RGltZW5zaW9uKSAvIDJ9cHhgO1xyXG4gICAgICAgIHJpcHBsZS5zdHlsZS50b3AgPSBgJHsoc2hpcC5vZmZzZXRIZWlnaHQgLSBtYXhEaW1lbnNpb24pIC8gMn1weGA7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gVHJpZ2dlciB0aGUgcmlwcGxlIGFuaW1hdGlvblxyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmlwcGxlLmNsYXNzTGlzdC5hZGQoJ2FuaW1hdGUnKSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmFuZG9tbHlTZXRTaGlwcygpIHtcclxuICAgICAgICB0aGlzLiNnYW1lYm9hcmQucmVzZXRCb2FyZCgpO1xyXG4gICAgICAgIC8vIFN0YXJ0IHRoZSBiYWNrdHJhY2tpbmcgcHJvY2VzcyB3aXRoIHRoZSBmaXJzdCBzaGlwXHJcbiAgICAgICAgbGV0IHNoaXBzRGF0YSA9IHRoaXMuI3NoaXBzO1xyXG4gICAgICAgIGlmICghdGhpcy4jcmFuZG9tbHlTZXRTaGlwc0JhY2t0cmFjayhzaGlwc0RhdGEsIDApKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHBsYWNlIGFsbCBzaGlwcyEnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy4jZ2FtZWJvYXJkLnByaW50Qm9hcmQoKTtcclxuICAgIH1cclxuXHJcbiAgICAjcmFuZG9tbHlTZXRTaGlwc0JhY2t0cmFjayhzaGlwc0RhdGEsIGluZGV4KSB7XHJcbiAgICAgICAgLy8gZW5kIGJhY2t0cmFja2luZyAoYWxsIHNoaXBzIHBsYWNlZClcclxuICAgICAgICBpZiAoaW5kZXggPT09IHNoaXBzRGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzaGlwID0gc2hpcHNEYXRhW2luZGV4XTtcclxuICAgICAgICBjb25zdCB2YWxpZFBvc2l0aW9ucyA9IHRoaXMuI2dldFZhbGlkUG9zaXRpb25zKHNoaXApO1xyXG5cclxuICAgICAgICAvLyBTaHVmZmxlIHRoZSB2YWxpZCBwb3NpdGlvbnMgdG8gaW50cm9kdWNlIHJhbmRvbW5lc3NcclxuICAgICAgICB0aGlzLiNzaHVmZmxlQXJyYXkodmFsaWRQb3NpdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBUcnkgZWFjaCB2YWxpZCBwb3NpdGlvblxyXG4gICAgICAgIGZvciAoY29uc3QgeyB4LCB5LCBvcmllbnRhdGlvbiB9IG9mIHZhbGlkUG9zaXRpb25zKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0cnkgdG8gcGxhY2UgdGhlIHNoaXBcclxuICAgICAgICAgICAgICAgIHRoaXMuI2dhbWVib2FyZC5wbGFjZVNoaXAoeCwgeSwgc2hpcCwgb3JpZW50YXRpb24pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBjYW4ndCBiZSBkb25lIHRoZW4gZ28gdG8gbmV4dCBpdGVyYXRpb25cclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZWN1cnNpdmVseSBwbGFjZSB0aGUgbmV4dCBzaGlwXHJcbiAgICAgICAgICAgIGlmICh0aGlzLiNyYW5kb21seVNldFNoaXBzQmFja3RyYWNrKHNoaXBzRGF0YSwgaW5kZXggKyAxKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHBsYWNpbmcgdGhlIG5leHQgc2hpcCBmYWlscywgcmVtb3ZlIHRoZSBjdXJyZW50IHNoaXAgKGJhY2t0cmFjaylcclxuICAgICAgICAgICAgdGhpcy4jZ2FtZWJvYXJkLnJlbW92ZVNoaXAoeCwgeSwgc2hpcCwgb3JpZW50YXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgICNnZXRWYWxpZFBvc2l0aW9ucyhzaGlwKSB7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLiNnYW1lYm9hcmQud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy4jZ2FtZWJvYXJkLmhlaWdodDtcclxuICAgICAgICBjb25zdCB2YWxpZFBvc2l0aW9ucyA9IFtdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgeSA9IDA7IHkgPCBoZWlnaHQ7IHkrKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IHggPSAwOyB4IDwgd2lkdGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHgrc2hpcC5sZW5ndGggPD0gd2lkdGggJiYgdGhpcy4jZ2FtZWJvYXJkLmNhblBsYWNlU2hpcCh4LCB5LCBzaGlwLCAneCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsaWRQb3NpdGlvbnMucHVzaCh7eCwgeSwgb3JpZW50YXRpb246ICd4J30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHkrc2hpcC5sZW5ndGggPD0gaGVpZ2h0ICYmIHRoaXMuI2dhbWVib2FyZC5jYW5QbGFjZVNoaXAoeCwgeSwgc2hpcCwgJ3knKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkUG9zaXRpb25zLnB1c2goe3gsIHksIG9yaWVudGF0aW9uOiAneSd9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsaWRQb3NpdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgI3NodWZmbGVBcnJheShhcnJheSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSBhcnJheS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICAgICAgW2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9yZXNldC5jc3MnO1xyXG5pbXBvcnQgJy4vc3R5bGUuY3NzJztcclxuXHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tICcuL3NjcmlwdHMvZ2FtZS5qcyc7XHJcblxyXG4oZnVuY3Rpb24gbWFpbigpIHtcclxuXHJcbiAgICB0cnkge1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplIFNoaXAgb2JqZWN0c1xyXG4gICAgICAgIGNvbnN0IHNoaXBzSW5pdGlhbCA9IHsnQmF0dGxlc2hpcCc6IDQsICdDcnVpc2VyJzogMywgJ1N1Ym1hcmluZSc6IDEsICdEZXN0cm95ZXInOiAyfTtcclxuXHJcbiAgICAgICAgbmV3IEdhbWUoc2hpcHNJbml0aWFsKTtcclxuXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgIH1cclxuXHJcbn0pKCk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9