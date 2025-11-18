// As part of the level design, I'm manually defineing the layout of the initial paths of Durham
// It's very extendable & customisable using the coding scheme defined below where a number represents a certain tile or the player
export const DURHAM_MAP_LAYOUT = [
  [3,3,3,1,0,0,0,0,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,1,0,0,0,0,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,1,0,0,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,1,0,0,0,0,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,1,1,1,1,1,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,3,3,3,3,1,3,3,3,3,3,3,1,1,1,1,0,0,1,3,3,3,3,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,3,3,3,3,3,3,1,1,1,1,0,0,1,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,3,3,3,3,1,3,3,3,3,3,3,1,3,3,1,1,1,1,1,1,1,1,1,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,3,3,3,3,1,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];


// this function builds on the map, adding another layer on top of it for static objects (like the cathedrel, i.e. non-interactable)
export function build_objects_layer(map_width, map_height) {
    const objects = [];  // just setting out the space to store statics
    for (let r = 0; r < map_height;r++) { //going through rows
        objects[r] = [];
        for (let c = 0; c < map_width; c++) {// and then cols
            objects[r][c] = null; // this is defining that there's currently no object here
        }
    }
    return objects; // there's now an array defining that no objects are on the map
}

// Bulding Durham city map (grid-based) - this'll be called in main.js, abstracting logic from the functions on this page
export function build_grid_map(width, height) {
    let map = [];
    for (let h = 0; h < height; h++) {
        map[h] = [];
        for (let w = 0; w < width; w++) {
            // map[h][w] = 0; // [Dev note]: just uncomment this and recomment below to ignore the durham map defintion and render an empty map
            const tile = DURHAM_MAP_LAYOUT[h]?.[w]; // lookup coresponding value in durham map above
            map[h][w] = (tile !== undefined) ? tile : 0; // if there's a path (value, represented by a 1) here then use it, otherwise a 0 is the default (blank space)
        }
    }

    let statics = build_objects_layer(width, height);

    // now placing the static objects defined below:
    place_static_object(statics, 0, 4, STATIC_OBJECTS.gala);
    place_static_object(statics, 6, 18, STATIC_OBJECTS.marketplace_trident_statue);
    place_static_object(statics, 5, 26, STATIC_OBJECTS.marketplace_horse_statue);
    place_static_object(statics, 22, 42, STATIC_OBJECTS.cathedral);
    place_static_object(statics, 10, 45, STATIC_OBJECTS.castle);

    // now the object layer will get built on top
    return {map, statics};
}


/* 
This coding scheme is used below; it represnets the each of the in-game objects that can be on the durham map
0: blank space
1: path
2: player
3: visitor
4: ... (i'll add later on)
*/

// Then rendering that map for dispaly in html 
export function renderMap(map, statics, playerRow, playerCol) {
    const map_container = document.getElementById("grid");
    
    if (!map_container) { // verify presence of container from which to display the map
        console.error("[DEBUG LOG] Your missing the container element w/ id grid, add that in first.");
        return;
    }  // Marker/reader note: I'm adding these debug logs throughout to help my development - genreally, these aren't impacting on game functionality, they just help me

    map_container.innerHTML = "";

    for (let w = 0; w < map.length; w++) {
        for (let h = 0; h < map[w].length; h++) {

            const sq = document.createElement("div");
            sq.classList.add("cell");  // defining the squares to add to the grid

            const tile = map[w][h]; // this fetches the current tile val on the map to identify what it is

            // Now this is where the tile class is assigned based on the value pulled
            if (tile === 0) {
                sq.classList.add("empty"); // empty's more of a debugging value; I don't really want any empty tiles in the final game because they're ugly (plain white)
            } else if (tile === 1) {
                sq.classList.add("path");
            } else if (tile === 2) {
                sq.classList.add("grass")
            } else if (tile === 3) {
                sq.classList.add("pavement")
            } else {
                // Generic fallback for future tile types (3, 4, 5...)
                sq.classList.add(`tile-${tile}`);
            }

            // next the static objects need to be placed on the map (non-interactiable buildings/features of durham)
            const fixed_structure = statics[w][h];
            if (fixed_structure && fixed_structure.anchor) {//because I only want the first tile to have the id
                sq.classList.add(fixed_structure.id); // add to class list for css styling
                //sq.textContent = STATIC_OBJECTS[fixed_structure.id].label.charAt(0).toUpperCase(); // [Dev note]: fetching first letter of name of structure for easy labeling (looks horrible though)
            }
            
            // here the player sprite is overlayed if the player's on this square
            if (w === playerRow && h === playerCol) {
                sq.classList.add("player");
            }

            map_container.appendChild(sq);

            // if (map[w][h] === 1) {
            //     sq.classList.add("player");
            //     // sq.textContent = "●"; - this was used as the default placeholder sprite but looks pretty boring. Can be uncommented for 'dumbing down' the game - then remove background img from styles
            // }

            // map_container.appendChild(sq);
        }
    }

    // the next bit here is designed to permit an overlay of an image onto an object zone, rather than have a bunch of repeats of one image. Looks much better w/ this!
    Object.keys(STATIC_OBJECTS).forEach(key => {
        const obj = STATIC_OBJECTS[key];

        for (let r = 0; r < statics.length; r++) {//same structure; going through rows
            for (let c = 0; c < statics[r].length; c++) {// & cols

                const cell = statics[r][c];// pulling the cell
                if (cell && cell.anchor && cell.id === obj.id) { // using the anchor cell here to paste the image over the first cell
                    const overlay = document.createElement("div");// creating a div to put the img in
                    overlay.classList.add("static-overlay", cell.id);
                    // convrt to pixels
                    overlay.style.left = `calc(${c} * var(--cell-size))`;
                    overlay.style.top = `calc(${r} * var(--cell-size))`;

                    // have to set size based on our object footprint
                    overlay.style.width = `calc(${obj.width} * var(--cell-size))`;
                    overlay.style.height = `calc(${obj.height} * var(--cell-size))`;

                    map_container.appendChild(overlay);// and there we have it, image is now overlayed!
                }
            }
        }
    });
}



// this is the space I'm using to define dimensions & ids for each static on the map (e.g. cathedrel)
export const STATIC_OBJECTS = {
    cathedral: {id: "cathedral",width: 8,height: 8,label: "Cathedral"},
    gala: {id: "gala",width: 4, height:4, label:"Gala"},
    marketplace_horse_statue: {id: "equestrian-statue",width:2,height:2,label:"Horse"},
    marketplace_trident_statue: {id: "trident-statue", width:2, height: 2, label: "Trident"},
    castle: {id:"castle", width: 5, height: 5, label: "Castle"}
}; //[Dev note]: don't really need the labels but they're useful for debugging if I don't want to overlay an img

// and here is where the logic is to actually place the static objects defined above
export function place_static_object(map, baseRow, baseCol, objectDef) {
    for (let r = 0; r < objectDef.height; r++) { //going through the rows again
        for (let c = 0; c < objectDef.width; c++) { //and the cols
            map[baseRow + r][baseCol + c] = {
                id: objectDef.id,
                anchor: (r === 0 && c === 0)
            };
            //map[baseRow + r][baseCol + c] = objectDef.id; // this is the logic that lets a static object that takes up multiple tiles be placed
        }
    }
}
