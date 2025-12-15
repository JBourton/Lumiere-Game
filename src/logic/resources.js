/* This file holds all the info about resource tracking throughout the game - a very important one to the fundamental logic
Also it's tied in VERY closely with machinations diagram 01: this should make it easier to mark */


/* Constant 1 (most important, as its vital to gameplay): MAGIC meter! */
export const Magic = {
    mgc_value: 10, // I've decided to set the magic at 10%; that way, the player has movement to increase or decrease magic from the get-go
    listeners: [],

    // there's a listner set up just for magic
    addListener(fn) {this.listeners.push(fn);},
    notify() {this.listeners.forEach(fn => fn(this.mgc_value));},

    // fetch % of magic
    get() {return this.mgc_value;},

    // increase & decrease magic, which will be used all througout the game constantly as visitors interact/leave
    increase(amount) {
        this.mgc_value = Math.min(100, this.mgc_value + amount); // first capping at 100% (its a meter)
        this.mgc_value = Number(this.mgc_value.toFixed(1)); // to stop the weird rouding bug
        this.notify();
    },

    decrease(amount) {
        this.mgc_value = Math.max(0, this.mgc_value - amount); // and then capping at 0%
        this.mgc_value = Number(this.mgc_value.toFixed(1));
        this.notify();
    },

    set_mgc(new_mgc_lvl) { // I use that in reset game to just hard-set it
        this.mgc_value = new_mgc_lvl;
        this.notify(); // say hi to the listners (so ui can update)
    }
}

/* Constant 2: Staff count. Here we're tracking how many staff the player has to run their attractions */
export const Staff = {
    // my rule: spending staff (placing attractions) reduces 'available' but not 'total_awarded'
    base_awarded: 1,  // starting val of staff for player to start off w/
    available: 1,  // num staff for player to "spend" running attrations
    total_awarded: 1, // amnt staff granted by gameplay (proportional to visitors)
    listeners: [],

    addListener(fn) { this.listeners.push(fn); },
    notify() { this.listeners.forEach(fn => fn(this.available)); },

    // fetch num of available staff (what UI and placement logic should read)
    get() { return this.available; },

    // fetch total staff awarded by the game (used when deciding to award more staff based on visitors)
    get_total_awarded() { return this.total_awarded; },

    // this is the starting staff amnt, added here to be used in main.js's logic
    get_base_awarded() { return this.base_awarded; },

    // this represents "hiring" new staff
    add(amount) {
        this.available += amount;
        this.total_awarded += amount;
        this.notify();
    },

    // remove (spend) staff from the available staff cnt when placing attractions.
    remove(amount) {
        this.available = Math.max(0, this.available - amount);
        this.notify();
    },

    // set currently available staff
    set_stf(new_stf_cnt) {
        this.available = new_stf_cnt;
        this.total_awarded = new_stf_cnt;
        this.base_awarded = new_stf_cnt;
        this.notify();
    }
}

// Cosntant 3: the visitor count, i.e. how many visitors are milling about Durham city, based on how well the player is doing.
export const Visitors = {
    visitor_cnt: 0,
    listeners: [],

    // another listner set up for visitor cnt this time
    addListener(fn) {this.listeners.push(fn);},
    notify() {this.listeners.forEach(fn => fn(this.visitor_cnt));},

    // getting num of visitors
    get() {return this.visitor_cnt;},

    add(amount) {
        this.visitor_cnt += amount;  // similarily due to the feedback loop there's no need to put a constraint on upper limit of visitors in the city
        this.notify();
    },

    remove(amount) {
        this.visitor_cnt = Math.max(0, this.visitor_cnt - amount);  // again a lower limit as you can't have negative visitors
        this.notify();
    },

    set_vstrs(new_vstr_cnt) {
        this.visitor_cnt = new_vstr_cnt;
        this.notify();
    }
}  // [DEV NOTE]: could actually just make this into one reusable function to avoid replication later

/* Constant 4: Visitor frustraution. This one is complicated one, a bit like magic as its a progress bar.
The extra layer of depth is that it will change colour for each threshold (Happy, Miffed, Irritated, Annoyed) but that's implemented elsewhere*/
export const Frustration = {
    frustration_lvl: 0,
    listeners: [],

    // a linstenr for the frustration lvl
    addListener(fn) { this.listeners.push(fn); },
    notify() { this.listeners.forEach(fn => fn(this.frustration_lvl)); },

    // again just getting level of visitor frustration
    get() { return this.frustration_lvl; },

    // Standard checks just like the magic bar above
    increase(amount) {
        this.frustration_lvl = Math.min(100, this.frustration_lvl + amount); // % again so capped at 100
        this.notify();
    },
    decrease(amount) {
        this.frustration_lvl = Math.max(0, this.frustration_lvl - amount); // and thresholded at 0
        this.notify();
    },
    set_frust(new_frust_lvl) {
        const NORMALISE_FRUST_INC = 1; // [DEV NOTE] this is a tuneable parameter for balancing game
        this.frustration_lvl = new_frust_lvl * NORMALISE_FRUST_INC;
        this.notify();
    },
    map_frust_tier() { // used for calculating rate of magic loss due to frustration
        if (this.frustration_lvl <= 25) {
            return 1;
        } else if (this.frustration_lvl <= 50) {
            return 2;
        } else if (this.frustration_lvl <= 75) {
            return 3;
        } else {
            return 4;
        }
    }
}