// The purpose of this file is to define the attractions that can be placed on the grid

export const ATTRACTION_TYPES = {  // this is just a bit nicer way of defining the 3 different types of attractions, so it can be extended later if needed
    LIGHTS: "Lights", //  most important part of one of the feedback loops: these generate the most magic, but have low amount of people at one time
    STAGES: "Stages",  // then comes the 2nd most important, these can hold lots of people but generate magic slowly
    FOOD: "Food Stalls" // finally the food stalls - essential for maintiaining magic (npcs need to eat after all!) but don't actively generate magic
};


// here I setup a data structure that stores the name and associated img for each light display
export const ALL_ATTRACTIONS_PLACEABLE_ON_MAP = {
    string_lights: {
        id: "string_lights",  // for html/css refrencing
        name: "String Lights",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/String%20Lights%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,  // here I expliclty define the width-height dimensions for the attraction
        locked: false,  // Only items that the player is able to place will have this set to True; this evolves throughout the game as the player reaches higher magic lvls
        staff_cost: 1,
    },

    mythical_screen: {
        id: "mythical_screen",
        name: "Mythical Screen",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/Magical%20Mirror%208bit-%20Generated%20by%20ChatGPT.png",
        w: 4, h: 4,
        locked: false,
        staff_cost: 3
    },

    luminescent_webs: {
        id: "luminescent_webs",
        name: "Luminescent Webs",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/Spider%20Lights%208bit-%20Generated%20by%20ChatGPT.png",
        w: 6, h: 2,
        locked: false,
        staff_cost: 4
    }
};

// Importantly, this has to be globally exposed so it can be used in other files like map.js to enable lvl3 over the map
window.ALL_ATTRACTIONS_PLACEABLE_ON_MAP = ALL_ATTRACTIONS_PLACEABLE_ON_MAP;

