// First load in all game componants needed
import { build_grid_map, renderMap } from "./logic/map.js";
import { Player, enablePlayerMovement } from "./logic/playerMovement.js";
import { setupIntroModal, setupGameOverModal, setupUnlockPopup, setupTutorialYesOrNoModal, game_over, setupGameWonModal, game_won } from "./components/popup.js";
import { Magic, Staff, Visitors, Frustration } from "./logic/resources.js";
import { AudioManager } from "./components/audio.js";
import { setupSidebar } from "./components/sidebar.js";
import { initPlacementPreview } from "./logic/placementPreview.js";
import { spawn_new_visitor, update_npc_system, getnpcs_on_map, remove_all_visitors } from "./logic/visitorLogic/visitors.js";
import { draw_visitor_sprites_onto_map } from "./components/renderVisitors.js";  // I'm separating vistor gameplay (above) from visitor asthetics
import { draw_on_empty_hmap } from "./components/heatmap.js";  // for the heatmap in top-right
import { update_congestion_lvl, bootup_congestion_system } from "./logic/visitorLogic/congestion.js"; // for monitioring business of the map -> impacts magic
import * as config from "./config.js"; // fixing circular dependencies
import { cleanup_the_map } from "./logic/map.js";
import { FoodCoverage } from "./logic/foodCoverage.js";
import { pause_everything } from "./logic/pause.js";
import { check_unlocks, reset_unlocks } from "./logic/unlock.js";
import { reset_game_impl } from "./restart.js";

// these let the dev buttons in DOM 'see' the functions below
window.Magic = Magic;
window.Staff = Staff;
window.Visitors = Visitors;
window.Frustration = Frustration;

// Global pause flag for play/pause functionality



// this function resets everything back to how it was at game start
function reset_the_game() {     // I've just delegated it all to another file to abstract logic - check restart.js for details
    reset_game_impl({Magic, Staff, Visitors, Frustration,
        clear_all_npcs: window.clear_all_npcs,
        setPlayerPos: (r, c) => { player.row = r; player.col = c; }, setLastPlayerPos: (r, c) => { last_player_row = r; last_player_col = c; }, setCurrTimeFrame: (v) => { curr_time_frame = v; }, setTimeSinceLastNpcSpawn: (v) => { time_since_last_npc_spawn = v; },
        renderMap,
        currentMap: window.currentMap, currentStatics: window.currentStatics, placedObjects: window.placedObjects,
        cleanup_the_map, remove_all_visitors, reset_unlocks, requestAnimationFrame, gameplayLoop: lumiere_gameplay_loop,
        clear_food_coverage: () => {FoodCoverage.redraw_all_food_coverage([]); FoodCoverage._coverageMask = null; window.foodStallAnchors = [];} // clear dom overlays for green food coverage sqs
    });
}



// The next part is to set up the trackers for the main resources; i.e. magic, staff & visitors
document.addEventListener("DOMContentLoaded", () => {
    draw_on_empty_hmap(); // heatmap for top-right

    const magicBar = document.getElementById("magic-bar"); // fetch the magic bar to start updating it throught game
    const magicText = document.getElementById("magic-text"); // fetch the magic text to keep it in sync
    const staffDisplay = document.getElementById("staff-display"); // same w/ staff but as a counter not a bar
    const visitorDisplay = document.getElementById("visitor-display");
    const frustrationBar = document.getElementById("frustration-bar");
    const frustrationLabel = document.getElementById("frustration-label");

    // now setup a listner for both magic & staff
    Magic.addListener(magiclvl => {
        magicBar.style.width = magiclvl + "%"; // first the magic bar
        magicText.textContent = `Magic: ${magiclvl}%`; // then the text display too

        // noooo the player lost the game - restart time!
        if (magiclvl <= 0) {
            game_over();
        } else if (magiclvl >= 100) {
            game_won();
        }
    });

    // & this updates counter for staff
    Staff.addListener(staffCnt => {
        staffDisplay.textContent = `👷 Staff: ${staffCnt}`;

        if (window.refreshSidebarAffordability) {
            window.refreshSidebarAffordability();
        }
    });


    // & then this updates the counter for total num of visitors & sees if player should unlock any more attractions
    Visitors.addListener(visCnt => {visitorDisplay.textContent = `👨‍👩‍👧‍👦 Visitors: ${visCnt}`; check_unlocks(visCnt);})

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
    magicText.textContent = `Magic: ${Magic.get()}%`; // initialize magic text with current value
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

// now play/pause system initialised w/ audio too
pause_everything(funky_background_audio);

// now for all the popups, though only intro modal shows for now (others are win/loss conditions)
setupIntroModal(funky_background_audio);
// Initialize the tutorial modal handlers (modal is hidden by default)
setupTutorialYesOrNoModal();
setupGameOverModal(reset_the_game);  // enabling the game over modal w/ restart logic
setupGameWonModal(reset_the_game); // & game won
setupUnlockPopup(); // + also show one each time player unlocks an item

const muteBtn = document.getElementById("mute-button"); // this event lisnter tracks the mute/unmute button on the top left
muteBtn.textContent = "🔇"; // [Dev note 2] also comment out this line to start on the unmuted emoji
muteBtn.addEventListener("click", () => {
    const ismuted = funky_background_audio.toggleMute();
    muteBtn.textContent = ismuted ? "🔇" : "🔊";  // basically flip whatever the current value is to mute/unmute
});
const hmapBtn = document.getElementById("toggle-heatmap-button");
const heatmapMini = document.getElementById("heatmapMiniContainer");
hmapBtn.addEventListener("click", () => {
    const is_hmap_on = hmapBtn.textContent === "Heatmap: On";
    hmapBtn.textContent = is_hmap_on ? "Heatmap: Off" : "Heatmap: On";
    heatmapMini.style.display = is_hmap_on ? "none" : "block"; // either show/hide heatmap
});


// Start Lumiere Game! Firstly I'm loading in all the assets for a proper setup
const { map, statics_fixed_on_map, attractions_placed_on_map } = build_grid_map(config.WIDTH, config.HEIGHT);
window.currentMap = map; // for the purpose of item placing
window.currentStatics = statics_fixed_on_map;
window.placedObjects = attractions_placed_on_map;
window.foodStallAnchors = [];  // track location of foodstall + its coverage area

const player = new Player(10, 0, map, statics_fixed_on_map, attractions_placed_on_map);
window.playerInstance = player; // and similarley the player (row,col) pos needs to be globally exposed for adjacency checking w/ item placement

renderMap(map, statics_fixed_on_map, attractions_placed_on_map, player.row, player.col);

enablePlayerMovement(player);

initPlacementPreview(); // allow items to be placed on the grid

// Hook congestion system to the NPC provider so it can read NPC positions
bootup_congestion_system(getnpcs_on_map);

// Track player position to only re-render when the player moves
let last_player_row = player.row;
let last_player_col = player.col;

// %%%%%%%%%%%%%% Now: The core gameplay loop begins! %%%%%%%%%%%%%%%%% //

// a. intialise timings to get the game rythm going
let curr_time_frame = performance.now()
let time_since_last_npc_spawn = 0;
let time_since_last_congestion_update = 0;
let time_since_last_magic_decrease_from_congestion = 0;
let time_since_last_visitor_redraw = 0;
let time_since_last_food_penalty = 0;

function lumiere_gameplay_loop(game_timing_data) {
    const change_in_time = game_timing_data - curr_time_frame; // need to track the timing as game goes along
    // If paused, reset current frame time to avoid spike on resume and skip updates
    if (window.gamePaused) {
        curr_time_frame = game_timing_data;
        requestAnimationFrame(lumiere_gameplay_loop);
        return;
    }
    curr_time_frame = game_timing_data; // need later

    // update congestion (but not every frame so as to not lag-out game)
    time_since_last_congestion_update += change_in_time;
    if (time_since_last_congestion_update >= config.CONGESTION_UPDATE_INTERVAL) {
        update_congestion_lvl();
        time_since_last_congestion_update = 0; // timeing resets
    }

    // now visitors will spawn, for now on a timer and later in line w/ gameplay rules
    const dynamic_visitor_spawn_time = config.get_spawn_interval_from_frustration();
    time_since_last_npc_spawn += change_in_time; // using this as a clean way to check how long it's been since npc spawn
    if (time_since_last_npc_spawn >= dynamic_visitor_spawn_time && dynamic_visitor_spawn_time !== Infinity && getnpcs_on_map().length < config.VISITOR_CAP) {  // time to spawn npc!
        spawn_new_visitor() // [DEV NOTE]: Spawn on a valid path tile (value 1). Row 10, col 14 is a path
        time_since_last_npc_spawn = 0;  
    }

    // now, award staff proportional to visitors (relation set in config.js):
    // desired_total_awarded = base_awarded + floor(visitorCount / VISITOR_STAFF_RELATION)
    const numVisitors = (typeof Visitors.get === 'function') ? Visitors.get() : getnpcs_on_map().length;
    const extraFromVisitors = Math.floor(numVisitors / config.VISITOR_STAFF_RELATION);
    const base = (typeof Staff.get_base_awarded === 'function') ? Staff.get_base_awarded() : (Staff.base_awarded ?? 1);
    const desiredTotalAwarded = base + extraFromVisitors;
    const totalAwarded = (typeof Staff.get_total_awarded === 'function') ? Staff.get_total_awarded() : Staff.get();
    if (desiredTotalAwarded > totalAwarded) {
        Staff.add(desiredTotalAwarded - totalAwarded);
    }

    // now comes the penalty for having a high level of congestion (and thus visitor frustration)
    time_since_last_magic_decrease_from_congestion += change_in_time;
    if (time_since_last_magic_decrease_from_congestion >= config.MAGIC_DEC_INTERVAL_CONGESTION) {
        const frust_tier = Frustration.map_frust_tier() - 1;
        let magic_loss = config.MAGIC_DECREASE_W_FRUSTR_RATE * frust_tier;
        Magic.decrease(magic_loss);
        time_since_last_magic_decrease_from_congestion = 0;
    }

    // Now NPC behaviour like movement, selecting a fun attraction to go visit + actually visiting happens
    update_npc_system(change_in_time);

    // now check if any npcs are visiting a attractions without food coverage, and penalise magic if so
    time_since_last_food_penalty += change_in_time;
    if (time_since_last_food_penalty >= config.FOOD_PENALTY_INTERVAL) { // i'm applying penalty once per second
        FoodCoverage.calculate_magic_loss_from_lack_of_foodstalls(getnpcs_on_map());
        time_since_last_food_penalty = 0;
    }

    // now re-render the map iff the player actually moved
    if (player.row !== last_player_row || player.col !== last_player_col) {
        last_player_row = player.row;
        last_player_col = player.col;
        renderMap(map, statics_fixed_on_map, attractions_placed_on_map, player.row, player.col);

        if (window.foodStallAnchors?.length) {
            FoodCoverage.redraw_all_food_coverage(window.foodStallAnchors);
        }
    }

    // Redraw visitor sprites every frame once per second (can do this to reduce lag at high npc cnt)
    // time_since_last_visitor_redraw += change_in_time;
    // if (time_since_last_visitor_redraw >= config.VISITOR_REDRAW_INTERVAL) {
    //     draw_visitor_sprites_onto_map();
    //     time_since_last_visitor_redraw = 0;
    // }
    draw_visitor_sprites_onto_map();

    // rerender food covering overlays
    if (window.foodStallAnchors?.length) {
        FoodCoverage.redraw_all_food_coverage(window.foodStallAnchors);
    }

    // finally I request the next frame:
    requestAnimationFrame(lumiere_gameplay_loop);
}

// For this I use the predefined fucntion, details found at: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
requestAnimationFrame(lumiere_gameplay_loop)

// this allows the player to activley pause / resume the gameplay
const btn_to_pause = document.getElementById("pause-button");
if (btn_to_pause) {
    btn_to_pause.addEventListener("click", () => {
        // Toggle manual pause (this will preserve modal-driven pausing)
        const paused = window.toggleGamePaused();
        btn_to_pause.textContent = paused ? "▶️" : "⏸️";
        // audio state handled by get_pause_state();
    });
}


