// I was getting circular dependencies, so adding this to deal w/ that
export const WIDTH = 50;
export const HEIGHT = 30;

// Then set game constants - this is map size, but to change it you also have to go into styles.css & change the '#grid' repeat values to the same as consts here
export const CONGESTION_UPDATE_INTERVAL = 500;
export const SPAWN_INTERVAL = 10000; // [DEV NOTE]: I'll remove this later but for now it's best to test with freqeunt NPCs coming in
export const MAGIC_DECREASE_W_FRUSTR_RATE = 0.1;  // multiplier hyperparam for game tuning
export const MAGIC_DEC_INTERVAL = 1000; // hyperparam for how often the magic decrement penalty from congestion is applied
export const VISITOR_REDRAW_INTERVAL = 100;
export const VISITOR_CAP = 60; // the most visitors possible for a game (so as not to crash it)