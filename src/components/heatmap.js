// this file is responsible for showing the overlay inside the div already created in the html
// I'm using plotly for this: https://plotly.com/javascript/heatmaps/

import { WIDTH, HEIGHT } from "../config.js"; // so it matches dims
import { getHeatmapPalette } from "./colourblind.js"; // Added by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).
export const SCALE_DOWN = 3; // this allows me to variabley change the resolution of the heatmap, so I can experiment to find what's best visually
export const HMAP_ROWS  = Math.ceil(HEIGHT / SCALE_DOWN);
export const HMAP_COLS = Math.ceil(WIDTH / SCALE_DOWN);
let live_heatmap_vals = null;  // hmap presence holder
let plot_initialised = false;  // confirmation plot is there



// I'm doing this modularly: first the empty heatmap needs to be drawn on
function setup_the_heatmap() {
    const the_map = []; // the scaled-down representation of the actual map
    for (let hmap_r = 0; hmap_r < HMAP_ROWS; hmap_r++) {// go row by row to construct mimic map
        const new_hmap_row = new Array(HMAP_COLS).fill(0); // (as it's only 0s anyway as I'm starting empty)
        the_map.push(new_hmap_row);
    }
    return the_map;
}


// I wrote this to beat the race condition where npcs try to register themselves on the heatmap before its rendered
function ensure_live_heatmap() {
    if (!live_heatmap_vals) {  // (checking global above)
        live_heatmap_vals = setup_the_heatmap();
    }
    return live_heatmap_vals;
}
// and this is the actual drawing of it onto the div
export function draw_on_empty_hmap() {
    const empty_hmap_container = document.getElementById("heatmapMini");
    if (!empty_hmap_container) {
        return; // another defense, but shouldn't ever be the case
    } else if (typeof Plotly == "undefined") {
        return; // ensure plotly is actually in script before going ahead w/ code
    }

    // quick check now to enure heatmap loads before npcs
    const initial_vals = ensure_live_heatmap();

    // get hmaps data
    //const empty_vals= setup_the_heatmap();  // (for non-checkered hmap layout, but I'm not using it at present)
    const empty_vals = initial_vals.map((row, r) => row.map((v, c) => (r + c) % 2)); 
    const the_maps_data = [{z: empty_vals, type:"heatmap", showscale: false, zsmooth: false, colorscale: current_colourscale(), zmin: 0, zmax: 5}]; // checkered brown w/ red heatmap vals (Updated by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).)

    // & setup it's layout
    const hmap_layout = {
        margin: { l: 0, r: 0, t: 0, b: 0 },
        xaxis: { // styling individual axises
            showgrid: false,
            zeroline: false,
            showticklabels: false
        },
        yaxis: {
            showgrid: false,
            zeroline: false,
            showticklabels: false,
            autorange: "reversed"
        },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        margin: { l: 0, r: 0, t: 0, b: 0, pad: 0 },
        autosize: true,
        width: empty_hmap_container.clientWidth,
        height: empty_hmap_container.clientHeight,


    };

    const plotly_hmap_config_vals = {staticPlot: true, displayModeBar: false,responsive: true}; // (based off the docs)

    // now actually draw it
    Plotly.newPlot(empty_hmap_container, the_maps_data, hmap_layout, plotly_hmap_config_vals);
    plot_initialised = true; // communicate w/ all other functions "plot initislisation done!"
}

// clear/repaint w/ each update
export function reset_heatmap_counts() {
    const hmap = ensure_live_heatmap();
    for (let hmap_r = 0; hmap_r < hmap.length; hmap_r ++) {
        hmap[hmap_r].fill(0);
    }
}

// now, I'm aggregating multiple squares; if an npc is in a wider square area, they get added to that area tile
export function register_visitor_on_heatmap(npcs_map_col, npcs_map_row) {
    const hmap = ensure_live_heatmap();
    const hmap_col = Math.floor(npcs_map_col / SCALE_DOWN);
    const hmap_row = Math.floor(npcs_map_row / SCALE_DOWN);

    // quick bounds check before registering
    if (hmap_row < 0 || hmap_row >= hmap.length) return;
    if (hmap_col < 0 || hmap_col >= hmap[0].length) return;
    hmap[hmap_row][hmap_col] += 1;  // register adding on the next npc
}


// setup the brown-red scaling
function map_counts_to_tiers(all_map_vals) {
    // here I'm encoding both the original brown checkerboard for empty tiles & 5 congestion tiers for tiles with at least 1 npc
    return all_map_vals.map((hmap_row, ro) =>
        hmap_row.map((num_of_npcs, col_hmap) => {
            if (num_of_npcs === 0) {
                // no visitors here – keep the original checkerboard pattern
                return (ro + col_hmap) % 2; // i.e. a 0 or 1
            }
            if (num_of_npcs <= 1) return 2;  // tier 1
            if (num_of_npcs <= 3) return 3;  // tier 2
            if (num_of_npcs <= 5) return 4;  // tier 3
            return 5;                  // tier 4
        })
    );
}


// I start out at brown, as its the actual map colour, then i fade onto red depending on num of npcs in that aggregated block. 
// // Here, tier 0 == low (light brown) & tier 4 ==high (reddy-brown colour)
const congestion_colourscale = [
    [0.0,       "rgba(147,115,62,1)"], // tier 0 brown, as base
    [1.0 / 5.0, "rgba(180,145,78,1)"],  // tier 1 brown, but a tad red
    [2.0 / 5.0, "rgba(226, 168, 160, 1)"], // tier 2 slight red
    [3.0 / 5.0, "rgba(200,120,90,1)"], // tier 3 blood red
    [4.0 / 5.0, "rgba(170,80,60,1)"],   // tier 4 (crimson red)
    [5.0 / 5.0, "rgba(150,40,40,1)"]  // tier 4 (crimson red)
];

// genai-implemented function that looked at my styles.css & wrote the logic (in colourblind.js) to enable colourblind mode
function current_colourscale() {
    try {
        return getHeatmapPalette();
    } catch (err) {
        return congestion_colourscale; // fallback if anything goes wrong
    }
} // Added by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).

// now hand over all the logic to plotly
export function update_heatmap_visual() {
    if (!plot_initialised || !live_heatmap_vals) return;  // but only if heatmap is present and populated!
    const hmap_lvld_layers = map_counts_to_tiers(live_heatmap_vals);

    Plotly.restyle("heatmapMini", {
        z: [hmap_lvld_layers],
        zmin: [0],
        zmax: [5],
        colorscale: [current_colourscale()]  // now this is actually dynamic (Updated by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).)
    });
}

// refresh palette when accessibility mode changes
document.addEventListener("colourblindmodechange", () => {
    update_heatmap_visual(); // Added by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).
});

// for congetsion calculations
export function get_hmap_grid_for_congestion() {
    return live_heatmap_vals;
}
