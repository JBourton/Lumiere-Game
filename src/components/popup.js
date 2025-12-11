// This sets up the modal that appears on first visit (per session)
export function setupIntroModal(bg_tunes) {
    document.addEventListener("DOMContentLoaded", function () {
        // grabbing modal and start button from the DOM
        const introModal = document.getElementById("introModal");
        const beginButton = document.getElementById("startButton"); // renamed to feel more conversational

        // check the element does actually exist - obviously can't do anythign w/out the modal
        if (!introModal || !beginButton) {
            console.warn("Missing modal or start button – skipping intro setup");
            return;
        }

        // this is to make sure that it's seen by user once per SESSION (i.e. page reload will render it again)
        const has_intro_occured_yet = sessionStorage.getItem("introSeen");

        if (!has_intro_occured_yet) {
            // displaying modal (default styling 'none' in CSS)
            introModal.style.display = "flex";  // [Note]: could always use a class toggle here instead
            sessionStorage.setItem("introSeen", "true"); // now mark as seen to prevent a later reapperance (once per session ONLY otherwise player's getting annoyed)
        }

        // this will trigger the modal to disappear once 'start game' btn clicked
        beginButton.addEventListener("click", function () {
            // [Note]: This could actually be animated in the future to be cooler
            introModal.style.display = "none";
            if (bg_tunes) {
                bg_tunes.playMusic(); // now fire up the background tunes!
            }
        });

        // for later debugging; useful for double-checking its working
        // console.log("Intro modal setup complete");
    });
}


// this function is the "Game Over" screen, which will preceed the resetting of the whole game w/ systems back to nil
export function setupGameOverModal(game_restart_logic) {
    document.addEventListener("DOMContentLoaded", function () {
        const popup_for_gameover = document.getElementById("gameoverModal");
        const restart_the_game = document.getElementById("gameOverButton");  // fetch the restart buttons id
        if (!popup_for_gameover || !restart_the_game) {
            return;  // this is only if either the modal or restart button isn't here, so should never be the case but using for debug still
        }

        // I setup the restart button to close this modal and then begin all the restart logic, reseting game systems to nil
        restart_the_game.addEventListener("click", function () {
            popup_for_gameover.style.display = "none"; // (close it)
            if (typeof game_restart_logic === "function") game_restart_logic();  // back to nothing player, unlucky ;)
        });
    });
}

// activating at gameover condition (no magic in the city, the people had a bad night :-(   )
export function game_over() {
    // event listner setup to track magic & appear when magic == 0
    const the_hidden_gameover_popup = document.getElementById("gameoverModal");
    if (!the_hidden_gameover_popup) {
        return;  // though this should never trigger, but I'm using for debug
    }
    the_hidden_gameover_popup.style.display = "flex"; // activeating
}


// and now for the winning popup - just as important ofc!!
export function setupGameWonModal(game_restart_logic) {
    document.addEventListener("DOMContentLoaded", function () {
        const popup_for_gamewon = document.getElementById("gamewonModal"); // find the win modal
        const restart_after_win = document.getElementById("gameWonButton"); // fetch the restart btn id

        if (!popup_for_gamewon || !restart_after_win) {
            return;  // debugging only, just in case either element is missing
        }

        // setup the restart btn so that it closes this win popup + runs the restart logic
        restart_after_win.addEventListener("click", function () {
            popup_for_gamewon.style.display = "none";  // (close it)
            if (typeof game_restart_logic === "function") game_restart_logic(); // same restart logic as game over
        });
    });
}


// activating the "game won" condition (player did an excellent job 🎉)
export function game_won() {
    // fetch the hidden game-won popup + activate it
    const the_hidden_gamewon_popup = document.getElementById("gamewonModal");
    if (!the_hidden_gamewon_popup) {
        return; // another line that shouldn't ever be needed, but a little sheild in case
    }
    the_hidden_gamewon_popup.style.display = "flex"; // annndd activate! player celebration time! :D
}

// now's the function that controls showing the "Congrats, you've unlocked item X" popup
export function setupUnlockPopup() {
    const unlock_popup = document.getElementById("unlock-popup");
    const close_unlock_popup_btn = document.getElementById("unlock-close-btn");

    close_unlock_popup_btn.addEventListener("click", () => {
        unlock_popup.classList.add("hidden");  // it starts invisible just like the rest of the popups, only shows when player unlocks a new attraction
    });

    // it has to be globally exposed so it can be seen/interacting w/
    window.show_the_unlock_popup = show_the_unlock_popup;
}

export function show_the_unlock_popup(item_unlocked) {
    const unlock_popup = document.getElementById("unlock-popup");
    const img_of_item_unlocked = document.getElementById("unlock-img");
    const unlocked_name = document.getElementById("unlock-text");

    // set the item-specific img & name
    img_of_item_unlocked.src = item_unlocked.img;
    unlocked_name.textContent = `Unlocked: ${item_unlocked.name}`;

    // now show it!
    unlock_popup.classList.remove("hidden");
}

