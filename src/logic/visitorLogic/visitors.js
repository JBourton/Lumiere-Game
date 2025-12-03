// This file is responsible for all the npc behaviour. As the visitors arrive, they'll use A* path finding augmented w/ penalties for revisiting attractions to emulate natural movement.

// NOTE: aliasing the existing definitions object so the rest of this file can keep using `placeableDefinitions[...]`
import { ALL_ATTRACTIONS_PLACEABLE_ON_MAP as placeableDefinitions } from '../placeableDefinitions.js'
import * as Resources from '../resources.js'      // I need this as visistors interacting w/ attractions impacts magic useage
import * as Pathfinding from './pathfinding.js'    // this is linking the npc with its movement logic
//import { getAttractions } from '../map.js'  // [TO BE IMPLEMENTED]

// Here I'm taking a layered strucured by treating the npc logic as 3 seperate layered: funadmental design, current STATE_OF_NPC and attraction selection logic
// I can then make the architecture nicely decoupled from the main game logic


// First, I define the actual data structure for the npcs_on_map
const npcs_on_map = []
const STATE_OF_NPC = {  // i.e. a visitor npc can be doing one of these 4 things at any given time
  IDLE: 'idle',
  PICKING: 'pickingTarget',
  MOVING: 'moving',
  VISITING: 'visiting'
}

// this helper fetches all attractions currently on the map from the attraction_layer layer
// it scans anchor cells in attractions_placed_on_map & pairs them w/ their definitions
function getAttractions() {
  const attraction_layer = window.placedObjects  // this is holding the 3rd map layer, i.e. the one with the attraction locations
  if (!attraction_layer) {
    return []  // and edge case here, if no attractions are placed there's no need to go ahead with all the next logic
  } 

  const attractions_on_map = []

  for (let row = 0; row < attraction_layer.length; row++) {  // go through each row/col of layer 3 to look for the anchor cell's id
    for (let col = 0; col < attraction_layer[row].length; col++) {
      const map_sq = attraction_layer[row][col]  // i.e. one of the squares on the grid-based map (that I'm using as the anchor)
      if (!map_sq || !map_sq.anchor) continue

      const def = placeableDefinitions[map_sq.id]
      if (!def) continue

      attractions_on_map.push({
        // definition linkage
        defId: map_sq.id,
        // position (anchor tile on the attraction_layer)
        x: col,
        y: row,
        // I fetch the runtime state from the map square
        capacity: def.capacity ?? 0,
        visitTime: def.visitTime ?? 0,
        magicGain: def.magicGain ?? 0,
        currentVisitors: map_sq.currentVisitors || 0,
        cellRef: map_sq
      })
    }
  }

  return attractions_on_map
}

// Now I define a function that creates the npc
export function spawn_new_visitor(vis_x_pos, vis_y_pos) {
  const npc = {
    id: crypto.randomUUID(), // set a random id
    vis_x_pos,
    vis_y_pos,
    path: [],  // no path has been taken initially
    pathIndex: 0,
    STATE_OF_NPC: STATE_OF_NPC.IDLE,  // when npc spawns they 1st do nothing
    targetId: null,  // the id on the map of the next attraction to visit
    interactionTimer: 0,  // timing how long the npcs has been interacting w/ the current attraction

    lastVisited_memory: {} // I designed this so that the npc 'remembers' when it last visited attractions, so more natural pathfinding behaviour can be coded
  }

  // now the game's updated to account for the new visitor
  npcs_on_map.push(npc)  
  Resources.Visitors.add(1)
  return npc
}

// now the visitor seeks out the next attraction
function select_next_attraction(npc_to_move, attractions_on_map) {
  let best_attr_score = 0  // each attraction will be assigned a score determining how good of a fit it is for natural pathfinding
  let best_attr_to_visit = null  // this holds the most valid attraction object
  const time_right_now = performance.now()  // this is a browser api responsible for timing and I use it in to check how recently an attraction was visited

  const RECENTLY_VISITED_DEFINITION = 30000 // i.e. how long has to pass (in ms) for an attraction to no longer be classed as "recently visited"

  // here I'm looping through all attractions
  for (const att of attractions_on_map) {
    const def = placeableDefinitions[att.defId]
    if (!def || !def.capacity) continue

    // then calculating distance from npc->attraction
    const dist_x = att.x - npc_to_move.vis_x_pos
    const dist_y = att.y - npc_to_move.vis_y_pos
    const distance_to_attr = Math.abs(dist_x) + Math.abs(dist_y)  // just basic manhattan distance here as the npcs can move in 4 directions just like the player

    // use the attraction's anchor coordinates as its identity key
    const memKey = `${att.x},${att.y}`

    // then checking when the npc last visited it
    const last_visited = npc_to_move.lastVisited_memory[memKey]  // pull time out of storage
    const recentlyVisited = last_visited && (time_right_now - last_visited < RECENTLY_VISITED_DEFINITION)  // i.e. make this true if there's a stored timestamp (was visited before) AND was visited in the last Xs (controlled by hyperparam above)

    const baseScore = def.baseScore ?? 1  // default to 1 if not explicitly set

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
function npc_central_controller(npc, dt) {
  // PURPOSE: to update NPC state, if it should move/interact and if it should pick new attraction

  // move npc state to the next suitable action
  switch (npc.STATE_OF_NPC) {
    // firstly, idle's not good, as it can't just stand around doing nothing - thus, it picks an attraction to visit
    case STATE_OF_NPC.IDLE:
      npc.STATE_OF_NPC = STATE_OF_NPC.PICKING
      break

    // if npc's ready to pick, the function to do so is ran for it
    case STATE_OF_NPC.PICKING: {
      const attractions = getAttractions()
      const next_target_attr = select_next_attraction(npc, attractions)

      if (!next_target_attr) return  // there's a few edge cases (like no attractions placed yet) that need to be accounted for

      // use the attraction's coordinates as the target identifier
      npc.targetId = `${next_target_attr.x},${next_target_attr.y}`

      npc.path = Pathfinding.findPath(
        npc.vis_x_pos,
        npc.vis_y_pos,
        next_target_attr.x,
        next_target_attr.y
      )
      npc.pathIndex = 0

      npc.STATE_OF_NPC = STATE_OF_NPC.MOVING  // now the npc's picked an attraction they need to move towards it
      break
    }

    // next is checking that (if the npcs is moving) they've reached their destination, and if so, "visit" the attraction
    case STATE_OF_NPC.MOVING: {
      if (!npc.path || npc.pathIndex >= npc.path.length) {
        // npc's reached it so now it interacts
        visit_new_attraction(npc)
        break
      }

      // otherwise, keep on moving this round
      const next = npc.path[npc.pathIndex]
      npc.vis_x_pos = next.x
      npc.vis_y_pos = next.y
      npc.pathIndex++
      break
    }

    // finally, check if the npc has finished visiting
    case STATE_OF_NPC.VISITING:
      npc.interactionTimer -= dt
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

  const [targetX, targetY] = npc.targetId.split(',').map(Number)
  const attraction = getAttractions().find(a => a.x === targetX && a.y === targetY)
  if (!attraction) {
    npc.STATE_OF_NPC = STATE_OF_NPC.IDLE
    return
  }

  const def = placeableDefinitions[attraction.defId]

  // keep the runtime visitor count on the anchor cell itself
  attraction.cellRef.currentVisitors = (attraction.cellRef.currentVisitors || 0) + 1

  npc.interactionTimer = def.visitTime
  npc.STATE_OF_NPC = STATE_OF_NPC.VISITING
}

// and the 2nd function ends it
function finish_visiting_attraction(npc) {
  if (!npc.targetId) {
    npc.STATE_OF_NPC = STATE_OF_NPC.IDLE
    return
  }

  const [targetX, targetY] = npc.targetId.split(',').map(Number)
  const attraction = getAttractions().find(a => a.x === targetX && a.y === targetY)

  if (attraction) {
    // decrement visitor count on the anchor cell (clamped at 0)
    const current = attraction.cellRef.currentVisitors || 0
    attraction.cellRef.currentVisitors = Math.max(0, current - 1)

    const placed_attr_def = placeableDefinitions[attraction.defId]

    // now update the magic bar based based on the preset value for this particular attraction
    Resources.Magic.increase(placed_attr_def.magicGain)

    // update NPC lastVisited_memory (keyed by coordinate)
    npc.lastVisited_memory[npc.targetId] = performance.now()
  }

  // now the npc can go back to idle mode (the preliminary before looking for a new attraction to visit)
  npc.STATE_OF_NPC = STATE_OF_NPC.IDLE
  npc.targetId = null
  npc.path = []
  npc.pathIndex = 0
}


// a function for publicly updating the npcs
export function update(dt) {
  for (const npc of npcs_on_map) {
    npc_central_controller(npc, dt)
  }
}


// a little utility that returns all npc objs currently on the map
export function getnpcs_on_map() {
  return npcs_on_map
}
