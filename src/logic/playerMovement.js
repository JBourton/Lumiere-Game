import { renderMap } from "./map.js";
import { draw_visitor_sprites_onto_map } from "../components/renderVisitors.js";
import { PLAYER_MOVE_SPEED } from "../config.js";


// Handles the player logic – just keeping it all together here compartmentalised away from rest of the repo
export class Player {
    constructor(initialRow, initialCol, levelMap, statics_fixed_on_map, attractions_placed_on_map) {
        this.row = initialRow;
        this.col = initialCol;
        this.map = levelMap;
        this.statics_fixed_on_map = statics_fixed_on_map; // adding this in to accout for player collision with fixed structures
        this.attractions_placed_on_map = attractions_placed_on_map; // and this too so that the player can actually place attractions down (whole point of game)
        // [Dev note] change this to a MUCH lower value (like, 30ms) if you want the player to zoom around and quickly reach areas
        this.canMove = true;  // this is a shackle on the user's movements (so they don't go too fast around durham)
        this.moveDelay = PLAYER_MOVE_SPEED; // and this is the movement delay in ms (when it expires, it unlocks above)
    }

    move(change_in_row, change_in_col) {
        if (window.gamePaused) return; // prevent movement while paused
        if (!this.canMove) return; // immediantly cancel the attempt at moving if the player's going too fast

        this.canMove = false; // put the movement block on for a while (i.e. moveDelay seconds)
        setTimeout(() => this.canMove = true, this.moveDelay);  // and then set the timeout for it based on the precoded val

        // Try moving the player by this offset
        const targetRow = this.row + change_in_row;
        const targetCol = this.col + change_in_col;

        // Prevent walking off the edge – basic boundary checks
        if (
            targetRow < 0 ||
            targetRow >= this.map.length ||
            targetCol < 0 ||
            targetCol >= this.map[0].length
        ) {
            // Out of bounds, ignore input
            return;
        }
        //this.map[this.row][this.col] = 0; // I can uncoment this to clear old position (i.e. remove path player was just on)

        if (this.map[targetRow][targetCol] !== 1) {return;} // this little peice of logic forces player to stick to paths only
        //if (this.statics_fixed_on_map[targetRow][targetCol] !== null) {return;}
        if (this.statics_fixed_on_map[targetRow][targetCol] && this.statics_fixed_on_map[targetRow][targetCol].id) {return;} // and this is explicitly defining that the player can't bump into fixed structures


        // Now update to new position
        this.row = targetRow;
        this.col = targetCol;

        // [Note]: Could move this out later if rendering gets more complex?
        renderMap(this.map, this.statics_fixed_on_map, this.attractions_placed_on_map, this.row, this.col);
        draw_visitor_sprites_onto_map();
    }
}

// let the player move around Durham using WASD (for now)
export function enablePlayerMovement(playerInstance) {
    // an event listner is set up to read player keybord inputs
    document.addEventListener("keydown", function(event) {
        const keyPressed = event.key.toLowerCase();

        // TODO: Maybe support arrow keys later?
        switch (keyPressed) {
            case 'w': // up
                playerInstance.move(-1, 0);
                break;
            case 's': // down
                playerInstance.move(1, 0);
                break;
            case 'a': // left
                playerInstance.move(0, -1);
                break;
            case 'd': // right
                playerInstance.move(0, 1);
                break;
            default:
                // Don't do anything for other keys
                break;
        }
    });
}
