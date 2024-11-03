import './reset.css';
import './style.css';

import { Game } from './scripts/game.js';

(function main() {

    try {
        startPage();

        document.addEventListener('gameRestart', async () => {
            await resetPage();
            startPage();
        });
    } catch (e) {
        console.error(e);
    }

})();

function startPage() {
    // initialize Ship objects
    const shipsInitial = {'Battleship': 4, 'Cruiser': 3, 'Submarine': 1, 'Destroyer': 2};

    new Game(shipsInitial);
}

async function resetPage() {
    // Fetch the initial index.html file
    try {
        const response = await fetch('index.html');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const html = await response.text();
        
        // Parse the HTML and set the body content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Update only necessary elements instead of the entire body
        const newContent = doc.body.innerHTML; // Assume only content in the body is what needs updating
        document.body.innerHTML = newContent; // Optimize by just replacing content needed

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}