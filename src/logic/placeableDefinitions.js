// The purpose of this file is to define the attractions that can be placed on the grid

export const ATTRACTION_TYPES = {  // this is just a bit nicer way of defining the 3 different types of attractions, so it can be extended later if needed
    LIGHTS: "Lights", //  most important part of one of the feedback loops: these generate the most magic, but have low amount of people at one time
    STAGES: "Stages",  // then comes the 2nd most important, these can hold lots of people but generate magic slowly
    FOOD: "Food Stalls" // finally the food stalls - essential for maintiaining magic (npcs need to eat after all!) but don't actively generate magic
};


// here I setup a data structure that stores the name and associated img for each light display
export const ALL_ATTRACTIONS_PLACEABLE_ON_MAP = {
    // firstly defining the attractions
    // [DEV NOTE]: Remeber to add ".png" onto the end of imgs, as this causes bugs if its omited
    string_lights: {
        id: "string_lights",  // for html/css refrencing
        name: "String Lights",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/String%20Lights%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,  // here I expliclty define the width-height dimensions for the attraction
        locked: false,  // Only items that the player is able to place will have this set to True; this evolves throughout the game as the player reaches higher magic lvls
        staff_cost: 1,
        capacity: 1,
        visitTime: 12000,
        magicGain: 0.15,
    },

    kaleidoscope: {
        id: "kaleidoscope",
        name: "Kaleidoscope",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Kaleidoscope%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 2, h: 2,
        locked: true,
        staff_cost: 2,
        capacity: 2,
        visitTime: 18000,
        magicGain: 0.3,
    },

    mythical_screen: {
        id: "mythical_screen",
        name: "Mythical Screen",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Magical%20Mirror%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 4, h: 4,
        locked: true,
        staff_cost: 3,
        capacity: 3,
        visitTime: 24000,
        magicGain: 0.45,
    },

    holographic_bunny: {
        id: "holographic_bunny",
        name: "Holographic Bunny",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Holographic%20Bunny%20-%20Generated%20by%20ChatGPT.png",
        w: 2, h: 2,
        locked: true,
        staff_cost: 4,
        capacity: 3,
        visitTime: 21000,
        magicGain: 0.6,
    },

    luminescent_webs: {
        id: "luminescent_webs",
        name: "Luminescent Webs",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Spider%20Lights%208bit-%20Generated%20by%20ChatGPT.png",
        w: 6, h: 2,
        locked: true,
        staff_cost: 5,
        capacity: 4,
        visitTime: 26000,
        magicGain: 0.8
    },

    light_forest: {
        id: "light_forest",
        name: "Light Forest",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Light%20Forest%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 4, h: 4,
        locked: true,
        staff_cost: 8,
        capacity: 6,
        visitTime: 32000,
        magicGain: 1
    },


    // then the stages
        magician_stage: {
        id: "magician_stage",
        name: "Magician Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Magician%20on%20stage%20-%20Generated%20by%20ChatGPT.png",
        w: 2, h: 2,
        locked: true,
        staff_cost: 6,
        capacity: 5,
        visitTime: 60000,
        magicGain: 0.22,
    },

    singer_stage: {
        id: "singer_stage",
        name: "Singer Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Singer%20on%20stage%20-%20Generated%20by%20ChatGPT.png",
        w: 2, h: 2,
        locked: true,
        staff_cost: 8,
        capacity: 8,
        visitTime: 65000,
        magicGain: 0.24,
    },

    balloon_stage: {
        id: "balloon_stage",
        name: "Balloon Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Balloon%20Stage%20-%20Generated%20by%20ChatGPT.png",
        w: 3, h: 3,
        locked: true,
        staff_cost: 12,
        capacity: 14,
        visitTime: 42000,
        magicGain: 0.45,
    },

    clown_stage: {
        id: "clown_stage",
        name: "Clown Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Clown%20Stage%20-%20Generated%20by%20ChatGPT.png",
        w: 3, h: 3,
        locked: true,
        staff_cost: 15,
        capacity: 22,
        visitTime: 48000,
        magicGain: 0.6
    },

    music_stage: {
        id: "music_stage",
        name: "Music Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Music%20Stage%20-%20Generated%20by%20ChatGPT.png",
        w: 3, h: 3,
        locked: true,
        staff_cost: 20,
        capacity: 30,
        visitTime: 52000,
        magicGain: 0.75
    },

    // and finally the food stalls
    popcorn_stand: {
        id: "popcorn_stand",
        name: "Popcorn Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Popcorn%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: false,
        staff_cost: 1,
        effect_w: 3, effect_h: 3,
    },

    hotdog_stand: {
        id: "hotdog_stand",
        name: "Hotdog Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Hotdog%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: true,
        staff_cost: 2,
        effect_w: 5, effect_h: 5,
    },

    cotton_candy_stand: {
        id: "cotton_candy_stand",
        name: "Cotton Candy Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Cotton%20Candy%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: true,
        staff_cost: 3,
        effect_w: 7, effect_h: 7,
    },

    gyros_stand: {
        id: "gyros_stand",
        name: "Gyros Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Gyros%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: true,
        staff_cost: 4,
        effect_w: 9, effect_h: 9,
    },

    mulled_wine_stall: {
        id: "mulled_wine_stall",
        name: "Mulled Wine Stall",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Mulled%20Wine%20Stall%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: true,
        staff_cost: 5,
        effect_w: 11, effect_h: 11,
    },


};  // [DEV NOTE]: If the img isn't rendering, it's probably because it's not added to the ".place-overlay.xyz" css part, so do that!

// Importantly, this has to be globally exposed so it can be used in other files like map.js to enable lvl3 over the map
window.ALL_ATTRACTIONS_PLACEABLE_ON_MAP = ALL_ATTRACTIONS_PLACEABLE_ON_MAP;




// [DEV NOTE] To add more just use this template rather than typing it all out again
// attrac_name: {
//     id: ,
//     name: ,
//     type: ATTRACTION_TYPES.,
//     img: "assets/imgs/ ,
//     w: , h: ,
//     locked: ,
//     staff_cost: ,
//     capacity: ,
//     visitTime: ,
//     magicGain: 
// },
// (note it's a tad different for food stalls as they're fundamentally different: they have effect_w and _h to cover an area with their effect)