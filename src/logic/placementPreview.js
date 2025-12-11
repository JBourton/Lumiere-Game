// This file is responsible for showing the area around the player that can have an item placed on it
// Inspiration for this placement system comes from other citybuilder videogames I've played, which tend to use similar systems. However, the code from no other game was used here. An improvised version is coded instead.

import { renderMap } from "./map.js";
import { Staff } from "./resources.js";  // so that staff cnt can be decremented
import { draw_visitor_sprites_onto_map } from "../components/renderVisitors.js";  // I'm separating vistor gameplay (above) from visitor asthetics
import { FoodCoverage } from "./foodCoverage.js";
import { ATTRACTION_TYPES } from "./placeableDefinitions.js";

let preview_el_in_doc = null;
let curr_item_of_interest = null;
let main_map = null;

// Once the map is created, this function is to be called just once. It encapsulates the core logic of allowing attraction placement.
export function initPlacementPreview() {
    main_map = document.getElementById("grid");

    if (!main_map) {
        console.error("Grid element (#grid) not found");
        return;
    }

    // this is the function responsible for creating the actual preview element part
    setup_preview_elem();

    // now this event listener is possible, that picks up on the mouse moving round the grid squares
    main_map.addEventListener("mousemove", handleMouseMove);
    main_map.addEventListener("click", try_to_place_an_item);
    console.debug("[PLACEMENT] initPlacementPreview: listeners attached");
}

function setup_preview_elem() {  // this helper facillitates re-rending of the map to allow for overlay of attraction imgs with each map refresh
    // first have to ditch old previews from old renders (but after the re-render happens)
    main_map = document.getElementById("grid");
    if (!main_map) return; // prevent crashes

    if (preview_el_in_doc) preview_el_in_doc.remove();

    preview_el_in_doc = document.createElement("div");  // this firstly creates the preview element in the document
    preview_el_in_doc.classList.add("placement-preview");
    preview_el_in_doc.style.position = "absolute";
    preview_el_in_doc.style.pointerEvents = "none";
    preview_el_in_doc.style.zIndex = "15";

    preview_el_in_doc.style.visibility = "hidden"; // a pre-step to remove the top-left flash of an attraction when it's placed

    main_map.appendChild(preview_el_in_doc);
    if (curr_item_of_interest) updatePreviewDimensions(); // finally, grab the item image to re-overlay it
    console.debug("[PLACEMENT] setup_preview_elem: preview element appended", preview_el_in_doc);
}

// now global exposing to ensure this works after the map is re-rendered
window.__rebuildPreviewEl = setup_preview_elem; 




// This function is for restricting the domain of an attraction to be placed to immediantly adjacent to the player (but all squares around them)
function checkIsAdjacentToPlayer(item_pos_on_x, item_pos_on_y) {
    if (!window.playerInstance) return false; // this just makes sure the playerInstance is globally exposed for referncing their position on the map

    const player_pos_on_x = window.playerInstance.col; 
    const player_pos_on_y = window.playerInstance.row;

    // this line enables the player to have an 8-directional adjacency placment for all the items types
    return Math.abs(item_pos_on_x - player_pos_on_x) <= 1 && Math.abs(item_pos_on_y - player_pos_on_y) <= 1 && 
    !(item_pos_on_x === player_pos_on_x && item_pos_on_y === player_pos_on_y);
}



// called whenever the user selects an item from the sidebar
export function setPlacementItem(item) {
    curr_item_of_interest = item;
    console.debug("[PLACEMENT] setPlacementItem: item set", item, "previewElExists=", !!preview_el_in_doc);
    console.log("[PLACEMENT] setPlacementItem: item set", item);
    // Ensure the preview element exists (in case init wasn't run or was torn down)
    if (!preview_el_in_doc) {
        console.log("[PLACEMENT] preview element missing - creating now");
        setup_preview_elem();
    }
    updatePreviewDimensions();
}


// adjust ghost size based on item w/h
function updatePreviewDimensions() {
    if (!curr_item_of_interest || !preview_el_in_doc) return;

    preview_el_in_doc.style.width  = `calc(var(--cell-size) * ${curr_item_of_interest.w})`;
    preview_el_in_doc.style.height = `calc(var(--cell-size) * ${curr_item_of_interest.h})`;

    preview_el_in_doc.style.backgroundImage = `url(${curr_item_of_interest.img})`;
    preview_el_in_doc.style.backgroundSize  = "100% 100%";
    preview_el_in_doc.style.backgroundRepeat = "no-repeat";
    preview_el_in_doc.style.opacity = "0.6";
}


// move the preview to the hovered tile
function handleMouseMove(e) {
    if (!curr_item_of_interest) return;

    preview_el_in_doc.style.visibility = "visible";  // get rid of top-left attraction flash

    const cell = e.target.closest(".cell");
    if (!cell) return;

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (isNaN(x) || isNaN(y)) return;

    // Move the preview sprite (top-left)
    preview_el_in_doc.style.left = `calc(${x} * var(--cell-size))`;
    preview_el_in_doc.style.top  = `calc(${y} * var(--cell-size))`;

    // highlight the whole footprint
    highlightFootprint(x, y);
}

function try_to_place_an_item(item_to_place) {  // this is the 2nd event listener for the initplacementpreview() function, designed to permit the player to place (overlay) and object where its permissible
    if (!curr_item_of_interest) return;

    const cell = item_to_place.target.closest(".cell");
    if (!cell) return;

    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    // this checks that its a valid placement preview prior to actually commiting to it
    if (!checkPlacementValidity(x, y, curr_item_of_interest.w, curr_item_of_interest.h)) {
        console.log("[DEBUG MSG]: Player tried to place an item here; it's invalid.");
        return;
    }

    place_item_on_map(x, y, curr_item_of_interest);   // all's good, so go ahead & place item
}


// the intention here is to paint over the grid w/ a rectangular footprint
function highlightFootprint(x, y) {
    if (!curr_item_of_interest) return;

    clearFootprintTiles();

    const w = curr_item_of_interest.w;
    const h = curr_item_of_interest.h;

    const isValidPlacement = checkPlacementValidity(x, y, w, h);

    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {

            const cell = main_map.querySelector(
                `.cell[data-x="${x + dx}"][data-y="${y + dy}"]`
            );

            console.log("TRY CELL", x + dx, y + dy, cell); 

            if (cell) {
                cell.classList.add("placement-preview-tile");
                if (!isValidPlacement) {
                    cell.classList.add("invalid");
                }
            }
        }
    }
}


function checkPlacementValidity(itemx, itemy, w, h) {
    // Don't allow placement beyond edges
    if (itemy + h > main_map.dataset.rows) return false;
    if (itemx + w > main_map.dataset.cols) return false;

    // this adjacency matrix is checking pos of attraction relative to player, so you can only place if it's close by
    let adjacent = false;
    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
            if (checkIsAdjacentToPlayer(itemx + dx, itemy + dy)) {
                adjacent = true;
                break;
            }
        }
        if (adjacent) break;
    }

    // this little adjacency check is restricting the permissible bounds to place an object to immediately around a player
    if (!adjacent) {
        return false;
    }

    // Only grass & pavement for now is allowed for placing attractions down (mymapping: 2=grass, 3=pavement)
    for (let dy = 0; dy < h; dy++) {
        for (let dx = 0; dx < w; dx++) {
            const mapTile = window.currentMap?.[itemy + dy]?.[itemx + dx];

            if (!(mapTile === 2 || mapTile === 3)) {
                return false;
            }
            // and this bit is responsible for checking if a placement preview overlaps w/ static objects
            if (window.currentStatics?.[itemy + dy]?.[itemx + dx]) {
                return false; 
            }
            
            // also need to prevent attractions overlapping w/ other attractions
            if (window.placedObjects?.[itemy + dy]?.[itemx + dx]) {
                return false; 
            }

        }
    }
    return true;
}




// The purpose of the function here is to clear any previous highlights as the mouse moves along
function clearFootprintTiles() {
    document.querySelectorAll(".placement-preview-tile").forEach(el => {  // the foreach grabs all the currently highlighted tiles at once
        el.classList.remove("placement-preview-tile", "invalid"); // and just takes off the styling
    });
}


// Above handled the preview; now comes the logic for placing the item on the map
function place_item_on_map(x, y, item) {
    for (let dy = 0; dy < item.h; dy++) {
        for (let dx = 0; dx < item.w; dx++) {
            // ensure rows/cols exist
            if (!window.placedObjects[y + dy]) window.placedObjects[y + dy] = [];
            window.placedObjects[y + dy][x + dx] = {
                id: item.id,  // the id of the attraction placed
                anchor: (dx === 0 && dy === 0),  // I'm using the top-left tile as the anchor for it
                currentVisitors: (dx === 0 && dy === 0) ? 0 : undefined // seting npc logic
            };
        }
    }

    // If this is a food stall, record its anchor & effect
    if (item.type === ATTRACTION_TYPES.FOOD) {
        if (!window.foodStallAnchors) window.foodStallAnchors = [];
        window.foodStallAnchors.push({
            x,
            y,
            effect_w: item.effect_w,
            effect_h: item.effect_h
        });
    }
    // now update logic (above was just visual)
    FoodCoverage.update_mask_of_fstall_coverage(window.foodStallAnchors,window.currentMap);

    // Decrement staff - add defensive check to ensure staff_cost exists
    if (item.staff_cost !== undefined && item.staff_cost !== null) {
        Staff.remove(item.staff_cost);
        console.debug("[PLACEMENT] Staff decremented by", item.staff_cost, "Current staff:", Staff.get());
    } else {
        console.warn("[PLACEMENT] Item missing staff_cost property:", item.id, item);
    }

    turn_off_the_placement_preview();  // get rid of the placement preview once the item's been placed

    // Re-render map immediately so overlay shows right away
    renderMap(
        window.currentMap,
        window.currentStatics,
        window.placedObjects,
        window.playerInstance.row,
        window.playerInstance.col
    );

    // Draw all the layers on top
    draw_visitor_sprites_onto_map();
    
    // now render the coverage area for each food stall
    if (window.foodStallAnchors?.length) {
        FoodCoverage.redraw_all_food_coverage(window.foodStallAnchors);
    }

    // Rebuild preview after map refresh (map.js also calls this, but this is safe)
    if (window.__rebuildPreviewEl) window.__rebuildPreviewEl();
}


// this function turns off the placement preview; this activates either when the player places the selected item or presses esc
export function turn_off_the_placement_preview() {
    curr_item_of_interest = null;
    if (preview_el_in_doc) {
        preview_el_in_doc.style.backgroundImage = "";
        preview_el_in_doc.style.opacity = "0";
        preview_el_in_doc.style.visibility = "hidden";
    }
    if (window.hidePlacementHint) window.hidePlacementHint();
}
