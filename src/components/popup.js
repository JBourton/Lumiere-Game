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
        const hasSeenIntro = sessionStorage.getItem("introSeen");

        if (!hasSeenIntro) {
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
