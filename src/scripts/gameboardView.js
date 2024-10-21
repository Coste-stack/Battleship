export function initGameboard(gameboard) {

    // create a gameboard container
    const grid = document.createElement('div');
    grid.classList.add('gameboard');
    grid.style.gridTemplateColumns = `repeat(${gameboard.width}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gameboard.height}, 1fr)`;
    console.log(grid.style.gridTemplateColumns);

    for(let y = 0; y < gameboard.height; y++) {

        for(let x = 0; x < gameboard.width; x++) {
            // create a tile (to be inside grid)
            const tile = document.createElement('div');
            tile.classList.add('tile');

            // check if there's a ship on this tile
            if (gameboard.board[y][x].ship !== undefined) {
                tile.classList.add('ship');
                tile.classList.add(gameboard.board[y][x].ship.name);
            }

            grid.appendChild(tile);
        }
    }

    document.querySelector('body').appendChild(grid);
}