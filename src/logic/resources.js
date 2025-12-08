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
        this.notify();
    },

    decrease(amount) {
        this.mgc_value = Math.max(0, this.mgc_value - amount); // and then capping at 0%
        this.notify();
    },

    set_mgc(new_mgc_lvl) { // I use that in reset game to just hard-set it
        this.mgc_value = new_mgc_lvl;
        this.notify(); // say hi to the listners (so ui can update)
    }
}

/* Constant 2: Staff count. Here we're tracking how many staff the player has to run their attractions */
export const Staff = {
    staff_cnt: 1,  // the user's starting off with only 1 staff to place the most basic attraction, kind of like a demo of how to play
    listeners: [],

    // another listner set up for staff cnt specifically
    addListener(fn) {this.listeners.push(fn);},
    notify() {this.listeners.forEach(fn => fn(this.staff_cnt));},

    // fetch num of staff
    get() {return this.staff_cnt;},

    add(amount) {
        this.staff_cnt += amount;  // notice how there's no upper limit on staff here; that's because the feedback loops mean that more staff --> busier streets --> harder to control
        this.notify();
    },

    remove(amount) {
        this.staff_cnt = Math.max(0, this.staff_cnt - amount);  // but obviously there's a lower limit as the player can't have -ve staff
        this.notify();
    },

    set_stf(new_stf_cnt) {
        this.staff_cnt = new_stf_cnt;
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
        this.frustration_lvl = new_frust_lvl;
        this.notify();
    }
}