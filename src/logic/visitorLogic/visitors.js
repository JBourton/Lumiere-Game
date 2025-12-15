// This file is responsible for all the npc behaviour. As the visitors arrive, they'll use A* path finding augmented w/ penalties for revisiting attractions to emulate natural movement.

// NOTE: aliasing the existing definitions object so the rest of this file can keep using `placeableDefinitions[...]`
import { ALL_ATTRACTIONS_PLACEABLE_ON_MAP as placeableDefinitions } from '../placeableDefinitions.js'
import * as Resources from '../resources.js'      // I need this as visistors interacting w/ attractions impacts magic useage
import * as Pathfinding from './pathfinding.js'    // this is linking the npc with its movement logic
import { reset_heatmap_counts, register_visitor_on_heatmap, update_heatmap_visual } from '../../components/heatmap.js';
import { VISTOR_MOVE_SPEED } from '../../config.js';
import { repel_from_busy_areas } from './congestion.js'; // for that bit of congestion bias to stop visitors clumping together in same cell en-route to attractions

// Here I'm taking a layered strucured by treating the npc logic as 3 seperate layered: funadmental design, current STATE_OF_NPC and attraction selection logic
// I can then make the architecture nicely decoupled from the main game logic


// Second, I define the actual data structure for the npcs_on_map
const npcs_on_map = []
export const STATE_OF_NPC = {  // i.e. a visitor npc can be doing one of these 4 things at any given time
  IDLE: 'idle',
  PICKING: 'pickingTarget',
  MOVING: 'moving',
  VISITING: 'visiting'
}  // but needs to be export so npc renderer can see it

// this helper fetches all attractions currently on the map from the attr_layer layer
// it scans anchor cells in attractions_placed_on_map & pairs them w/ their definitions
function get_all_attractions_on_map() {
  const attr_layer = window.placedObjects  // this is holding the 3rd map layer, i.e. the one with the attraction locations (I defined it in main.js)
  if (!attr_layer) return [];  // edge case here; if no attractions placed theres no need to do next logic

  const attractions_on_map = []

  for (let map_row = 0; map_row < attr_layer.length; map_row++) {  // go through each row/col of layer 3 to look for the anchor cell's id
    for (let map_col = 0; map_col < attr_layer[map_row].length; map_col++) {
      const map_sq = attr_layer[map_row][map_col]  // i.e. one of the squares on the grid-based map (that I'm using as the anchor)

      if (!map_sq || !map_sq.id) continue; //needed because some of my map sqs are undefined (with 0 value, namely the static imgs of durham locations)
      const obj_on_the_map = placeableDefinitions[map_sq.id]
      if (!obj_on_the_map) {  // need to check if there's actually anythign to go towards
        continue
      }

      attractions_on_map.push({
        defId: map_sq.id,  // I'm pulling the id from the actual map of durham here
        // position (anchor tile on the attr_layer)
        col: map_col, row: map_row,
        // here I fetch the runtime state from the map square
        capacity: obj_on_the_map.capacity ?? 0, visitTime: obj_on_the_map.visitTime ?? 0, magicGain: obj_on_the_map.magicGain ?? 0, // these ones are all defined in placeableDefinitions
        currentVisitors: map_sq.currentVisitors || 0, // each attraction has a "currently visiting" amount of npcs, which is used in placementPreview too
        cellRef: map_sq
      })
    }
  }

  return attractions_on_map
}

// Now I define a function that creates the npc
export function spawn_new_visitor() {
  // ensure visitor spawns on a valid path, not attraction/undefined square
  const curr_map = window.currentMap;
  if (!curr_map) { // no map avaialbe to work with (should actually never be the case though)
    return null;
  }

  const height_of_map = curr_map.length;
  const width_of_map = curr_map[0].length;
  const all_valid_border_spawn_sqs = []; // i'm tracking each valid map square on the outskirts of the map

  // now I compile the list of valid map squares for a visitor to enter the map on
  for (let map_col = 0; map_col < width_of_map; map_col++) {// start w/ top & bottom rows
    if (curr_map[0][map_col] === 1) {
      all_valid_border_spawn_sqs.push({row:0,col:map_col});
    }
    if (curr_map[height_of_map -1][map_col] ===1) {
      all_valid_border_spawn_sqs.push({ row: height_of_map -1, col: map_col});
    }
  }
  for (let map_row =1; map_row< height_of_map; map_row++) { // now left & right cols w/out corners (to avoid duplicating above)
    if (curr_map[map_row][0] ===1) {
      all_valid_border_spawn_sqs.push({ row:map_row, col:0});
    }
    if (curr_map[map_row][width_of_map -1] ===1) {
      all_valid_border_spawn_sqs.push({row:map_row, col:width_of_map-1});
    }
  }

  // %%% now i have all of the valid spawn sqs, i pick a random one %%%

  if (all_valid_border_spawn_sqs.length ===0) {
    return null; // this'll only trigger if the map is setup wrong though; as I've set it up, this is never needed as there are plenty of valid spawn points
  }

  const the_random_spawn_point = all_valid_border_spawn_sqs[Math.floor(Math.random() * all_valid_border_spawn_sqs.length)];
  const vis_row = the_random_spawn_point.row;
  const vis_col = the_random_spawn_point.col;

  const npc = {
    id: crypto.randomUUID(), // set a random id
    vis_col,
    vis_row,
    path: [],  // no path has been taken initially
    pathIndex: 0,
    STATE_OF_NPC: STATE_OF_NPC.IDLE,  // when npc spawns they 1st do nothing
    targetId: null,  // the id on the map of the next attraction to visit
    interactionTimer: 0,  // timing how long the npcs has been interacting w/ the current attraction
    interactionTotal: 0, // count how long the visitor's been at the attraction
    visitor_move_cooldown: VISTOR_MOVE_SPEED,  // (set above so can be changed througout dev)
    lastVisited_memory: {} // I designed this so that the npc 'remembers' when it last visited attractions, so more natural pathfinding behaviour can be coded
  }

  // now the game's updated to account for the new visitor
  npcs_on_map.push(npc)  
  Resources.Visitors.add(1)
  return npc
}

// now the visitor seeks out the next attraction
function select_next_attraction(npc_to_move, attractions_on_map) {
  let best_attr_score = 0;  // each attraction will be assigned a score determining how good of a fit it is for natural pathfinding
  let best_attr_to_visit = null;  // this holds the most valid attraction object
  const time_right_now = performance.now()  // this is a browser api responsible for timing and I use it in to check how recently an attraction was visited

  const RECENTLY_VISITED_DEFINITION = 30000; // i.e. how long has to pass (in ms) for an attraction to no longer be classed as "recently visited"

  // here I'm looping through all attractions
  for (const att of attractions_on_map) {
    const def = placeableDefinitions[att.defId];
    if (!def || !def.capacity) continue

    // then calculating distance from npc->attraction
    const dist_col = att.col - npc_to_move.vis_col;
    const dist_row = att.row - npc_to_move.vis_row;
    const distance_to_attr = Math.abs(dist_col) + Math.abs(dist_row);  // just basic manhattan distance here as the npcs can move in 4 directions just like the player

    // use the attraction's anchor coordinates as its identity key
    const memKey = `${att.col},${att.row}`

    // then checking when the npc last visited it
    const last_visited = npc_to_move.lastVisited_memory[memKey];  // pull time out of storage
    const recentlyVisited = last_visited && (time_right_now - last_visited < RECENTLY_VISITED_DEFINITION);  // i.e. make this true if there's a stored timestamp (was visited before) AND was visited in the last Xs (controlled by hyperparam above)

    const baseScore = def.baseScore ?? 1;  // default to 1 if not explicitly set

    // now the core logic: this is the formula i use to determine suitability of an attraction for a given npc
    const specific_attr_score =
      baseScore -  // i.e. how attractive an attraction is by default
      distance_to_attr * 0.05 -  // then how far away it is
      (att.currentVisitors >= def.capacity ? 2 : 0) - // then how crowded the path to it is
      (recentlyVisited ? 3 : 0)  // and fininally how recently it was visited by an npc

    // review for each attraction whether this is now the best attraction to navigate
    if (specific_attr_score > best_attr_score) {
      best_attr_score = specific_attr_score
      best_attr_to_visit = att
    }
  }

  return best_attr_to_visit
}


// this function is responsible for updating all npc-related states
// I run it once/frame for every NPC
function npc_central_controller(npc, time_change) {
  // PURPOSE: to update NPC state, if it should move/interact and if it should pick new attraction

  // move npc state to the next suitable action
  switch (npc.STATE_OF_NPC) {
    // firstly, idle's not good, as it can't just stand around doing nothing - thus, it picks an attraction to visit
    case STATE_OF_NPC.IDLE:
      npc.STATE_OF_NPC = STATE_OF_NPC.PICKING
      break

    // if npc's ready to pick, the function to do so is ran for it
    case STATE_OF_NPC.PICKING: {
        const attractions = get_all_attractions_on_map()
        const next_target_attr = select_next_attraction(npc, attractions)

        if (!next_target_attr) {
            // No attractions available → wander to a random path tile on the entire map
            const next_target_to_walk_too = pick_random_path_destination(npc);

            if (!next_target_to_walk_too) {
            npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
            return;
            }

            const path = Pathfinding.run_full_Astar(
            npc.vis_col,
            npc.vis_row,
            next_target_to_walk_too.col,
            next_target_to_walk_too.row
            );

            if (!path || path.length === 0) {
            npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
            return;
            }

            npc.path = path;
            npc.pathIndex = 0;
            npc.goalCol = next_target_to_walk_too.col;
            npc.goalRow = next_target_to_walk_too.row;
            npc.STATE_OF_NPC = STATE_OF_NPC.MOVING;

            return;  
        }

        // use the attraction's coordinates as the target identifier
        npc.targetId = `${next_target_attr.col},${next_target_attr.row}`

        // the next step is to select a path (I segmented this logic into pathfinding.js, and I'm calling it here)
        const walkable_spots = Pathfinding.finding_nearest_path_walkable(next_target_attr.col, next_target_attr.row);
        if (walkable_spots.length === 0) {
            // here there's no valid tiles adjacant to the npc that they can actually go to, so I setup a random destination search
            const next_target_to_walk_too = pick_random_path_destination(npc);

            if (!next_target_to_walk_too) {
                npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
                return;
            }

            // get the path, whether that's random or an actual destination
            const path = Pathfinding.run_full_Astar(npc.vis_col,npc.vis_row, next_target_to_walk_too.col, next_target_to_walk_too.row);

            if (!path || path.length === 0) {
                npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
                return;
            }

            npc.path = path;
            npc.pathIndex = 0;
            npc.goalCol = next_target_to_walk_too.col;
            npc.goalRow = next_target_to_walk_too.row;
            npc.targetId = null; // clear target since we're wandering
            npc.STATE_OF_NPC = STATE_OF_NPC.MOVING;
            return;
        }

        // Try each walkable candidate in order of distance until we find one that's actually reachable
        let reachable_target = null;
        for (const candidate of walkable_spots) {
            // If NPC is already at this tile, we can visit immediately
            if (npc.vis_col === candidate.col && npc.vis_row === candidate.row) {
                reachable_target = candidate;
                break;
            }

            // Otherwise, validate reachability with A* pathfinding
            const path = Pathfinding.run_full_Astar(
                npc.vis_col,
                npc.vis_row,
                candidate.col,
                candidate.row
            );

            // If we found a valid path to this candidate, use it
            if (path && path.length > 0) {
                reachable_target = candidate;
                npc.path = path;
                npc.pathIndex = 0;
                break;
            }
            // Otherwise, continue to the next candidate
        }

        if (!reachable_target) {
            // None of the adjacent walkable tiles are reachable - try a random destination instead
            console.warn(`[NPC] Could not find reachable path to attraction at (${next_target_attr.col},${next_target_attr.row}). Attempting to wander instead.`);
            const next_target_to_walk_too = pick_random_path_destination(npc);

            if (!next_target_to_walk_too) {
                npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
                return;
            }

            const path = Pathfinding.run_full_Astar(
                npc.vis_col,
                npc.vis_row,
                next_target_to_walk_too.col,
                next_target_to_walk_too.row
            );

            if (!path || path.length === 0) {
                npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
                return;
            }

            npc.path = path;
            npc.pathIndex = 0;
            npc.goalCol = next_target_to_walk_too.col;
            npc.goalRow = next_target_to_walk_too.row;
            npc.targetId = null; // clear target since we're wandering
            npc.STATE_OF_NPC = STATE_OF_NPC.MOVING;
            return;
        }

        // If NPC is already at a valid adjacent tile, go straight to visiting
        if (npc.vis_col === reachable_target.col && npc.vis_row === reachable_target.row) {
            visit_new_attraction(npc);
            break;
        }
        
        npc.goalCol = reachable_target.col;
        npc.goalRow = reachable_target.row;
        npc.STATE_OF_NPC = STATE_OF_NPC.MOVING;
        break;
    }

    // next is checking that (if the npcs is moving) they've reached their destination, and if so, "visit" the attraction
    case STATE_OF_NPC.MOVING: {
      if (!npc.path || npc.pathIndex >= npc.path.length) {
        // npc's reached it so now it interacts
        visit_new_attraction(npc)
        break
      }

      // check each step if a new/better attraction has been placed
      const attractions = get_all_attractions_on_map()
      const better_target = select_next_attraction(npc, attractions)
      
      if (better_target && npc.targetId !== `${better_target.col},${better_target.row}`) {
        // found a better attraction, try to reroute - but only if we can reach it
        const walkable_spots = Pathfinding.finding_nearest_path_walkable(better_target.col, better_target.row)
        
        if (walkable_spots.length > 0) {
          // Try to find a reachable candidate
          let reachable_target = null;
          for (const candidate of walkable_spots) {
            const new_path = Pathfinding.run_full_Astar(
              npc.vis_col,
              npc.vis_row,
              candidate.col,
              candidate.row
            )
            
            if (new_path && new_path.length > 0) {
              reachable_target = candidate;
              npc.path = new_path;
              npc.pathIndex = 0;
              npc.goalCol = candidate.col;
              npc.goalRow = candidate.row;
              break;
            }
          }
          
          if (reachable_target) {
            npc.targetId = `${better_target.col},${better_target.row}`;
          }
          // If no reachable target found, keep current path
        }
      }

      // now, the move can only happen if the npc isn't on a cooldown
      npc.visitor_move_cooldown -= time_change;
      if (npc.visitor_move_cooldown > 0) break; // it's not their time to move yet!

      // otherwise, keep on moving this round
      // I determine default next step from the visitors current path
      let npcs_next_path = npc.path[npc.pathIndex];

      // firstly, i try to repel visitors if they're congested in the same space
      const { bias_on_x, bias_on_y } = repel_from_busy_areas(npc.vis_col, npc.vis_row);

      // but i only apply steering if theres actually meaningful congestion; otherwise no point
      if (bias_on_x !== 0 || bias_on_y !== 0) {
          // so looking at immediate path + 1 step ahead
          const valid_next_step_list = [npcs_next_path];
          if (npc.path[npc.pathIndex + 1]) {
              valid_next_step_list.push(npc.path[npc.pathIndex + 1]);
          }

          // now I'm picking the next valid step alining w/ my seperation bias function (see congestion.js for it)
          let the_best_path = npcs_next_path;
          let best_score = -Infinity;

          for (const candidate of valid_next_step_list) {
              const change_over_x = candidate.col - npc.vis_col;
              const change_over_y = candidate.row - npc.vis_row;

              // i construct a metric to pick the best path based on offset from busy areas
              const appropriateness_of_directional_shift = change_over_x * bias_on_x + change_over_y * bias_on_y;

              // see if this iteration is actually a better path
              if (appropriateness_of_directional_shift > best_score) {
                  best_score = appropriateness_of_directional_shift;
                  the_best_path = candidate;
              }
          }

          npcs_next_path = the_best_path;
      }

      npc.vis_col = npcs_next_path.col
      npc.vis_row = npcs_next_path.row
      npc.pathIndex++
      npc.visitor_move_cooldown = VISTOR_MOVE_SPEED  // this is the inverval they wait per move
      break
    }

    // finally, check if the npc has finished visiting
    case STATE_OF_NPC.VISITING:
      npc.interactionTimer -= time_change
      if (npc.interactionTimer <= 0) {
        finish_visiting_attraction(npc)
      }
      break
  }
}


// have to handle logic of attraction visiting, which i used 2 distinct functions for

// the 1st function starts the visit
function visit_new_attraction(npc) {
  if (!npc.targetId) {
    npc.STATE_OF_NPC = STATE_OF_NPC.IDLE
    return
  }

  const [targetCol, targetRow] = npc.targetId.split(',').map(Number)
  const attraction = get_all_attractions_on_map().find(a => a.col === targetCol && a.row === targetRow)
  if (!attraction) {
    npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
    return
  }

  const placeable_thing_present = placeableDefinitions[attraction.defId] ; // fetch curr attraction by it's id

  // keep the runtime visitor count on the anchor cell itself
  attraction.cellRef.currentVisitors = (attraction.cellRef.currentVisitors || 0) + 1

  npc.interactionTimer = placeable_thing_present.visitTime;
  npc.interactionTotal = placeable_thing_present.visitTime;
  npc.STATE_OF_NPC = STATE_OF_NPC.VISITING;
}

// and the 2nd function ends it
function finish_visiting_attraction(npc) {
  if (!npc.targetId) {
    npc.STATE_OF_NPC = STATE_OF_NPC.IDLE
    return
  }

  const [targetCol, targetRow] = npc.targetId.split(',').map(Number)
  const attraction = get_all_attractions_on_map().find(a => a.col === targetCol && a.row === targetRow)

  if (attraction) {
    // decrement visitor count on the anchor cell (clamped at 0)
    const current = attraction.cellRef.currentVisitors || 0;
    attraction.cellRef.currentVisitors = Math.max(0, current - 1);

    const placed_attr_def = placeableDefinitions[attraction.defId];

    // now update the magic bar based based on the preset value for this particular attraction
    Resources.Magic.increase(placed_attr_def.magicGain);

    // update NPC lastVisited_memory (keyed by coordinate)
    npc.lastVisited_memory[npc.targetId] = performance.now();
  }

  // now the npc can go back to idle mode (the preliminary before looking for a new attraction to visit)
  npc.STATE_OF_NPC = STATE_OF_NPC.IDLE;
  npc.targetId = null;
  npc.path = [];
  npc.pathIndex = 0;
  npc.interactionTimer = 0;
  npc.interactionTotal = 0;
}


// a function for publicly updating the npcs
export function update_npc_system(time_change) {
  reset_heatmap_counts(); // this frame, also update hmap
  for (const npc of npcs_on_map) {
    npc_central_controller(npc, time_change);
    const npc_col = Math.floor(npc.vis_col);
    const npc_row = Math.floor(npc.vis_row);
    register_visitor_on_heatmap(npc_col, npc_row);
  }
  update_heatmap_visual(); // then resetting visual overlay for hmap
}


// a little utility that returns all npc objs currently on the map
export function getnpcs_on_map() {
  return npcs_on_map
}


// I wanted to expand the idle walking part to be a bit more realistic; that's where this function comes in, which firstly identifies all possible paths on the map for walking
function get_all_walkable_path_tiles() {
  const map = window.currentMap;
  const staticLayer = window.currentStatics;
  const placedLayer = window.placedObjects;

  const tiles = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {

      // must be a path tile
      if (map[row][col] !== 1) continue;

      // avoid static objects
      if (staticLayer[row] && staticLayer[row][col]) continue;

      // avoid placed attractions
      if (placedLayer[row] && placedLayer[row][col]) continue;

      tiles.push({ col, row });
    }
  }

  return tiles;
}

// then this uses above to actually generate a random path based on valid tile movements
function pick_random_path_destination(npc) {
  const all = get_all_walkable_path_tiles();
  if (all.length === 0) return null;

  // remove current tile to avoid picking the tile they stand on
  const filtered = all.filter(t => !(t.col === npc.vis_col && t.row === npc.vis_row));

  if (filtered.length === 0) return null;

  // pick random tile anywhere on the map
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// as part of the game reset
export function remove_all_visitors() {
  // all visitors are popped off the map queue
  while (npcs_on_map.length > 0) {
    npcs_on_map.pop();
  }
  Resources.Visitors.set(0);
  reset_heatmap_counts();  // heatmap is tied to this so I'm calling those functions to clear it
  update_heatmap_visual();
}
