// I was getting circular dependencies, so adding this to deal w/ that
export const WIDTH = 50;
export const HEIGHT = 30;


// %%%%%%%%%%%% The following are my game's hyperparams %%%%%%%%%%
// Note: big numbers (>100) are usually time in ms here


// Variables relating to: Visitor spawning
export const VISTOR_MOVE_SPEED = 2600; //how fast visitor can go around durham
export const VISITOR_REDRAW_INTERVAL = 100; // (not currently used but useful for improving framerate @ high visitor cnt)
export const VISITOR_CAP = 65; // the most visitors possible for a game (so as not to crash it)
export const RECENTLY_VISITED_DEFINITION = 30000; // i.e. how long has to pass (in ms) for an attraction to no longer be classed as "recently visited"
// [OLD] // export const SPAWN_INTERVAL = 3000; // [DEV NOTE]: I'll remove this later but for now it's best to test with freqeunt NPCs coming in
// I'm using this to control visitor spawn speed; higher frustration -> slower visitor spawn speed -> easier/slower game (part of my core feedback loop)
export function get_spawn_interval_from_frustration() {
    const tier_of_frust = Frustration.map_frust_tier();

    // busier streets = bad reviews! bad reviews = less visitors coming to Durham - word of mouth is a powerful thing! ;)
    if (tier_of_frust === 1) return 12000;   // i.e. every 12s
    if (tier_of_frust === 2) return 22000;   // and every 22s
    if (tier_of_frust === 3) return 32000;   // then a whole 32s
    return Infinity;  // at this point (tier 4), the player has QUITE enough to stress about, so no new visitors will spawn until this high frustration / busy map is resolved
}


// Varaibles for player move speed
export const PLAYER_MOVE_SPEED = 85;


// Varaibles relating to: Congestion
export const MAGIC_DECREASE_W_FRUSTR_RATE = 0.12;  // multiplier hyperparam for game tuning
export const MAGIC_DEC_INTERVAL_CONGESTION = 1000; // hyperparam for how often the magic decrement penalty from congestion is applied
export const CONGESTION_UPDATE_INTERVAL = 1000;
export const COLLISION_WEIGHT = 7; //Tuneable hyperparam for making frustration lvl more sensitive (also have one in resources.js but better to use this to compartmentalise logic)


// Varaibles relating to: food coverage
export const MAGIC_DEC_FROM_HUNGRINESS = 0.1;
export const FOOD_PENALTY_INTERVAL = 1000; 


// Variables relating to: Staff count
export const VISITOR_STAFF_RELATION = 2.5; // the multiplier of how many staff the player gets to work with, proprotional to visitor cnt, i.e. x visitors per 1 staff