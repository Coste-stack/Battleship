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
        ship.addEventListener('touchend', (e) => this.#touchEnd());
    }

    #dragStart(e, ship) {
        this.currentShip = ship;
        e.dataTransfer.setData('text/plain', ship.id);
    }

    #dragEnd() {
        this.currentShip = null; // Clear the current ship reference
    }

    #touchStart(e, ship) {
        e.preventDefault();
        this.currentShip = ship;
        
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

            console.log(`Current Ship Position - Left: ${this.currentShip.style.left}, Top: ${this.currentShip.style.top}`);
            console.log(`GameboardRect - Left: ${gameboardRect.left}, Top: ${gameboardRect.top}`);
        }
    }

    #touchEnd(e) {
        const dropPosition = this.#getDropPositionTouch();
        if (this.#isValidDrop(this.currentShip, dropPosition)) {
            this.#placeShip(dropPosition);
        } else {
            console.log('Invalid drop position'); // Handle invalid drop
        }

        this.gameboardElement.removeEventListener('touchmove', (e) => this.#touchDrag(e));
        this.currentShip = null; // Clear the current ship reference
        this.offset = { x: 0, y: 0 }; // Reset offset (so that next click has new offset)
    }

    #getDropPositionTouch() {
        const gameboardRect = this.gameboardElement.getBoundingClientRect();
        const cellWidth = gameboardRect.width / this.gameboardObj.width;
        const cellHeight = gameboardRect.height / this.gameboardObj.height;

        const xPos = Math.floor(parseFloat(this.currentShip.style.top) / cellHeight);
        const yPos = Math.floor(parseFloat(this.currentShip.style.left) / cellWidth);
        console.log(xPos, yPos);

        return { x: xPos, y: yPos };
    }

    #dragOver(e) {
        e.preventDefault(); // Prevent default to allow dropping
    }

    #drop(e) {
        e.preventDefault(); // Prevent default behavior

        const dropPosition = this.#getDropPosition(e);
        if (this.#isValidDrop(this.currentShip, dropPosition)) {
            this.#placeShip(dropPosition);
        } else {
            console.log('Invalid drop position'); // Handle invalid drop
        }
    }

    #getDropPosition(e) {
        const gameboardRect = this.gameboardElement.getBoundingClientRect();
        const cellWidth = gameboardRect.width / this.gameboardObj.width;
        const cellHeight = gameboardRect.height / this.gameboardObj.height;

        const xPos = Math.floor((e.clientY - gameboardRect.top) / cellHeight);
        const yPos = Math.floor((e.clientX - gameboardRect.left) / cellWidth);

        return { x: xPos, y: yPos };
    }

    #isValidDrop(ship, dropPosition) {
        // Implement logic to check if the ship can be placed at dropPosition
        // Check if the area occupied by the ship is free, considering its size and orientation
        // Return true if valid, false otherwise
        return true; // Replace with actual validation logic
    }

    // Logic to visually place the ship on the gameboard
    #placeShip(dropPosition) {
        const shipSize = parseInt(this.currentShip.getAttribute('length'));
        const shipOrientation = this.currentShip.getAttribute('orientation');

        // remove previous 'width', 'height' to allow grid snapping
        this.currentShip.style.width = '';
        this.currentShip.style.height = '';
        this.currentShip.style.left = '';
        this.currentShip.style.top = '';

        switch(shipOrientation) {
            case 'x':
                this.currentShip.style.gridRowStart = dropPosition.x + 1;
                this.currentShip.style.gridRowEnd = dropPosition.x + 1;
                this.currentShip.style.gridColumnStart = dropPosition.y + 1;
                this.currentShip.style.gridColumnEnd = dropPosition.y + shipSize + 1;
                break;
            case 'y':
                this.currentShip.style.gridRowStart = dropPosition.x + 1;
                this.currentShip.style.gridRowEnd = dropPosition.x + shipSize + 1;
                this.currentShip.style.gridColumnStart = dropPosition.y + 1;
                this.currentShip.style.gridColumnEnd = dropPosition.y + 1;
                break;
        }
    }
}
