// this file is responsible for the effects of food stalls on nearby visitors interacting w/ attractions
// rule: no food stalls when visitors are interacting = magic gain proportional to num visitors

import { Magic } from "./resources.js";
import { STATE_OF_NPC } from "./visitorLogic/visitors.js";
import { MAGIC_DEC_FROM_HUNGRINESS } from "../config.js";

export const FoodCoverage = {

    // this draws on the coverage for a singular food stall
    _draw_single_coverage(centre_x_pos_of_fstall, centre_y_pos_of_fstall, effect_w, effect_h) {
        const grid = document.getElementById("grid");
        if (!grid) return;

        // begin identifying map squares to highlight based on where foodstall was placed
        const start_area_x = centre_x_pos_of_fstall - Math.floor(effect_w / 2);
        const start_area_y = centre_y_pos_of_fstall - Math.floor(effect_h / 2);

        // now I go through and fetch all the map squares to create the div on which to overlay on the (big) map
        for (let y_change = 0; y_change < effect_h; y_change++) {
            for (let x_change = 0; x_change < effect_w; x_change++) {
                const map_pos_x = start_area_x + x_change;
                const map_pos_y = start_area_y + y_change;

                if (map_pos_x < 0 || map_pos_y < 0) continue;  // ofc don't render outside of bounds, just skip

                const map_sq = grid.querySelector(`.cell[data-x="${map_pos_x}"][data-y="${map_pos_y}"]`); // fetch map sq to overlay onto w/ div
                if (!map_sq) continue;

                const overlay_cov_tile = document.createElement("div"); // 1 div per 1 overlay sq
                overlay_cov_tile.className = "food-coverage-tile";  // so it can be coloured in

                // now that new div, which has been styles (check styles.css for that class) is pushed on top of the map sq
                map_sq.appendChild(overlay_cov_tile);
            }
        }
    },

    // now publicly all coverage tiles are redrawn using array
    redraw_all_food_coverage(arr_of_foodstalls) {
        const grid = document.getElementById("grid");
        if (!grid) return;

        // any old coverage tiles get chucked out
        document.querySelectorAll('.food-coverage-tile').forEach(cov_tile => cov_tile.remove());

        if (!arr_of_foodstalls || !arr_of_foodstalls.length) return;
        // now new ones are drawn on
        for (const stall of arr_of_foodstalls) {
            this._draw_single_coverage(stall.x, stall.y, stall.effect_w, stall.effect_h);
        }
    },

    _coverageMask: null,

    // this computes a 2d boolean grid (same size as map of durham) to identify which tiles currently aren't being covered by foodstalls
    // actually quite similar to my heatmap logic, but I needed it per-square, and to give quick lookups
    update_mask_of_fstall_coverage(foodStalls, map) {
        // I needed some sort of way of quickly representing the map, so I picked the mask technique
        const height_of_map = map.length;
        const width_of_map = map[0].length;
        const check_npc_coverage_mask = Array.from({ length: height_of_map }, () =>
            Array.from({ length: width_of_map }, () => false)
        );

        // i'm determining coverage area of each foodstall
        for (const stall of foodStalls) {
            const start_x_pos_of_food_stall = stall.x - Math.floor(stall.effect_w / 2);
            const start_y_pos_of_food_stall = stall.y - Math.floor(stall.effect_h / 2);

            // each and every tile in the coverage gets its own mark - these will correspond to "non-penalised" tiles (i.e. magic won't drain when interacting inside here)
            for (let y_change = 0; y_change < stall.effect_h; y_change++) {
                for (let x_change = 0; x_change < stall.effect_w; x_change++) {
                    const map_c = start_x_pos_of_food_stall + x_change;
                    const map_r = start_y_pos_of_food_stall + y_change;

                    // quick bounds check
                    if (map_r < 0 || map_c < 0 || map_r >= height_of_map || map_c >= width_of_map) continue;  

                    // as visitors can only be on path tiles, its a tad simpler just to take those into consideration (no visitor will be on any other tile)
                    if (map[map_r][map_c] === 1) {
                        check_npc_coverage_mask[map_r][map_c] = true;
                    }
                }
            }
        }

        // now old mask gets updated to new sweep on this specific atraction
        this._coverageMask = check_npc_coverage_mask;
    },

    // little helper that checks if a tile is in the food stall area
    is_in_foodstall_range(npcs_col, npcs_row) {
        if (!this._coverageMask) return false;
        return this._coverageMask[npcs_row]?.[npcs_col] || false;
    },

    
    // now this calculates how much magic is lost, which is propotional to how many visitors are interacting with an attratcion outside of any foodstall coverage
    calculate_magic_loss_from_lack_of_foodstalls(all_visitors) {
        if (!this._coverageMask) return;

        let overall_magic_loss_from_hunger = 0;

        for (const npc of all_visitors) {
            // Important line! I'm ONLY penalising visitors that are actually visiting an attraction, as part of the core gameplay loop
            // if a visitor's just wandering or standing still, no dramas -magic stays the same. If they're visiting an attraction for a long time without food around though, they're gonna drain magic VERY fast, particualrly if there's lots of them
            if (npc.STATE_OF_NPC !== STATE_OF_NPC.VISITING) continue;
            // pull coords for each visitor
            const npcs_col = npc.vis_col;
            const npcs_row = npc.vis_row;

            // only path tiles not in range have the magic-drain effect applied
            const is_path_tile = (window.currentMap[npcs_row]?.[npcs_col] === 1);
            if (!is_path_tile) continue;

            // IMPORTANT: THIS NEED TO ONLY PENALISE VISITORS THAT ARE INTERACTING WITH ATTRACTIONS
            const is_path_tile_covered = this.is_in_foodstall_range(npcs_col, npcs_row);
            if (!is_path_tile_covered) {
                overall_magic_loss_from_hunger += MAGIC_DEC_FROM_HUNGRINESS; // [DEV NOTE] tune in config.js
            }
        }

        if (overall_magic_loss_from_hunger > 0) {
            Magic.decrease(overall_magic_loss_from_hunger);
        }
    }
};
