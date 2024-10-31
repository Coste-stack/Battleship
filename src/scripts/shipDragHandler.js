export class ShipDragHandler {
    constructor(gameboard) {
        this.gameboardObj = gameboard;
        this.gameboardElement = document.querySelector('.Player #gameboard');
        this.currentShip = null; // To keep track of the ship being dragged
        this.offset = { x: 0, y: 0 }; // To store the drag offset

        // Desktop support
        this.gameboardElement.addEventListener('dragover', (e) => this.#dragOver(e));
        this.gameboardElement.addEventListener('drop', (e) => this.#drop(e));
    }

    allowShipDragging(ship) {
        ship.setAttribute('draggable', 'true');
        // Desktop support
        ship.addEventListener('dragstart', (e) => this.#dragStart(e, ship));
        ship.addEventListener('dragend', () => this.#dragEnd());
        // Mobile support
        ship.addEventListener('touchstart', (e) => this.#touchStart(e, ship));
        ship.addEventListener('touchend', () => this.#touchEnd());
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
        if (this.#isValidDrop(this.currentShip, dropPosition)) {
            // Get 'ship' object from previous position
            const prevX = this.startShip.style.gridColumnStart - 1;
            const prevY = this.startShip.style.gridRowStart - 1;

            const shipObj = this.gameboardObj.board[prevY][prevX].ship;
            this.#placeShip(dropPosition, shipObj);
        } else {
            console.log('Invalid drop position'); // Handle invalid drop
        }
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
        if (this.#isValidDrop(this.currentShip, dropPosition)) {

            const prevX = this.startShip.style.gridColumnStart - 1;
            const prevY = this.startShip.style.gridRowStart - 1;
            const shipObj = this.gameboardObj.board[prevY][prevX].ship; // Get 'ship' object from previous position
            const prevOrientation = shipObj.orientation;

            this.#placeShip(dropPosition, shipObj);

            /* Adress the ship position changes */
            const newX = dropPosition.x;
            const newY = dropPosition.y;
            const newOrientation = shipObj.orientation;
            
            // Refresh gameboard.board
            this.gameboardObj.removeShip(prevX, prevY, shipObj, prevOrientation);
            this.gameboardObj.placeShip(newY, newX, shipObj, newOrientation);
            this.gameboardObj.printBoard(); // Debug
        } else {
            console.log('Invalid drop position'); // Handle invalid drop
        }

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

    // Logic to visually place the ship on the gameboard
    #placeShip(dropPosition, shipObj) {
        const shipSize = shipObj.length;
        const shipOrientation = shipObj.orientation;

        // remove previous 'width', 'height' to allow grid snapping
        this.currentShip.style.width = '';
        this.currentShip.style.height = '';
        this.currentShip.style.left = '';
        this.currentShip.style.top = '';
        console.log(dropPosition);
        
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
