// this uses an adapted version of A* pathfinding to guide the visitors to durham city to the different attractions around the map

// So: I'll take a start & end tile, and return a valid path
// but: the file only kknow about walkable v blocked tiles, not actually any of the behvioural decisions for selecting where to go next


// 1st, a quick check that move is within actual bounds allowed
function check_if_move_in_bounds(map_col, map_row) {
    const curr_map_state = window.currentMap; 

    // first checking the map is actually here, though this shouldn't ever be needed unless something's seriously wrong
    if (!curr_map_state || !curr_map_state.length || !curr_map_state[0].length) {
        console.log("[PROBLEM]: The map isn't loading, check this (msg from pathfinding.js")
        return false; // nothing to work with in that case
    }

    // fetching dimensions of the map the check bounds for a*
    const height_of_map = curr_map_state.length;
    const width_of_map = curr_map_state[0].length;

    // all of these have to be true for the bounds check to be a go
    return (
        map_row >= 0 && map_col >= 0 &&
        map_row < height_of_map && map_col < width_of_map
    )
}

// now, I've defined different types of tiles on my map; pavement, grass, blank and, of course, path.
// I now check if a specific tile is indeed a path (and thus walkable)
function can_npc_walk_on_tile(map_col, map_row) {
    // firstly, this grabs the context of the 3 layers and their positions
    const curr_map_state = window.currentMap; 
    const static_buildings_on_map = window.currentStatics;
    const placed_attractions_on_map = window.placedObjects;

    // now, if it's not a valid move, stop right here
    if (!check_if_move_in_bounds(map_col, map_row)) {
        return false;
    }

    const map_cell = curr_map_state[map_row][map_col];

    // only map number = 1 is walkable (path tile)
    const is_map_cell_walkable = (map_cell === 1)
    if (!is_map_cell_walkable) {
        return false; // can't walk on an invalid tile
    }

    // I also need to ensure static buildings aren't a blocker
    if (static_buildings_on_map && static_buildings_on_map[map_row] && static_buildings_on_map[map_row][map_col]) {
        return false;
    }
    
    // Check for attractions & never allow actually stepping onto an attraction tile
    if (placed_attractions_on_map && placed_attractions_on_map[map_row] && placed_attractions_on_map[map_row][map_col]) {
        // This tile has an attraction on it, which is accetpable iff it's at the goal
        return false;
    } // note that visitors don't actually step ON attractions, just pathfind TO adjacent tiles by them

    // all blockers were passed so the visitor's good to go!!
    return true;

}


// next is a function that finds walkable tiles adjacent to the target attraction (looking at whole attr footprint)
export function finding_nearest_path_walkable(attraction_anchor_col, attraction_anchor_row) {
    // First, we need to determine the actual footprint of the attraction (all tiles it occupies)
    const attraction_layer = window.placedObjects;
    const attr_map_sq = attraction_layer[attraction_anchor_row]?.[attraction_anchor_col];

    // 2nd find all tiles that are part of this attraction by scanning outward
    const attraction_tiles = new Set();
    attraction_tiles.add(`${attraction_anchor_col},${attraction_anchor_row}`);
    
    // 3rd i'm now using what I learnt from BFS in L2, I find all map sqs belonging to this attraction (same id, same anchor group)
    const id_of_attr = attr_map_sq.id;
    const Astar_bfs_queue = [{ col: attraction_anchor_col, row: attraction_anchor_row }];
    const has_been_checked = new Set([`${attraction_anchor_col},${attraction_anchor_row}`]);
    
    while (Astar_bfs_queue.length > 0) { // keep exploring until the options have been exhausted
        const mapsq_of_interest = Astar_bfs_queue.shift();//take from front of queue
        const surrounding_map_sqs = [{ col: mapsq_of_interest.col + 1, row: mapsq_of_interest.row }, { col: mapsq_of_interest.col - 1, row: mapsq_of_interest.row },{ col:mapsq_of_interest.col,  row: mapsq_of_interest.row + 1 },{ col: mapsq_of_interest.col, row: mapsq_of_interest.row - 1 }]; // grab all those map sqs around the current sq
        
        // now iterate through all of the surrounding map sqs per a* logic
        for (const one_adj_sq of surrounding_map_sqs) {
            const visited_sq_tracker = `${one_adj_sq.col},${one_adj_sq.row}`;//to identify which map sqs have been visited before
            if (has_been_checked.has(visited_sq_tracker)) continue;
            has_been_checked.add(visited_sq_tracker);
            
            const map_sq = attraction_layer[one_adj_sq.row]?.[one_adj_sq.col];
            if (map_sq && map_sq.id === id_of_attr) {
                attraction_tiles.add(visited_sq_tracker);
                Astar_bfs_queue.push(one_adj_sq);
            }
        }
    }

    // then finding all perimeter tiles to attraction
    const tiles_over_curr_perim = new Set();
    for (const identifier_of_map_sq of attraction_tiles) {
        const [map_col_str_from_grid, map_row_str_from_grid] = identifier_of_map_sq.split(","); // grab the values from the attraction tile list as a str ready for conversion then numeric checking w/ a*
        const map_col = parseInt(map_col_str_from_grid, 10);
        const map_row = parseInt(map_row_str_from_grid, 10);
        const surrounding_map_sqs = [{ col: map_col + 1, row: map_row },{ col: map_col - 1, row: map_row },{ col: map_col, row: map_row+ 1 }, {col: map_col, row: map_row - 1 }]; //note to self: maybe make adjacency logic into little helper function?
        
        // now gather each surrounding neighbor tile over the current perim into the set
        for (const surrounding_nieghbor_sq of surrounding_map_sqs) {
            const surrouding_neighbor_id = `${surrounding_nieghbor_sq.col},${surrounding_nieghbor_sq.row}`;
            // Only add if it's not part of the attraction itself
            if (!attraction_tiles.has(surrouding_neighbor_id)) {
                tiles_over_curr_perim.add(surrouding_neighbor_id);
            }
        }
    }

    // now's for the actual BFS going outwards from all perim tiles to find closest walkable ones
    const queue_for_bfs = [];
    for (const identifier_of_map_sq of tiles_over_curr_perim) {
        const [map_col_str, map_row_str] = identifier_of_map_sq.split(","); // as before
        const map_col = parseInt(map_col_str, 10); // parse in base 10
        const map_row = parseInt(map_row_str, 10);
        queue_for_bfs.push({ col: map_col, row: map_row, dist: 1 });
    }

    const tracking_all_visited_sqs = new Set();
    const all_walkable_routes = [];
    let min_walkable_distance = Infinity;
    while (queue_for_bfs.length > 0) { // now carry out the bfs until options have been explored
        const current_sq_of_interest = queue_for_bfs.shift();
        const tracker_of_map_sq = `${current_sq_of_interest.col},${current_sq_of_interest.row}`;

        // if there's a walkable tile here that's further away there's no point exploring it so search stops right here
        if (current_sq_of_interest.dist > min_walkable_distance) {
            break;
        }
        if (tracking_all_visited_sqs.has(tracker_of_map_sq)) continue; // been looked at
        tracking_all_visited_sqs.add(tracker_of_map_sq);//now put add to explored tracker

        // check if this tile is walkable
        if (can_npc_walk_on_tile(current_sq_of_interest.col, current_sq_of_interest.row, attraction_anchor_col, attraction_anchor_row)) {
            all_walkable_routes.push({ col: current_sq_of_interest.col, row: current_sq_of_interest.row, dist: current_sq_of_interest.dist });
            min_walkable_distance = Math.min(min_walkable_distance, current_sq_of_interest.dist);
            // continue to check other tiles at this same distance
            continue;
        }

        // if not walkable i'm expanding search radius here by checking surrounding map sqs
        // also I found it has potential to spiral indefnitely, so I add a catcher for that to prevent it (its 10 currently)
        if (current_sq_of_interest.dist < 10) {
            queue_for_bfs.push({ col: current_sq_of_interest.col + 1, row: current_sq_of_interest.row, dist: current_sq_of_interest.dist + 1 }, { col: current_sq_of_interest.col - 1, row: current_sq_of_interest.row,     dist: current_sq_of_interest.dist + 1 },
                { col: current_sq_of_interest.col, row: current_sq_of_interest.row + 1, dist: current_sq_of_interest.dist + 1 },{ col: current_sq_of_interest.col,row: current_sq_of_interest.row - 1, dist: current_sq_of_interest.dist + 1 });
        }
    }

    // returning by closest dist 1st
    all_walkable_routes.sort((first_point, second_point) => first_point.dist - second_point.dist);
    return all_walkable_routes;
}


// Next up, a function to reconstruct the map from where the visitor came from
function build_map_back(last_place, end_spot) {
    const visitor_path = [];
    let curr_spot = end_spot;

    while (last_place.has(curr_spot)) {
        const [col_str, row_str] = curr_spot.split(","); // fetching position based off grid
        const map_col = parseInt(col_str, 10); // but they start off as str so have to correct that so I can do calculations
        const map_row = parseInt(row_str, 10);
        
        visitor_path.push({col: map_col, row: map_row}); // now the visitor can move onto the spot logically
        curr_spot = last_place.get(curr_spot);
    }

    visitor_path.reverse();
    return visitor_path;
}


// I'll be using manhattan distance as the heuristic as its what i've learnt before, so I define that here
function h_func_manhatt(onex, twox, oney, twoy) {
    return Math.abs(onex - twox) + Math.abs(oney - twoy)
}

// finally is the actual A* algorithm adaptation,
export function run_full_Astar(vis_start_col, vis_start_row, goal_col, goal_row) {

    // trivial case: already at the attraction
    if (vis_start_col === goal_col && vis_start_row === goal_row) {
        return [];
    }
    //[examiner note]: feel free to uncomment this and check browser console (cntrl+shift+i on chrome) to view the debug result to confirm the pathfinding values
    //console.log(`A* Pathfinding from (${vis_start_col},${vis_start_row}) to (${goal_col},${goal_row})`); 

    // i'm building the str keys for start + end here (easier to store in maps)
    const start_key = `${vis_start_col},${vis_start_row}`;
    const end_key   = `${goal_col},${goal_row}`;
    
    // This is based off my learnings from L2
    const OPEN_PATH_SET = new Set([start_key]); // i.e. there's frontier nodes (paths) that are still needing to be evalulated
    const CLOSED_PATH_SET = new Set(); // these are the paths that have already been expanded
    const cost_so_far = new Map(); // i track total cost up to this point
    cost_so_far.set(start_key, 0);
    const end_cost_predication = new Map();  // and the predicted cost from cost so far + the heuristic
    end_cost_predication.set(start_key, h_func_manhatt(vis_start_col, goal_col, vis_start_row, goal_row));
    const came_from = new Map(); // map of parent pointers i use for reconstructing the path

    // I've specifically blocked diagnols from being allowed here
    const all_valid_directions = [{col: 1,  row: 0}, {col: -1, row: 0},{col: 0,  row: 1}, {col: 0,  row:-1},];

    // and now begins the main A* loop
    while (OPEN_PATH_SET.size > 0) {

        // pick tile in OPEN_PATH_SET with smallest end_cost_predication
        let curr_key = null;
        let curr_best_f = Infinity;

        for (const key of OPEN_PATH_SET) {
            const this_f = end_cost_predication.get(key) ?? Infinity;
            if (this_f < curr_best_f) {
                curr_best_f = this_f;
                curr_key = key;
            }
        }
        if (!curr_key) break; // nothing to evaluate

        // If the chosen tile is goal tile i reconstruct & return full path
        if (curr_key === end_key) {
            const path = build_map_back(came_from, curr_key);
            // [examiner note]: similar line can be used for manual verification of working pathfinding if you want
            //console.log(`[A*] Found path of length ${path.length} from (${vis_start_col},${vis_start_row}) to (${goal_col},${goal_row})`);
            return path;
        }

        // Move current tile out of OPEN_PATH_SET and into CLOSED_PATH_SET
        OPEN_PATH_SET.delete(curr_key);
        CLOSED_PATH_SET.add(curr_key);
        const [curr_col_str, curr_row_str] = curr_key.split(",");
        const curr_col = parseInt(curr_col_str, 10); // parse coords in base 10
        const curr_row = parseInt(curr_row_str, 10);

        // all 4 nieghbor tiles here are checked out
        for (const step of all_valid_directions) {

            const next_col = curr_col + step.col;
            const next_row = curr_row + step.row;
            const next_key = `${next_col},${next_row}`;

            // cant walk on invalid tiles
            if (!can_npc_walk_on_tile(next_col, next_row, goal_col, goal_row)) {
                continue;
            }
            // if path node was already expanded its irgnored here
            if (CLOSED_PATH_SET.has(next_key)) {
                continue;
            }

            const checking_curr_path = (cost_so_far.get(curr_key) ?? Infinity) + 1; // +1 per move
            // its added to open lst the first time its seen
            if (!OPEN_PATH_SET.has(next_key)) {
                OPEN_PATH_SET.add(next_key);
            }
            // all worse paths are skipped over though
            else if (checking_curr_path >= (cost_so_far.get(next_key) ?? Infinity)) {
                continue;
            }

            // as this is the best possible path to the nieghbor, it's now recorded
            came_from.set(next_key, curr_key);
            cost_so_far.set(next_key, checking_curr_path);

            // update the predicted total cost
            const guess_w_hueristic= h_func_manhatt(next_col, goal_col, next_row, goal_row);
            end_cost_predication.set(next_key, checking_curr_path + guess_w_hueristic);
        }
    }

    // at this point there's actually just no valid paths
    //console.warn(`Issue here!! There's actually no A* path found from (${vis_start_col},${vis_start_row}) to (${goal_col},${goal_row})`);
    return [];
}


// my inspriation for this game from both my L2 learnings & the medium article about A* pathfindings in video games: https://al-e-shevelev.medium.com/game-intelligence-in-turn-based-strategies-part-2-pathfinding-5da2205123d2