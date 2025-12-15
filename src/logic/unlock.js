// this file is responsible for actually unlocking the attractions as the player gains more visitors

import { ALL_ATTRACTIONS_PLACEABLE_ON_MAP } from "./placeableDefinitions.js";

// these are the thresholds of visitors to unlock each attraction type
export const UNLOCK_RULES = [  // [DEV NOTE] Could move these to config.js later?
    // my attractions
    { visitors: 12, id: "kaleidoscope" },
    { visitors: 28, id: "mythical_screen" },
    { visitors: 48, id: "luminescent_webs" },
    { visitors: 70, id: "holographic_bunny" },
    { visitors: 110, id: "light_forest"},

    // ... and stages
    { visitors: 25, id: "music_stage"},
    { visitors: 35, id: "magician_stage"},
    { visitors: 55, id: "singer_stage"},
    { visitors: 85, id: "balloon_stage"},
    { visitors: 120, id: "clown_stage" },

    // and then food stalls
    { visitors: 14, id: "hotdog_stand" },
    { visitors: 26, id: "cotton_candy_stand" },
    { visitors: 45, id: "gyros_stand" },
    { visitors: 72, id: "mulled_wine_stall" },
];

let all_players_unlocked_attractions = new Set();

// now for the logic to actually do the unlocking
export function unlock_attraction(id_of_attr) {
    const attr_that_was_unlocked = ALL_ATTRACTIONS_PLACEABLE_ON_MAP[id_of_attr];
    if (!attr_that_was_unlocked) return; // probably wrong id passed

    if (all_players_unlocked_attractions.has(id_of_attr)) {
        return; // player already had it unlocked
    }

    attr_that_was_unlocked.locked = false; // unlock it
    all_players_unlocked_attractions.add(id_of_attr);

    // now the sidebar gets updated so that it now shows the unlocked version
    if (window.refreshSidebarAffordability) {
        window.refreshSidebarAffordability();
    }

    // annndd show the unlock popup!
    if (window.show_the_unlock_popup) {
        window.show_the_unlock_popup(attr_that_was_unlocked);
    }
}


// i needed a function to go through the unlock criteria and decide which visitors should be available based on player's current visitor cnt
export function check_unlocks(visitors) {
    for (const attr_rule of UNLOCK_RULES) {
        if (visitors >= attr_rule.visitors) {
            unlock_attraction(attr_rule.id);  // make available if durhams visitors > threshold set above
        }
    }
}


// next is the function that's needed to pair w/ resetting the game, moving everything but the starter attractions backed to locked
export function reset_unlocks() {
    all_players_unlocked_attractions.clear();
    for (const [attr_id, attr] of Object.entries(ALL_ATTRACTIONS_PLACEABLE_ON_MAP)) {
        attr.locked = (attr_id !== "string_lights");
    }
    if (window.refreshSidebarAffordability) {
        window.refreshSidebarAffordability();  // refresh the sidebar w/ new unlock
    }
}