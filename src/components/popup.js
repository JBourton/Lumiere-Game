// This file's purpose is to hold all the logic relating to modals (popups) which inform the user about key game events


// This sets up the modal that appears on first visit (i.e. only once/session)
export function loadup_intro_modal(bg_tunes) {
    document.addEventListener("DOMContentLoaded", function () {
        // grabbing modal and start button from the DOM
        const intro_screen = document.getElementById("introModal");
        const start_game_btn = document.getElementById("startButton");

        // check the element does actually exist - obviously can't do anythign w/out the modal and the dom sometimes loads weird
        if (!intro_screen || !start_game_btn) {
            console.warn("check the intro screen modal or start btn hasn't been accidently deleted");
            return;
        }

        // this is to make sure that it's seen by user once per SESSION (i.e. page reloading will render it again)
        const has_intro_occured_yet = sessionStorage.getItem("introSeen");

        if (!has_intro_occured_yet) {
            // displaying modal (i set default styling 'none' in CSS)
            intro_screenl.style.display = "flex";  // [Note]: could always use a class toggle here instead
            sessionStorage.setItem("introSeen", "true"); // now mark as seen to prevent a later reapperance (once per session ONLY otherwise player's getting annoyed)
        }

        // this will trigger the modal to disappear once 'start game' btn clicked
        start_game_btn.addEventListener("click", function () {
            // [Note]: This could actually be animated in the future to be cooler
            intro_screen.style.display = "none";
            if (bg_tunes) {
                bg_tunes.playMusic(); // now fire up the background tunes!
            }
                // Show the tutorial modal (if setup attached the global helper)
                if (typeof window.show_the_tutorial_question_popup === 'function') {
                    window.show_the_tutorial_question_popup();
                }
        });

        // for later debugging; useful for double-checking its working
        // console.log("Intro modal setup complete");
    });
}


// this function is the "Game Over" screen, which will preceed the resetting of the whole game w/ systems back to nil
export function fireup_gameover_popup(game_restart_logic) {
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
export function fireup_gamewon_modal(game_restart_logic) {
    document.addEventListener("DOMContentLoaded", function () {
        const popup_for_gamewon = document.getElementById("gamewonModal"); // 1st find the win modal
        const restart_after_win = document.getElementById("gameWonButton"); // 2nd find restart btn

        // now i setup the restart btn so it closes this win popup + runs the restart logic in same go
        restart_after_win.addEventListener("click", function () {
            popup_for_gamewon.style.display = "none";  // (close it)
            if (typeof game_restart_logic === "function") game_restart_logic(); // this is just same restart logic as game over
        });
    });
}


// the player won! here's the logic that shows that to them w/ a little "congrats" msg
export function game_won() {
    // fetch the hidden game-won popup + activate it
    const the_hidden_gamewon_popup = document.getElementById("gamewonModal");
    if (!the_hidden_gamewon_popup) {
        return; // another line that shouldn't ever be needed, but a little sheild in case
    }
    the_hidden_gamewon_popup.style.display = "flex"; // annndd activate! player celebration time! :D
}


// now's the function that controls showing the "Congrats, you've unlocked item X" popup
export function fireup_unlock_popup() {
    const unlock_popup = document.getElementById("unlock-popup");
    const close_unlock_popup_btn = document.getElementById("unlock-close-btn");

    close_unlock_popup_btn.addEventListener("click", () => {
        unlock_popup.classList.add("hidden");  // it starts invisible just like the rest of the popups, only shows when player unlocks a new attraction
    });

    // it has to be globally exposed so it can be seen/interacting w/
    window.show_the_unlock_popup = show_the_unlock_popup;
}

export function show_the_unlock_popup(item_unlocked) {
    const unlock_popup = document.getElementById("unlock-popup"); // now grabbing all the dom elems relating to the unlock popup, which is always there in the background but not visible
    const img_of_item_unlocked = document.getElementById("unlock-img");
    const unlocked_name = document.getElementById("unlock-text"); // i use that one popup as a rewriteable slate rather than cramming the dom with a bunch of popups

    // set the item-specific img & name
    img_of_item_unlocked.src = item_unlocked.img;
    unlocked_name.textContent = `Unlocked: ${item_unlocked.name}`;

    // now show it!
    unlock_popup.classList.remove("hidden");
}



// %%%%%%%%% from here down, all these popups will contain all the screens needed for the tutorial %%%%%%%%%%


// Firstly (and most important!) comes the actual "Do you want a tutorial" screen - if yes, the others are triggered (checkout tutorial.js for that logic though as I compartmentalised it)
export function fireup_tutorial_yesorno_popup() {
    document.addEventListener("DOMContentLoaded", function () {
        const start_tutorial_question = document.getElementById("tutorialChoiceModal"); //now all the dom elems repsonsible for starting/skipping tutorial
        const start_tutorial_btn = document.getElementById("tutorialYesBtn");
        const skip_tutorial_btn = document.getElementById("tutorialNoBtn");
        start_tutorial_question.style.display = "none";

        // 2 btns that start/skip tutorial
        start_tutorial_btn.addEventListener("click", () => {
            start_tutorial_question.style.display = "none";
            if (typeof window.startTutorial === 'function') {
                window.startTutorial(); // tutorial time!
            }
        });

        skip_tutorial_btn.addEventListener("click", () => {
            start_tutorial_question.style.display = "none"; // player reckons they're a pro already ;)
        });

        // now the tutorial logic is opened up globally
        window.show_the_tutorial_question_popup = function show_the_tutorial_question_popup() {
            const the_tutorial_popup = document.getElementById("tutorialChoiceModal");
            the_tutorial_popup.style.display = "flex";
        };
    });
}

// same logic as above, just for showing the "start tutorial" popup, which'll kickoff tooltips if requested so by player
export function show_the_tutorial_question_popup() {
    const the_tutorial_popup = document.getElementById("tutorialChoiceModal");
    if (!the_tutorial_popup) return;
    the_tutorial_popup.style.display = "flex";
}