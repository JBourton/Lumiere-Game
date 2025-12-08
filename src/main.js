// First load in all game componants needed
import { build_grid_map, renderMap } from "./logic/map.js";
import { Player, enablePlayerMovement } from "./logic/playerMovement.js";
import { setupIntroModal } from "./components/popup.js";
import { Magic, Staff, Visitors, Frustration } from "./logic/resources.js";
import { AudioManager } from "./components/audio.js";
import { setupSidebar } from "./components/sidebar.js";
import { initPlacementPreview } from "./logic/placementPreview.js";
import { spawn_new_visitor, update_npc_system } from "./logic/visitorLogic/visitors.js";
import { draw_visitor_sprites_onto_map } from "./components/renderVisitors.js";  // I'm separating vistor gameplay (above) from visitor asthetics

// Then set game constants - this is map size, but to change it you also have to go into styles.css & change the '#grid' repeat values to the same as consts here
const WIDTH = 50;
const HEIGHT = 30;


// these let the dev buttons in DOM 'see' the functions below
window.Magic = Magic;
window.Staff = Staff;
window.Visitors = Visitors;
window.Frustration = Frustration;
// The next part is to set up the trackers for the main resources; i.e. magic, staff & visitors
document.addEventListener("DOMContentLoaded", () => {
    const magicBar = document.getElementById("magic-bar"); // fetch the magic bar to start updating it throught game
    const staffDisplay = document.getElementById("staff-display"); // same w/ staff but as a counter not a bar
    const visitorDisplay = document.getElementById("visitor-display");
    const frustrationBar = document.getElementById("frustration-bar");
    const frustrationLabel = document.getElementById("frustration-label");

    // now setup a listner for both magic & staff
    Magic.addListener(magiclvl => {magicBar.style.width = magiclvl + "%"}); // this updates width of blue 'magic' bar

    // & this updates counter for staff
    Staff.addListener(staffCnt => {
        staffDisplay.textContent = `👷 Staff: ${staffCnt}`;

        if (window.refreshSidebarAffordability) {
            window.refreshSidebarAffordability();
        }
    });



    // & then this updates the counter for total num of visitors
    Visitors.addListener(visCnt => {visitorDisplay.textContent = `👨‍👩‍👧‍👦 Visitors: ${visCnt}`;})

    // finally (and most complex) is the dynamic frustration bar adjusting
   Frustration.addListener(frustrationlvl => {
        frustrationBar.style.height = frustrationlvl + "%";
        if (frustrationlvl <= 25) { // here congestion = low, visitor frustration = low, rate of visitor loss = 0
            frustrationBar.style.background = "limegreen";
            frustrationLabel.textContent = "😀 HAPPY";
        } else if (frustrationlvl <= 50) { // now it's increasing, visitors slowly trickle away
            frustrationBar.style.background = "yellow"; 
            frustrationLabel.textContent = "😐 MIFFED";
        } else if (frustrationlvl <= 75) { // now there's quite a lot of visitors leaving as they're pretty annoyed
            frustrationBar.style.background = "orange";
            frustrationLabel.textContent = "😠 FRUSTRATED";
        } else { // now they're FUMING: player looses visitors really quickly
            frustrationBar.style.background = "red";
            frustrationLabel.textContent = "😡 ANGRY";
        }
    });


    // step 1 here is to initialise w/ current vals
    magicBar.style.width = Magic.get() + "%"; // dynamiclly adjusting width based on current magic %
    staffDisplay.textContent = `👷 Staff: ${Staff.get()}`;
    visitorDisplay.textContent = `👨‍👩‍👧‍👦 Visitors: ${Visitors.get()}`;
    frustrationBar.style.height = Frustration.get() + "%"; // dynamic adjusting of hieght lets the palyer view live updates of visitor frustation
});

// next comes the event listner for the sidebar that let's the player drag/drop the Lumiere items onto the city
document.addEventListener("DOMContentLoaded", () => {
    setupSidebar();
});

// render pop up to introduce player to the game
const funky_background_audio = new AudioManager(); // turning on the tunes!

funky_background_audio.toggleMute();  // [Dev note] Starting on muted because it's annoying when developing, but usually it'll start on unmuted for standard player

setupIntroModal(funky_background_audio);

const muteBtn = document.getElementById("mute-button"); // this event lisnter tracks the mute/unmute button on the top left
muteBtn.textContent = "🔇"; // [Dev note 2] also comment out this line to start on the unmuted emoji
muteBtn.addEventListener("click", () => {
    const ismuted = funky_background_audio.toggleMute();
    muteBtn.textContent = ismuted ? "🔇" : "🔊";  // basically flip whatever the current value is to mute/unmute
});

// Start Lumiere Game! Firstly I'm loading in all the assets for a proper setup
const { map, statics_fixed_on_map, attractions_placed_on_map } = build_grid_map(WIDTH, HEIGHT);
window.currentMap = map; // for the purpose of item placing
window.currentStatics = statics_fixed_on_map;
window.placedObjects = attractions_placed_on_map;

const player = new Player(10, 0, map, statics_fixed_on_map, attractions_placed_on_map);
window.playerInstance = player; // and similarley the player (row,col) pos needs to be globally exposed for adjacency checking w/ item placement

renderMap(map, statics_fixed_on_map, attractions_placed_on_map, player.row, player.col);

enablePlayerMovement(player);

initPlacementPreview(); // allow items to be placed on the grid

// Track player position to only re-render when the player moves
let last_player_row = player.row;
let last_player_col = player.col;

// ---------- Now: The core gameplay loop begins! --------------- //

// a. intialise timings to get the game rythm going
let curr_time_frame = performance.now()
let time_since_last_npc_spawn = 0;
const SPAWN_INTERVAL = 15000; // [DEV NOTE]: I'll remove this later but for now it's best to test with freqeunt NPCs coming in

function lumiere_gameplay_loop(game_timing_data) {
    const change_in_time = game_timing_data - curr_time_frame; // need to track the timing as game goes along
    curr_time_frame = game_timing_data; // need later

    // now visitors will spawn, for now on a timer and later in line w/ gameplay rules
    time_since_last_npc_spawn += change_in_time; // using this as a clean way to check how long it's been since npc spawn
    if (time_since_last_npc_spawn >= SPAWN_INTERVAL) {  // time to spawn npc!
        spawn_new_visitor(14, 10) // [DEV NOTE]: Spawn on a valid path tile (value 1). Row 10, col 14 is a path
        time_since_last_npc_spawn = 0;  // timeing resets
    }

    // Now NPC behaviour like movement, selecting a fun attraction to go visit + actually visiting happens
    update_npc_system(change_in_time)

    // now re-render the map iff the player actually moved
    if (player.row !== last_player_row || player.col !== last_player_col) {
        last_player_row = player.row;
        last_player_col = player.col;
        renderMap(map, statics_fixed_on_map, attractions_placed_on_map, player.row, player.col);
    }

    // Redraw visitor sprites every frame (they move independently of the player)
    draw_visitor_sprites_onto_map();

    // finally I request the next frame:
    requestAnimationFrame(lumiere_gameplay_loop);
}

// For this I use the predefined fucntion, details found at: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
requestAnimationFrame(lumiere_gameplay_loop)




