export function initGameboard(gameboard) {

    // create a gameboard container
    const grid = document.createElement('div');
    grid.classList.add('gameboard');

    for(let y = 0; y < gameboard.height; y++) {
        // create 'line' -> which contains one file of tiles (along y axis)
        const line = document.createElement('div');
        line.classList.add('line');

        for(let x = 0; x < gameboard.width; x++) {
            // create tiles inside line
            const tile = document.createElement('div');
            tile.classList.add('tile');
            line.appendChild(tile);
        }
        grid.appendChild(line);
    }

    document.querySelector('body').appendChild(grid);
}