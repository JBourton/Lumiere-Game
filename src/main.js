// First load in all game componants needed
import { build_grid_map, renderMap } from "./logic/map.js";
import { Player, enablePlayerMovement } from "./logic/playerMovement.js";
import { setupIntroModal } from "./components/popup.js";
import { Magic, Staff, Visitors, Frustration } from "./logic/resources.js";
import { AudioManager } from "./components/audio.js";

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
    Staff.addListener(StaffCnt => {staffDisplay.textContent = `👷 Staff: ${StaffCnt}`;});

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

// Start Lumiere Game!
const { map, statics } = build_grid_map(WIDTH, HEIGHT);

const player = new Player(10, 0, map, statics);

renderMap(map, statics, player.row, player.col);

enablePlayerMovement(player);







