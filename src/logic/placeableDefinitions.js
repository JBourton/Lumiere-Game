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
    },

    kaleidoscope: {
        id: "kaleidoscope",
        name: "Kaleidoscope",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Kaleidoscope%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 2, h: 2,
        locked: false,
        staff_cost: 2,
    },

    mythical_screen: {
        id: "mythical_screen",
        name: "Mythical Screen",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Magical%20Mirror%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 4, h: 4,
        locked: false,
        staff_cost: 3
    },

    luminescent_webs: {
        id: "luminescent_webs",
        name: "Luminescent Webs",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Spider%20Lights%208bit-%20Generated%20by%20ChatGPT.png",
        w: 6, h: 2,
        locked: false,
        staff_cost: 5
    },

    light_forest: {
        id: "light_forest",
        name: "Light Forest",
        type: ATTRACTION_TYPES.LIGHTS,
        img: "assets/imgs/attractions/Light%20Forest%208bit%20-%20Generated%20by%20ChatGPT.png",
        w: 4, h: 4,
        locked: false,
        staff_cost: 8
    },


    // then the stages
    balloon_stage: {
        id: "balloon_stage",
        name: "Balloon Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Balloon%20Stage%20-%20Generated%20by%20ChatGPT.png",
        w: 3, h: 3,
        locked: false,
        staff_cost: 3,
    },

    clown_stage: {
        id: "clown_stage",
        name: "Clown Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Clown%20Stage%20-%20Generated%20by%20ChatGPT.png",
        w: 3, h: 3,
        locked: false,
        staff_cost: 6,
    },

    music_stage: {
        id: "music_stage",
        name: "Music Stage",
        type: ATTRACTION_TYPES.STAGES,
        img: "assets/imgs/stages/Music%20Stage%20-%20Generated%20by%20ChatGPT.png",
        w: 3, h: 3,
        locked: false,
        staff_cost: 8,
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
    },

    hotdog_stand: {
        id: "hotdog_stand",
        name: "Hotdog Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Hotdog%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: false,
        staff_cost: 2,
    },

    cotton_candy_stand: {
        id: "cotton_candy_stand",
        name: "Cotton Candy Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Cotton%20Candy%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: false,
        staff_cost: 3,
    },

    gyros_stand: {
        id: "gyros_stand",
        name: "Gyros Stand",
        type: ATTRACTION_TYPES.FOOD,
        img: "assets/imgs/foodstalls/Gyros%20Stand%20-%20Generated%20by%20ChatGPT.png",
        w: 1, h: 1,
        locked: false,
        staff_cost: 4,
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
// },