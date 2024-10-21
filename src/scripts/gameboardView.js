export function initGameboard(gameboard) {
    // Create a gameboard container
    const grid = document.createElement('div');
    grid.classList.add('gameboard');
    grid.style.gridTemplateColumns = `repeat(${gameboard.width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gameboard.height}, 1fr)`;

    // Add empty tiles for the rest of the gameboard
    for (let y = 0; y < gameboard.height; y++) {
        for (let x = 0; x < gameboard.width; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.gridRowStart = x + 1;
            tile.style.gridColumnStart = y + 1;
            tile.style.gridRowEnd = x + 1;
            tile.style.gridColumnEnd = y + 1;
            grid.appendChild(tile);
        }
    }

    // Iterate through the ships on the board
    for (const [shipName, shipData] of Object.entries(gameboard.shipsOnBoard)) {
        const { startX, endX, startY, endY } = shipData;

        const ship = document.createElement('div');
        ship.classList.add('ship', shipName);

        // Set the grid position based on orientation
        ship.style.gridRowStart = startY; // Start row (1-based index)
        ship.style.gridColumnStart = startX; // Start column (1-based index)
        ship.style.gridRowEnd = endY; // End row for vertical ships
        ship.style.gridColumnEnd = endX; // End column for horizontal ships

        grid.appendChild(ship);
    }

    document.querySelector('body').appendChild(grid);
}
