// I was getting circular dependencies, so adding this to deal w/ that
export const WIDTH = 50;
export const HEIGHT = 30;


// %%%%%%%%%%%% The following are my game's hyperparams %%%%%%%%%%
// Note: big numbers (>100) are usually time in ms here


// Variables relating to: Visitor spawning
export const VISTOR_MOVE_SPEED = 1500; //how fast visitor can go around durham
export const VISITOR_REDRAW_INTERVAL = 100; // (not currently used but useful for improving framerate @ high visitor cnt)
export const VISITOR_CAP = 60; // the most visitors possible for a game (so as not to crash it)
// [OLD] // export const SPAWN_INTERVAL = 3000; // [DEV NOTE]: I'll remove this later but for now it's best to test with freqeunt NPCs coming in
// I'm using this to control visitor spawn speed; higher frustration -> slower visitor spawn speed -> easier/slower game (part of my core feedback loop)
export function get_spawn_interval_from_frustration() {
    const tier_of_frust = Frustration.map_frust_tier();

    // busier streets = bad reviews! bad reviews = less visitors coming to Durham - word of mouth is a powerful thing! ;)
    if (tier_of_frust === 1) return 2000;   // i.e. every 2s
    if (tier_of_frust === 2) return 10000;   // and every 10s
    if (tier_of_frust === 3) return 30000;   // then a whole 30s
    return Infinity;  // at this point (tier 4), the player has QUITE enough to stress about, so no new visitors will spawn until this high frustration / busy map is resolved
}


// Varaibles for player move speed
export const PLAYER_MOVE_SPEED = 100;


// Varaibles relating to: Congestion
export const MAGIC_DECREASE_W_FRUSTR_RATE = 0.1;  // multiplier hyperparam for game tuning
export const MAGIC_DEC_INTERVAL_CONGESTION = 1000; // hyperparam for how often the magic decrement penalty from congestion is applied
export const CONGESTION_UPDATE_INTERVAL = 1000;


// Varaibles relating to: food coverage
export const MAGIC_DEC_FROM_HUNGRINESS = 0.07;
export const FOOD_PENALTY_INTERVAL = 1000; 


// Variables relating to: Staff count
export const VISITOR_STAFF_RELATION = 4; // the multiplier of how many staff the player gets to work with, proprotional to visitor cnt, i.e. x visitors per 1 staff