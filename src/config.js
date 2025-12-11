// I was getting circular dependencies, so adding this to deal w/ that
export const WIDTH = 50;
export const HEIGHT = 30;


// %%%%%%%%%%%% The following are my game's hyperparams %%%%%%%%%%
// Note: big numbers (>100) are usually time in ms here


// Variables relating to: Visitor spawning
export const SPAWN_INTERVAL = 3000; // [DEV NOTE]: I'll remove this later but for now it's best to test with freqeunt NPCs coming in
export const VISITOR_REDRAW_INTERVAL = 100; // (not currently used but useful for improving framerate @ high visitor cnt)
export const VISITOR_CAP = 15; // the most visitors possible for a game (so as not to crash it)


// Varaibles relating to: Congestion
export const MAGIC_DECREASE_W_FRUSTR_RATE = 0.1;  // multiplier hyperparam for game tuning
export const MAGIC_DEC_INTERVAL_CONGESTION = 1000; // hyperparam for how often the magic decrement penalty from congestion is applied
export const CONGESTION_UPDATE_INTERVAL = 1000;


// Varaibles relating to: food coverage
export const MAGIC_DEC_FROM_HUNGRINESS = 0.07;
export const FOOD_PENALTY_INTERVAL = 1000; 


// Variables relating to: Staff count
export const VISITOR_STAFF_RELATION = 4; // the multiplier of how many staff the player gets to work with, proprotional to visitor cnt, i.e. x visitors per 1 staff