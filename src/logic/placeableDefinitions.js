// The purpose of this file is to define the attractions that can be placed on the grid

// here I setup a data structure that stores the name and associated img for each light display
export const ALL_ATTRACTIONS_PLACEABLE_ON_MAP = {
    string_lights: {
        id: "string_lights",  // for html/css refrencing
        name: "String Lights",
        img: "assets/imgs/String%20Lights%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,  // here I expliclty define the width-height dimensions for the attraction
        locked: false,  // Only items that the player is able to place will have this set to True; this evolves throughout the game as the player reaches higher magic lvls
        staff_cost: 1
    },

    mythical_screen: {
        id: "mythical_screen",
        name: "Mythical Screen",
        img: "assets/imgs/Magical%20Mirror%208bit-%20Generated%20by%20ChatGPT.png",
        w: 4, h: 4,
        locked: false,
        staff_cost: 3
    },

    luminescent_webs: {
        id: "luminescent_webs",
        name: "Luminescent Webs",
        img: "assets/imgs/Spider%20Lights%208bit-%20Generated%20by%20ChatGPT.png",
        w: 8, h: 2,
        locked: true,
        staff_cost: 4
    }
};

// Importantly, this has to be globally exposed so it can be used in other files like map.js to enable lvl3 over the map
window.ALL_ATTRACTIONS_PLACEABLE_ON_MAP = ALL_ATTRACTIONS_PLACEABLE_ON_MAP;

