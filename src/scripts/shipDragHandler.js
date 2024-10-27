export class ShipDragHandler {
    constructor(gameboard) {
        this.gameboardObj = gameboard;
        this.gameboardElement = document.querySelector('.Player #gameboard');
        this.currentShip = null; // To keep track of the ship being dragged
        this.offset = { x: 0, y: 0 }; // To store the drag offset

        // Allow dropping on the gameboard
        this.gameboardElement.addEventListener('dragover', (e) => this.#dragOver(e));
        this.gameboardElement.addEventListener('drop', (e) => this.#drop(e));
    }

    allowShipDragging(ship) {
        ship.setAttribute('draggable', 'true');
        ship.addEventListener('dragstart', (e) => this.#dragStart(e, ship));
        ship.addEventListener('dragend', () => this.#dragEnd());
    }

    #dragStart(e, ship) {
        this.currentShip = ship;
        const rect = ship.getBoundingClientRect();
        // Calculate the offset of the mouse pointer relative to the ship's top-left corner
        this.offset.x = e.clientX - rect.left;
        this.offset.y = e.clientY - rect.top;

        // Set a dataTransfer value to identify the ship type (if needed)
        e.dataTransfer.setData('text/plain', ship.id);
    }

    #dragEnd() {
        this.currentShip = null; // Clear the current ship reference
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
