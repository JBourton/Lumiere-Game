// As part of the level design, I'm manually defineing the layout of the initial paths of Durham
// It's very extendable & customisable using the coding scheme defined below where a number represents a certain tile or the player
export const DURHAM_MAP_LAYOUT = [
  [3,3,3,1,0,0,0,0,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
  [3,3,3,1,0,0,0,0,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,1,1,3,3,3,3,3,3,3,1,0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
  [3,3,3,1,0,0,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,3,1,1,1,1,1,1,1,1,1,0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
  [3,3,3,1,0,0,0,0,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,1,3,3,3,3,3,3,3,1,0,0,0,0,1,3,3,3,3,3,3,1,0,0,0,0],
  [3,3,3,1,1,1,1,1,1,3,3,3,3,3,1,3,3,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,0,0,1,3,3,3,3,3,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3],
  [3,3,3,3,3,3,3,1,3,3,3,3,3,3,1,1,1,1,0,0,1,3,3,3,3,1,0,0,1,3,3,3,3,3,3,3,3,0,0,0,0,0,1,3,3,1,3,3,3,3],
  [1,1,1,1,1,1,1,1,3,3,3,3,3,3,1,1,1,1,0,0,1,3,3,3,3,1,1,1,1,3,3,3,3,3,3,3,0,0,0,0,0,0,1,3,3,1,3,3,3,3],
  [3,3,3,3,3,3,3,1,3,3,3,3,3,3,1,3,3,1,1,1,1,1,1,1,1,1,3,3,1,3,3,3,3,3,3,3,0,0,0,0,0,0,1,3,3,1,3,3,3,3],
  [3,3,3,3,3,3,3,1,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3,3,3,1,0,0,0,0,0,0,0,0,0,1,3,1,0,0,0,0,0],
  [3,3,3,3,3,1,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3,3,3,1,0,0,0,0,0,0,0,0,0,1,3,1,0,0,0,0,0],
  [3,3,3,3,3,1,3,3,3,3,3,3,3,3,1,3,3,1,3,3,3,3,3,1,3,3,3,3,1,3,3,3,1,0,0,0,0,0,0,0,0,0,1,3,1,0,0,0,0,0],
  [3,3,3,3,3,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,3,1,0,0,0,0,0],
  [3,3,3,3,3,1,3,3,3,3,3,3,3,1,3,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
  [3,3,3,3,3,1,3,3,3,1,1,1,1,1,3,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
  [3,3,3,3,3,1,3,3,3,1,3,3,3,3,3,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,1],
  [3,3,3,3,3,1,1,1,1,1,3,3,3,3,3,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,1],
  [3,3,3,3,3,1,3,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,1,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,1],
  [3,3,1,3,3,1,3,3,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,2,2,2,2,2,2,2,1],
  [3,3,1,3,3,1,3,3,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,1,3,3,3,3,1,3,3,3,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,1,3,3,1,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,3,3,1,3,3,3,3,3,3,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,1,3,3,1,0,0,0,0,0,0,0,0,0,0,3,3,1,3,0,0,0,0,0,1,3,3,1,3,3,3,3,3,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,1,3,3,1,0,0,0,0,0,0,0,0,0,0,3,3,1,3,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,1,3,3,1,0,0,0,0,0,0,0,0,0,0,3,3,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,1,3,3,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];


// this function builds on the map, adding another layer on top of it for static objects (like the cathedrel, i.e. non-interactable)
export function build_a_new_layer(map_width, map_height) {
    const objects = [];  // just setting out the space to store statics_fixed_on_map
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

    let statics_fixed_on_map = build_a_new_layer(width, height);  // I'm using these as layers placed on top of the map in order to abstract away some of the logic. Layer 2 is statics (i.e. imgs of places in Durham)
    let attractions_placed_on_map = build_a_new_layer(width, height); // and layer 3 is the items the player places

    // now placing the static objects defined below:
    place_static_object(statics_fixed_on_map, 0, 4, STATIC_BUILDINGS_AROUND_DURHAM.gala);
    place_static_object(statics_fixed_on_map, 6, 18, STATIC_BUILDINGS_AROUND_DURHAM.marketplace_trident_statue);
    place_static_object(statics_fixed_on_map, 5, 26, STATIC_BUILDINGS_AROUND_DURHAM.marketplace_horse_statue);
    place_static_object(statics_fixed_on_map, 21, 41, STATIC_BUILDINGS_AROUND_DURHAM.cathedral);
    place_static_object(statics_fixed_on_map, 10, 45, STATIC_BUILDINGS_AROUND_DURHAM.castle);
    place_static_object(statics_fixed_on_map, 23, 6, STATIC_BUILDINGS_AROUND_DURHAM.framwellgate_bridge);
    place_static_object(statics_fixed_on_map, 23, 20, STATIC_BUILDINGS_AROUND_DURHAM.riverside);
    place_static_object(statics_fixed_on_map, 0, 46, STATIC_BUILDINGS_AROUND_DURHAM.cuthberts);
    place_static_object(statics_fixed_on_map, 0, 34, STATIC_BUILDINGS_AROUND_DURHAM.hatfield);
    place_static_object(statics_fixed_on_map, 14, 29, STATIC_BUILDINGS_AROUND_DURHAM.north_road);

    // now the object layer will get built on top
    return {map, statics_fixed_on_map, attractions_placed_on_map};
}


/* 
This coding scheme is used below; it represnets the each of the in-game objects that can be on the durham map
0: blank space (just a placeholder used for development, shouldn't be any in my final version)
1: cobble (for placing attractions)
2: grass (also for placing attractions)
3: path (walkable for player & npcs)
*/

// Then rendering that map for dispaly in html 
export function renderMap(map, statics_fixed_on_map, attractions_placed_on_map, playerRow, playerCol) {
    const map_container = document.getElementById("grid");
    
    if (!map_container) { // verify presence of container from which to display the map
        console.error("[DEBUG LOG] Your missing the container element w/ id grid, add that in first.");
        return;
    }  // Marker/reader note: I'm adding these debug logs throughout to help my development - genreally, these aren't impacting on game functionality, they just help me

    map_container.innerHTML = "";

    // // [important]:the grid dimensions are needed here so that the player preview can read the bounds
    map_container.dataset.rows = map.length;
    map_container.dataset.cols = map[0].length;

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
            const fixed_structure = statics_fixed_on_map[w][h];
            if (fixed_structure && fixed_structure.anchor) {//because I only want the first tile to have the id
                sq.classList.add(fixed_structure.id); // add to class list for css styling
                //sq.textContent = STATIC_BUILDINGS_AROUND_DURHAM[fixed_structure.id].label.charAt(0).toUpperCase(); // [Dev note]: fetching first letter of name of structure for easy labeling (looks horrible though)
            }
            
            // here the player sprite is overlayed if the player's on this square
            if (w === playerRow && h === playerCol) {
                sq.classList.add("player");
            }

            // set the row & col for the placement preview
            sq.dataset.x = h;
            sq.dataset.y = w;

            map_container.appendChild(sq);

            // if (map[w][h] === 1) {
            //     sq.classList.add("player");
            //     // sq.textContent = "●"; - this was used as the default placeholder sprite but looks pretty boring. Can be uncommented for 'dumbing down' the game - then remove background img from styles
            // }

            // map_container.appendChild(sq);
        }
    }

    // Layer 2: the next bit here is designed to permit an overlay of an image onto an object zone, rather than have a bunch of repeats of one image. Looks much better w/ this!
    Object.keys(STATIC_BUILDINGS_AROUND_DURHAM).forEach(key => {
        const obj = STATIC_BUILDINGS_AROUND_DURHAM[key];

        for (let r = 0; r < statics_fixed_on_map.length; r++) {//same structure; going through rows
            for (let c = 0; c < statics_fixed_on_map[r].length; c++) {// & cols

                const cell = statics_fixed_on_map[r][c];// pulling the cell
                if (cell && cell.anchor && cell.id === obj.id) { // using the anchor cell here to paste the image over the first cell
                    const overlay = document.createElement("div");// creating a div to put the img in
                    overlay.classList.add("static-overlay", cell.id);
                    // convrt to pixels
                    overlay.style.left = `calc(${c} * var(--cell-size))`;
                    overlay.style.top = `calc(${r} * var(--cell-size))`;

                    // have to set size based on our object footprint
                    overlay.style.width = `calc(${obj.width} * var(--cell-size))`;
                    overlay.style.height = `calc(${obj.height} * var(--cell-size))`;

                    map_container.appendChild(overlay);// now finally theres an overlayed img on this cell that's being hovered over.
                }
            }
        }
    });

    // Layer 3: This bit is responsible for the attractions the player placed on the map
    Object.keys(window.ALL_ATTRACTIONS_PLACEABLE_ON_MAP || {}).forEach(key => {
        const obj = window.ALL_ATTRACTIONS_PLACEABLE_ON_MAP[key];

        // Layer 3: attractions the player placed on the map
        for (let r = 0; r < attractions_placed_on_map.length; r++) {
            for (let c = 0; c < attractions_placed_on_map[r].length; c++) {
                const cell = attractions_placed_on_map[r][c];
                if (!cell || !cell.anchor) continue;

                // Look up the definition by the id actually on the grid
                const obj = window.ALL_ATTRACTIONS_PLACEABLE_ON_MAP[cell.id];
                if (!obj) {
                    console.warn("[ATTR RENDER] No definition for attraction id:", cell.id);
                    continue;
                }

                const overlay = document.createElement("div");
                overlay.classList.add("placed-overlay", cell.id);

                overlay.style.left   = `calc(${c} * var(--cell-size))`;
                overlay.style.top    = `calc(${r} * var(--cell-size))`;
                overlay.style.width  = `calc(${obj.w} * var(--cell-size))`;
                overlay.style.height = `calc(${obj.h} * var(--cell-size))`;

                // Debug: log overlay creation so we can see if background-image lookup will be used
                console.debug(`[MAP] renderMap: placing overlay id=${cell.id} at r=${r} c=${c} size=${obj.w}x${obj.h}`, overlay, obj);
                map_container.appendChild(overlay);
            }
        }

    });


    // now the grid is cleared, placement previews must be restored
    if (window.__rebuildPreviewEl) {
        window.__rebuildPreviewEl();  // this has to be rebuilt w/ every rerender otherwise the placment preview wouldn't work
    }

}




// this is the space I'm using to define dimensions & ids for each static on the map (e.g. cathedrel)
export const STATIC_BUILDINGS_AROUND_DURHAM = {
    cathedral: {id: "cathedral",width: 9,height: 9,label: "Cathedral"},
    gala: {id: "gala",width: 4, height:4, label:"Gala"},
    marketplace_horse_statue: {id: "equestrian-statue",width:2,height:2,label:"Horse"},
    marketplace_trident_statue: {id: "trident-statue", width:2, height: 2, label: "Trident"},
    castle: {id:"castle", width: 5, height: 5, label: "Castle"},
    framwellgate_bridge: {id: "framwellgate-bridge", width: 10, height: 7, label: "FramwellgateBridge"},
    riverside: {id: "riverside", width: 5, height: 7, label: "Riverside"},
    cuthberts: {id: "cuthberts", width: 4, height: 4, label: "StCuthberts"},
    hatfield: {id: "hatfield", width: 4, height: 4, label: "Hatfield"},
    north_road: {id: "north-road", width: 6, height: 6, label: "NorthRoad"},
}; //[Dev note]: don't really need the labels but they're useful for debugging if I don't want to overlay an img

// and here is where the logic is to actually place the static objects defined above
export function place_static_object(map, baseRow, baseCol, objectDef) {
    for (let r = 0; r < objectDef.height; r++) { //going through the rows again
        for (let c = 0; c < objectDef.width; c++) { //and the cols
            map[baseRow + r][baseCol + c] = {
                id: objectDef.id,
                anchor: (r === 0 && c === 0)
            };
        }
    }
}
