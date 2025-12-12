// now, whilst my popup.js should actual game announcments (which grey out the background), this shows light popups that let the user still interact w/ the (paused) game
// relevant game elements in the tutorial will be highlighted red for each tutorial popup

// I coded this to be modularised and only interact w/ DOM using standard selectors
let is_tutorial_active = false;
let curr_step_idx = -1;

let the_tooltip_el = null;
let el_highlighted_on_DOM = null;
let activated_cleanup_click = null;


// first, a quick check to make sure there is actually a tooltip present
function ensure_tooltip_present() {
    if (the_tooltip_el) return the_tooltip_el; // if it's already there, great! moving on

    // if not, create a new div which will be overlayed as a tooltip for tutorialling
    the_tooltip_el = document.createElement('div');
    the_tooltip_el.className = 'tutorial-tooltip hidden';
    the_tooltip_el.setAttribute('aria-live', 'polite');  // bit of fundamental styling (check styles.css for rest)
    document.body.appendChild(the_tooltip_el);  // now add that to page
    return the_tooltip_el;
}


// next up is to remove the tooltip/highlit section that when the user interacts w/ it
function clearup_highlight_area() {
    if (activated_cleanup_click) { // clear everything if user completes this step of the tutorial
        activated_cleanup_click();
        activated_cleanup_click = null;
    }

    // now for the bit i was currently teaching the user about (which would have been highlit w/ a red border), remove the styling
    if (el_highlighted_on_DOM) {
        el_highlighted_on_DOM.classList.remove('tutorial-highlight', 'tutorial-highlight-pulse');
        el_highlighted_on_DOM = null;
    }
}


// hide the tooltip from the page, it's work there was done
function dissapear_tooltip() {
    if (!the_tooltip_el) return;
    the_tooltip_el.classList.add('hidden');
    the_tooltip_el.textContent = ''; // as text changes w/ each new tooltip, have to remove each time
}


// [DEV NOTE]: this function doesn't strictly need to have all this logic, but I prefer it as it replicates an actual game tutorial system quite well by putting the tooltip near the screen
//             Could instead just centre each tooltip and cut a load of logic.
// look at pos of highlit item and spawn tooltip close by
function place_tooltip_near_target(item_highlit_red, my_preffered_side = 'right') {
    const next_tt = ensure_tooltip_present();
    next_tt.classList.remove('hidden');

    // I used https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientarea_around_tutorial_item to find area of tutorial item for tooltip placement
    const margin_from_tutorial_item = 12; // otherwise they stick together, looks horrible
    const area_around_tutorial_item = item_highlit_red.getBoundingClientarea_around_tutorial_item(); 

    // w/out looking at input param context, i.e. a standard default
    let top = area_around_tutorial_item.top;
    let left = area_around_tutorial_item.right + margin_from_tutorial_item;
    // yet more flexibility for dev; if it doesn't fit nicely on the right, I just change in input param
    switch (my_preffered_side) {
        case 'left':
            left = area_around_tutorial_item.left - margin_from_tutorial_item;
            break;
        case 'bottom':
            top = area_around_tutorial_item.bottom + margin_from_tutorial_item;
            left = area_around_tutorial_item.left;
            break;
        case 'top':
            top = area_around_tutorial_item.top - margin_from_tutorial_item;
            left = area_around_tutorial_item.left;
            break;
        // default is right-side, which i already dealt w/ above
    }

    // rel. to viewport
    next_tt.style.top = '0px';
    next_tt.style.left = '0px';

    // same logic fetching the area around the tooltip this time and finding its area
    const tip_area_around_tutorial_item = next_tt.getBoundingClientarea_around_tutorial_item();
    const tt_vw = window.innerWidth;
    const tt_vh = window.innerHeight;

    // [DEV] fix bug for anchoring l/r based on tooltip width
    if (my_preffered_side === 'left') {
        left = area_around_tutorial_item.left - tip_area_around_tutorial_item.width - margin_from_tutorial_item;
    }

    left = Math.max(margin_from_tutorial_item, Math.min(left, tt_vw - tip_area_around_tutorial_item.width - margin_from_tutorial_item));
    top = Math.max(margin_from_tutorial_item, Math.min(top, tt_vh - tip_area_around_tutorial_item.height - margin_from_tutorial_item));

    // now i dynamicly set tooltip padding w/ vars declared above
    next_tt.style.left = `${left}px`;
    next_tt.style.top = `${top}px`;
}


// self explanatory, this one's findings matching DOM element for a given css selector as param input
function find_matching_dom_elem(selecting_val) {
    try { return document.querySelector(selecting_val); }//find matching dom el.
    catch { return null; } // safe catch
}


// IMPORTANT LOGIC: this sticks a click event onto the highlit tutorial item, so player has to click to interact & thus progress
function connect_tutorial_item_w_advance(tut_item, advancing) {
    const handler_for_tut = (param) => {
        advancing(); // other handlers still run in-game
    };

    // not put that event listner on the red-highlit tutorial item
    tut_item.addEventListener('click', handler_for_tut, { capture: true });
    return () => tut_item.removeEventListener('click', handler_for_tut, { capture: true });
}


// OTHER IMPORTANT LOGIC: This is the flow I chose for my tutorial, so each tooltip will appear in this order
const TUTORIAL_STEPS = [
    {
        text: "This is your sidebar. You’ll pick what to place from here. Click it to continue.",
        selector: "#sidebar",
        side: "right"
    },
    {
        text: "Start with Lights. Click the Lights tab.",
        selector: "#tab-lights",
        side: "right"
    },
    {
        text: "Now Stages. Click the Stages tab.",
        selector: "#tab-stages",
        side: "right"
    },
    {
        text: "Now Food Stalls. Click the Food Stalls tab.",
        selector: "#tab-food",
        side: "right"
    },
    {
        text: "This is the map grid. You’ll move around and place things on tiles. Click the grid.",
        selector: "#grid",
        side: "left"
    },
    {
        text: "This is the heatmap toggle. It’s an accessibility overlay for crowd density. Click it.",
        selector: "#toggle-heatmap-button",
        side: "bottom"
    },
    {
        text: "This is pause. Handy if things get hectic. Click it to finish the tutorial.",
        selector: "#pause-button",
        side: "bottom"
    }
];


// display sequential steps from the TUTORIAL_STEPS defined above
function show_step(step_idx) {
    const next_tut_step = TUTORIAL_STEPS[step_idx];
    if (!next_tut_step) {
        return end_tutorial();  // tutorial's over, let's start running lumiere!
    } 

    // get rid of red border around last tutorial item
    clearup_highlight_area();

    // highlight part I'm teaching the player about
    const tut_elem_to_highlight = find_matching_dom_elem(next_tut_step.selector);
    if (!tut_elem_to_highlight) {// if missing from dom, just skip on instead of breaking/ending tutorial
        return show_step(step_idx + 1);
    }
    el_highlighted_on_DOM = tut_elem_to_highlight;
    el_highlighted_on_DOM.classList.add('tutorial-highlight', 'tutorial-highlight-pulse'); // (checkout styles.css for details on how its styled)

    // now grab the tooltip to go alongside it, & put the info text inside it
    const tt = ensure_tooltip_present();
    tt.textContent = next_tut_step.text;
    place_tooltip_near_target(tut_elem_to_highlight, next_tut_step.side || 'right');

    // when the relevant tutorial item clicked, move onto next one
    activated_cleanup_click = connect_tutorial_item_w_advance(tut_elem_to_highlight, () => {
        curr_step_idx += 1;
        show_step(curr_step_idx);
    });
}


// now's time to jump in w/ learning, sequentially showing tooltips & highlighting areas so the user can learn how to play quickly
function start_tutorial() {
    if (is_tutorial_active) return;  // tutorial alredy going on, so skip
    is_tutorial_active = true;
    curr_step_idx = 0;

    // setup tutorial tooltip
    ensure_tooltip_present();

    // Force pause during tutorial, without adding a modal overlay
    window._tutorialForcedPause = true;
    if (typeof window.refreshPauseState === 'function') window.refreshPauseState();

    // for sequential showing of tutorial slides
    show_step(curr_step_idx);

    // w/ this, even on resize, tutorial tooltip position is fine
    window.addEventListener('resize', on_resize_reposition);
}

function on_resize_reposition() {
    if (!is_tutorial_active || !el_highlighted_on_DOM || !the_tooltip_el) return;
    const step = TUTORIAL_STEPS[curr_step_idx];
    if (!step) return;
    place_tooltip_near_target(el_highlighted_on_DOM, step.side || 'right');
}


// tutorial over, time to start running lumiere!
function end_tutorial() {
    // reset global logic trackers
    is_tutorial_active = false;
    curr_step_idx = -1;

    // ...get rid of all the tutorial styling
    clearup_highlight_area();
    dissapear_tooltip();

    // and cut this: not needed now & would mess w/ game anyway
    window.removeEventListener('resize', on_resize_reposition);

    // now, game can resume! Let's gooo!!
    window._tutorialForcedPause = false;
    if (typeof window.refreshPauseState === 'function') {
        window.refreshPauseState();
    } 
}


// now I expose all this logic to main.js so it can be used there without cloging it up
export function kickoff_tutorial() {
    // popup.js gets to see the funcs now too, which it can access through the window
    window.startTutorial = start_tutorial;
    window.endTutorial = end_tutorial;

    //[DEV NOTE] this lets the user skip tutorial; leaving in for now but want to test for gameplay effect
    window.addEventListener('keydown', (the_key) => {
        if (!is_tutorial_active) return;
        if (the_key.key === 'Escape') {
            end_tutorial(); // [DEV NOTE]: ending whole tutorial, but could change to just ending current popup?
        } 
    });
}
