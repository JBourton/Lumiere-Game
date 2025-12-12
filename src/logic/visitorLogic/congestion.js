import { SCALE_DOWN, HMAP_ROWS, HMAP_COLS, get_hmap_grid_for_congestion } from "../../components/heatmap.js";
import { Frustration } from "../resources.js";  // more congestion == more frustration (Lumiere's too busy, not enough attractions!)
import { STATE_OF_NPC } from "./visitors.js";

const COLLISION_WEIGHT = 7; // [DEV NOTE]: Tuneable hyperparam for making frustration lvl more sensitive (also have one in resources.js but better to use this to compartmentalise logic)


// to grab the locations of npcs from heatmap
let get_all_npc_positions = null; // p.s. this is storing a function, for clarity of how I'm using it below
export function bootup_congestion_system(fetch_npc_places) {
    get_all_npc_positions = fetch_npc_places;
}


// look at all npcs in regions; calculating a/b collisions/region; sum to update total frustruation
export function update_congestion_lvl() {
    if (!get_all_npc_positions) return; // (quick error catch)

    const npc_positions = get_all_npc_positions(); // pull out the function vals
    const hmap = get_hmap_grid_for_congestion(); // i.e. the aggreagted, simplified version of the regular map - per square is computationally heavy so lags performance

    // now computing congestion per (aggregated) hmap cell
    const cong_per_cell = npcs_in_hmap_cell(npc_positions);

    // calling a/b collision detection for NPCs in those aggregated cells
    const global_congetstion_lvl = compute_aabb_visitor_collisions(cong_per_cell, hmap);

    Frustration.set_frust(global_congetstion_lvl);
}


// here I'm mirroring the same grid as the hmap
function npcs_in_hmap_cell(npc_positions) {
    const group_npcs_per_cell = new Map(); // I chose these as they're good key-value pairs for js: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map

    // looking individually at each npc to identify instances of collisions in its proximity
    npc_positions.forEach(npcs_pos => {
        // don't count visitors who are actively VISITING an attraction (don't think that's fair for gameplay)
        if (npcs_pos && npcs_pos.STATE_OF_NPC === STATE_OF_NPC.VISITING) return;
        // to seperate workload, i'm mirroring the heatmap system to place npcs in their hmap 'bucket'
        const group_hmap_x = Math.floor(npcs_pos.vis_col / SCALE_DOWN);
        const group_hmap_y = Math.floor(npcs_pos.vis_row / SCALE_DOWN);

        // valid bound check
        if (group_hmap_x < 0 || group_hmap_x >= HMAP_COLS) return;
        if (group_hmap_y < 0 || group_hmap_y >= HMAP_ROWS) return;

        // fetch id of cell
        const coord_key = `${group_hmap_x},${group_hmap_y}`;

        if (!group_npcs_per_cell.has(coord_key)) {// set coord key directly
            group_npcs_per_cell.set(coord_key, { group_hmap_x, group_hmap_y, npcs: [], collisions: 0 });
        }

        // now the npcs actual map coord (i.e. the wider, non-hmap one) is stored for a/b collision detection within that cell
        group_npcs_per_cell.get(coord_key).npcs.push({
            map_row: npcs_pos.vis_row,
            map_col: npcs_pos.vis_col
        });
    });

    return group_npcs_per_cell;
}


// now for each aggreagated hmap tile, I'm looking at a/b collisions inside it
function compute_aabb_visitor_collisions(npcs_grouped_per_cell, hmap) {
    let global_total_congestion = 0;

    // now iterating through the tiles to find matching coords that collide
    for (const [key, map_tile] of npcs_grouped_per_cell.entries()) {
        const list_of_npcs = map_tile.npcs; // fetch who is actually in this hmap cell
        let collisions_on_this_tile = 0;
        const tile_counts = new Map(); // another for key-val pairs

        // first up, need to check how many npcs are on each (big) map tile
        list_of_npcs.forEach(npc => {
            const indv_tiles_key = `${npc.map_row},${npc.map_col}`;
            tile_counts.set(indv_tiles_key, (tile_counts.get(indv_tiles_key) || 0) + 1);
        });

        // then, for each tile w/ count>1, there's a collision
        for (const [tile, collision_cnt] of tile_counts.entries()) {
            if (collision_cnt > 1) {
                collisions_on_this_tile += (collision_cnt - 1); // collision! logging it...
            }
        }

        // store collision count in that hmap cell
        map_tile.collisions = collisions_on_this_tile;

        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        // This next bit is crucial to my logic: collisions are multiplied by how busy the heatmap square is
        // i.e. if visitors are bumping into each other AND the local vicinity is crowded, that's BAD! 
        // But if they're colliding and nearby vicinity isn't busy, it's not so bad for the player
        // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

        const { group_hmap_x, group_hmap_y } = map_tile;

        // now I read the heatmap multiplier for this tile
        const tier_multiplier = (hmap[group_hmap_y] && typeof hmap[group_hmap_y][group_hmap_x] !== 'undefined')
            ? hmap[group_hmap_y][group_hmap_x]
            : 1;

        // CORE LOGIC!!!
        const incr_in_congestion = collisions_on_this_tile * tier_multiplier * COLLISION_WEIGHT;

        // now add this tile's congestion to global total
        global_total_congestion += incr_in_congestion;
    }
    console.log(`Global total congestion increase: ${global_total_congestion}`);
    return global_total_congestion;
}

