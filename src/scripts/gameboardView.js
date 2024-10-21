export function initGameboard(gameboard) {
    // Create a gameboard container
    const grid = document.createElement('div');
    grid.classList.add('gameboard');
    grid.style.gridTemplateColumns = `repeat(${gameboard.width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gameboard.height}, 1fr)`;

    // Add empty tiles to every position of gameboard grid
    for (let y = 0; y < gameboard.height; y++) {
        for (let x = 0; x < gameboard.width; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            // Set the tile position on gameboard grid (using area)
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

        // Set the ship position on gameboard grid (using area)
        ship.style.gridRowStart = startY;
        ship.style.gridColumnStart = startX;
        ship.style.gridRowEnd = endY;
        ship.style.gridColumnEnd = endX;

        grid.appendChild(ship);
    }

    document.querySelector('body').appendChild(grid);
}
