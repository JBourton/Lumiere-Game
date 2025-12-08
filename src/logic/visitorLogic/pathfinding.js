// this uses an adapted version of A* pathfinding to guide the visitors to durham city to the different attractions around the map
// it takes into account a few different features like how recently an attraction was visited to try to replicate a more natural movement system

// So: I'll take a start & end tile, and return a valid path
// but: the file only konws about walkable v blocked tiles, not actually any of the behvioural decisions for selecting where to go next

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
function can_npc_walk_on_tile(map_col, map_row, attr_col_goal, attr_row_goal) {
    // firstly, this grabs the context of the 3 layers and their positions
    const curr_map_state = window.currentMap; 
    const static_buildings_on_map = window.currentStatics;
    const placed_attractions_on_map = window.placedObjects;

    // now, if it's not a valid move, stop right here
    if (!check_if_move_in_bounds(map_col, map_row)) {
        return false;
    }

    const map_cell = curr_map_state[map_row][map_col];

    // only map number = 1 is walkable (path)
    const is_map_cell_walkable = (map_cell === 1)
    if (!is_map_cell_walkable) {
        return false; // can't walk on an invalid tile
    }

    // I also need to ensure static buildings aren't a blocker
    if (static_buildings_on_map && static_buildings_on_map[map_row] && static_buildings_on_map[map_row][map_col]) {
        return false;
    }
    
    // Check for attractions: they block movement EXCEPT we can pathfind to tiles adjacent to/at the goal attraction
    if (placed_attractions_on_map && placed_attractions_on_map[map_row] && placed_attractions_on_map[map_row][map_col]) {
        // This tile has an attraction on it - only allow if we're at the goal
        // (we don't actually step ON attractions, but we pathfind TO adjacent tiles)
        return false;
    }

    // we passed all the other blockers, so the visitor's good to go!
    return true;

}


// next is a function that finds a path that's adjacent to the target attraction
export function finding_nearest_path_walkable(attraction_col, attraction_row) {
    // Start with tiles adjacent to the attraction and do a BFS to find the closest walkable tile
    const queue = [
        { col: attraction_col + 1, row: attraction_row,     dist: 1 },
        { col: attraction_col - 1, row: attraction_row,     dist: 1 },
        { col: attraction_col,     row: attraction_row + 1, dist: 1 },
        { col: attraction_col,     row: attraction_row - 1, dist: 1 }
    ];

    const visited = new Set();
    const walkable_candidates = [];

    while (queue.length > 0) {
        const current = queue.shift();
        const key = `${current.col},${current.row}`;

        if (visited.has(key)) continue;
        visited.add(key);

        // Check if this tile is walkable
        if (can_npc_walk_on_tile(current.col, current.row, attraction_col, attraction_row)) {
            walkable_candidates.push({ col: current.col, row: current.row, dist: current.dist });
            // Continue searching to find all candidates at this distance
            continue;
        }

        // If not walkable, expand search radius by checking neighbors
        // But only if we haven't gone too far (max 10 tiles away to avoid infinite search)
        if (current.dist < 10) {
            queue.push(
                { col: current.col + 1, row: current.row,     dist: current.dist + 1 },
                { col: current.col - 1, row: current.row,     dist: current.dist + 1 },
                { col: current.col,     row: current.row + 1, dist: current.dist + 1 },
                { col: current.col,     row: current.row - 1, dist: current.dist + 1 }
            );
        }
    }

    // Return candidates sorted by distance (closest first)
    walkable_candidates.sort((a, b) => a.dist - b.dist);
    
    if (walkable_candidates.length > 0) {
        console.log(`[PATHFINDING] Found ${walkable_candidates.length} walkable candidates. Closest at distance ${walkable_candidates[0].dist}`);
    }
    
    return walkable_candidates;
}


// Next up, a function to reconstruct the map from where the visitor came from
function build_map_back(last_place, end_spot) {
    const visitor_path = [];
    let curr_spot = end_spot;

    while (last_place.has(curr_spot)) {
        const [col_str, row_str] = curr_spot.split(","); // fetching position based off grid
        const map_col = parseInt(col_str, 10); // but they start off as string so have to correct that so I can do calculations
        const map_row = parseInt(row_str, 10);
        
        visitor_path.push({col: map_col, row: map_row}); // now the visitor can move onto the spot logically
        curr_spot = last_place.get(curr_spot);
    }

    visitor_path.reverse();
    return visitor_path;
}


// I'll be using manhattan distance as the heuristic, so I define that here
function h_func_manhatt(onex, twox, oney, twoy) {
    return Math.abs(onex - twox) + Math.abs(oney - twoy)
}

// finally is the actual A* algorithm adaptation,
export function run_full_Astar(vis_start_col, vis_start_row, goal_col, goal_row) {

    // trivial case: already at the attraction
    if (vis_start_col === goal_col && vis_start_row === goal_row) {
        console.log(`[A*] Already at destination (${goal_col},${goal_row})`);
        return []; 
    }

    console.log(`[A*] Pathfinding from (${vis_start_col},${vis_start_row}) to (${goal_col},${goal_row})`);

    // build the string keys for start + end (easier to store in maps)
    const start_key = `${vis_start_col},${vis_start_row}`;
    const end_key   = `${goal_col},${goal_row}`;

    // --------------------------------------------------------------
    // OPEN set = frontier of nodes yet to be evaluated
    // CLOSED set = nodes already expanded
    // gScore = real cost from start to this tile
    // fScore = predicted total cost = g + h
    // came_from = map of parent pointers for reconstructing path
    // --------------------------------------------------------------
    const OPEN = new Set([start_key]);
    const CLOSED = new Set();

    const gScore = new Map();
    gScore.set(start_key, 0);

    const fScore = new Map();
    fScore.set(start_key, h_func_manhatt(vis_start_col, goal_col, vis_start_row, goal_row));

    const came_from = new Map();

    // I've specifically blocked diagnols from being allowed here
    const cardinal_steps = [
        {col: 1,  row: 0},
        {col: -1, row: 0},
        {col: 0,  row: 1},
        {col: 0,  row: -1},
    ];

    // and now begins the main A* loop
    while (OPEN.size > 0) {

        // pick tile in OPEN with smallest fScore
        let curr_key = null;
        let curr_best_f = Infinity;

        for (const key of OPEN) {
            const this_f = fScore.get(key) ?? Infinity;
            if (this_f < curr_best_f) {
                curr_best_f = this_f;
                curr_key = key;
            }
        }

        if (!curr_key) break; // nothing to evaluate

        // If the chosen tile *is* the goal, reconstruct & return full path
        if (curr_key === end_key) {
            const path = build_map_back(came_from, curr_key);
            console.log(`[A*] Found path of length ${path.length} from (${vis_start_col},${vis_start_row}) to (${goal_col},${goal_row})`);
            return path;
        }

        // Move current tile out of OPEN and into CLOSED
        OPEN.delete(curr_key);
        CLOSED.add(curr_key);

        // parse coords
        const [curr_col_str, curr_row_str] = curr_key.split(",");
        const curr_col = parseInt(curr_col_str, 10);
        const curr_row = parseInt(curr_row_str, 10);

        // all 4 nieghbor tiles here are checked out
        for (const step of cardinal_steps) {

            const next_col = curr_col + step.col;
            const next_row = curr_row + step.row;
            const next_key = `${next_col},${next_row}`;

            // cannot walk on invalid tiles
            if (!can_npc_walk_on_tile(next_col, next_row, goal_col, goal_row)) {
                continue;
            }

            // if we *already expanded* this node, ignore it
            if (CLOSED.has(next_key)) {
                continue;
            }

            const checking_curr_path = (gScore.get(curr_key) ?? Infinity) + 1; // +1 per move

            // its added to open lst the first time its seen
            if (!OPEN.has(next_key)) {
                OPEN.add(next_key);
            }
            // all worse paths are skipped over though
            else if (checking_curr_path >= (gScore.get(next_key) ?? Infinity)) {
                continue;
            }

            // as this is the best possible path to the nieghbor, it's now recorded
            came_from.set(next_key, curr_key);
            gScore.set(next_key, checking_curr_path);

            // update the predicted total cost
            const h_guess = h_func_manhatt(next_col, goal_col, next_row, goal_row);
            fScore.set(next_key, checking_curr_path + h_guess);
        }
    }

    // at this point there's actually just no valid paths
    console.warn(`[A*] No path found from (${vis_start_col},${vis_start_row}) to (${goal_col},${goal_row})`);
    return [];
}


// my inspriation for this game from the medium article about A* pathfindings in video games: https://al-e-shevelev.medium.com/game-intelligence-in-turn-based-strategies-part-2-pathfinding-5da2205123d2