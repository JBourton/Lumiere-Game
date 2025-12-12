// now, whilst my popup.js should actual game announcments (which grey out the background), this shows light popups that let the user still interact w/ the (paused) game
// relevant game elements in the tutorial will be highlighted red for each tutorial popup

// I coded this to be modularised and only interact w/ DOM using standard selectors
let is_tutorial_active = false;
let curr_step_idx = -1;
let the_tooltip_el = null;
let el_highlighted_on_DOM = null;
let activated_cleanup_click = null;
let tutorial_overlay_el = null;
let tutorial_final_overlay_el = null;
let final_tooltip_click = null;


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
        // restore any inline styles changed during highlighting
        try {
            if (el_highlighted_on_DOM.dataset && typeof el_highlighted_on_DOM.dataset._tutorial_origPosition !== 'undefined') {
                el_highlighted_on_DOM.style.position = el_highlighted_on_DOM.dataset._tutorial_origPosition || '';
                delete el_highlighted_on_DOM.dataset._tutorial_origPosition;
            }
            if (el_highlighted_on_DOM.dataset && typeof el_highlighted_on_DOM.dataset._tutorial_origZ !== 'undefined') {
                el_highlighted_on_DOM.style.zIndex = el_highlighted_on_DOM.dataset._tutorial_origZ || '';
                delete el_highlighted_on_DOM.dataset._tutorial_origZ;
            }
        } catch (e) { /* ignore restore errors */ }
        el_highlighted_on_DOM = null;
    }

    // remove overlay that blocked interactions
    if (tutorial_overlay_el) {
        try { document.body.removeChild(tutorial_overlay_el); } catch (e) { /* ignore */ }
        tutorial_overlay_el = null;
    }
    // remove final overlay if present
    if (tutorial_final_overlay_el) {
        try { document.body.removeChild(tutorial_final_overlay_el); } catch (e) { /* ignore */ }
        tutorial_final_overlay_el = null;
    }
}


// hide the tooltip from the page, it's work there was done
function dissapear_tooltip() {
    if (!the_tooltip_el) return;
    the_tooltip_el.classList.add('hidden');
    the_tooltip_el.textContent = ''; // as text changes w/ each new tooltip, have to remove each time
}


// great job player! They're now armed w/ the knowledge they need to tackle the mammoth task of lumiere planning all alone!
function show_final_popup() {
    // gotta check tooltip exists first as usual
    const tt = ensure_tooltip_present();
    tt.innerHTML = `Alright then intern! Time to get on with it. 
    As they say, See One, Do One, Teach One; time to singlehandedly run Lumiere,
    and then you can teach the next intern for me after.<br><br>
    Click anywhere to continue.`;
    tt.classList.remove('hidden');
    tt.style.left = '';
    tt.style.top = '';
    tt.style.transform = '';
    tt.classList.add('final');

    // ensure clicking inside the final tooltip also closes the tutorial
    if (the_tooltip_el) {
        final_tooltip_click = () => {
            terminate_the_tutorial();
        };
        the_tooltip_el.addEventListener('click', final_tooltip_click);
    }

    // now the final overlay is prepping the player to get started, not teaching them anything. They can just click anywhere to make a start w/ the game
    if (!tutorial_final_overlay_el) {
        tutorial_final_overlay_el = document.createElement('div');
        tutorial_final_overlay_el.className = 'tutorial-final-overlay';
        // end tutorial and gooooo!
        tutorial_final_overlay_el.addEventListener('click', () => {
            terminate_the_tutorial();
        }, { capture: true });
        document.body.appendChild(tutorial_final_overlay_el);
    }
}


// [DEV NOTE]: this function doesn't strictly need to have all this logic, but I prefer it as it replicates an actual game tutorial system quite well by putting the tooltip near the screen
//             Could instead just centre each tooltip and cut a load of logic.
// look at pos of highlit item and spawn tooltip close by
function place_tooltip_near_target(item_highlit_red, my_preffered_side = 'right') {
    const next_tt = ensure_tooltip_present();
    next_tt.classList.remove('hidden');
    // I've used this getboundingclientrect() in previous projects and it worked well, so reapplying here. Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    const margin_from_tutorial_item = 12; // otherwise they stick together w/out, looks horrible
    const area_around_tutorial_item = item_highlit_red.getBoundingClientRect();

    // defaulting to tutorial elem's right-hand-side
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

    // i just set to 0 here temporarily so real size can be explicilty set in this file
    next_tt.style.left = '0px';
    next_tt.style.top = '0px';
    const tt_area = next_tt.getBoundingClientRect();
    const tt_vw = window.innerWidth;
    const tt_vh = window.innerHeight;

    // anchor left side properly if requested
    if (my_preffered_side === 'left') {
        left = area_around_tutorial_item.left - tt_area.width - margin_from_tutorial_item;
    }

    left = Math.max(margin_from_tutorial_item, Math.min(left, tt_vw - tt_area.width - margin_from_tutorial_item));
    top = Math.max(margin_from_tutorial_item, Math.min(top, tt_vh - tt_area.height - margin_from_tutorial_item));

    next_tt.style.left = `${left}px`;
    next_tt.style.top = `${top}px`;
}


// self explanatory, this one's findings matching DOM element for a given css selector as param input
function find_matching_dom_elem(selecting_val) {
    try { 
        return document.querySelector(selecting_val); 
    }//find matching dom el.
    catch { 
        return null; 
    } // safe catch
}


// IMPORTANT LOGIC: this sticks a click event onto the highlit tutorial item, so player has to click to interact & thus progress
function connect_tutorial_item_w_advance(tut_item, advancing) {
    // capture some element-specific original states so we can revert after advancing
    let _orig_heatmap_on = null;
    let _orig_manual_pause = null;

    // I found a bug; when the player interacts with both hmap and play/pause btn, game starts w/ hmap off game paused, so have to account for it here to undo the player's action
    try {
        if (tut_item && tut_item.id === 'toggle-heatmap-button') {
            const hmap_btn_from_dom = document.getElementById('toggle-heatmap-button');
            _orig_heatmap_on = hmap_btn_from_dom ? (hmap_btn_from_dom.textContent === 'Heatmap: On') : null;
        }
        if (tut_item && tut_item.id === 'pause-button') {
            _orig_manual_pause = !!window._manualPause;
        }
    } catch (issue_w_hmap_or_pause_btn) {
        //just prevent crash, nothing more's needed really
    }

    const handler_for_tut = () => {
        advancing(); // other handlers still run in-game

        // now after this patch, when the palyer moves onto next tutorial step, toggles just go back to how they were before (rather than instant, which might frustrate player)
        setTimeout(() => {
            try {
                if (_orig_heatmap_on !== null) {
                    const hmap_btn_from_dom = document.getElementById('toggle-heatmap-button');
                    const heatmapMini = document.getElementById('heatmapMiniContainer');
                    if (hmap_btn_from_dom) {
                        hmap_btn_from_dom.textContent = _orig_heatmap_on ? 'Heatmap: On' : 'Heatmap: Off';
                    }
                    if (heatmapMini) {
                        heatmapMini.style.display = _orig_heatmap_on ? 'block' : 'none';
                    }
                }
                if (_orig_manual_pause !== null) {
                    // have to restore my flags back to how they were for audio syncing and the like
                    window._manualPause = !!_orig_manual_pause;
                    if (typeof window.refreshPauseState === 'function') {
                        window.refreshPauseState();
                    }
                }
            } catch (issue_w_hmap_or_pause_btn) {
                //again nothing necessary
            }
        }, 0);
    };

    // not put that event listner on the red-highlit tutorial item
    tut_item.addEventListener('click', handler_for_tut, { capture: true });
    return () => tut_item.removeEventListener('click', handler_for_tut, { capture: true });
}


// OTHER IMPORTANT LOGIC: This is the flow I chose for my tutorial, so each tooltip will appear in this order
const TUTORIAL_STEPS = [
    {
        text: `This is your sidebar. All Lumiere's attractions, stages and foodstalls are located here. Each placeable lumiere item has a staff cost (these things don't run themselves you know!). As you progress,
         you'll unlock better attractions that generate more magic and can hold more visitors at any given time, but will need more staff to run. Click anywhere on it to continue.`,
        selector: "#sidebar",
        side: "right"
    },
    {
        text: "These are you core attractions; lights. They make Durham look pretty 😍 and generate magic quickly. However, they have quite a limited visitor capacity, so you'll need lots of them to enchant a crowd.",
        selector: "#tab-lights",
        side: "right"
    },
    {
        text: "Now Stages. Click the Stages tab.",
        selector: "#tab-stages",
        side: "right"
    },
    {
        text: "Stages have a much bigger visitor capacity. They do still up the city's magic level, but at a slower rate than lights. Use these when crowd capacity is getting a bit too big to handle with just lights.",
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
        return show_final_popup();  // show final popup instead of immediately terminating
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

    // create a full-viewport overlay to block interactions outside the highlighted element
    if (!tutorial_overlay_el) {
        tutorial_overlay_el = document.createElement('div');
        tutorial_overlay_el.className = 'tutorial-overlay';
        // prevent clicks on overlay from reaching the page
        tutorial_overlay_el.addEventListener('click', (e) => { e.stopPropagation(); }, true);
        document.body.appendChild(tutorial_overlay_el);
    }

    // raise the highlighted element above the overlay so it is the only interactable element
    // store original inline styles to restore later
    if (el_highlighted_on_DOM) {
        el_highlighted_on_DOM.dataset._tutorial_origPosition = el_highlighted_on_DOM.style.position || '';
        el_highlighted_on_DOM.dataset._tutorial_origZ = el_highlighted_on_DOM.style.zIndex || '';
        const _computed = window.getComputedStyle(el_highlighted_on_DOM);
        if (_computed.position === 'static') {
            el_highlighted_on_DOM.style.position = 'relative';
        }
        el_highlighted_on_DOM.style.zIndex = 10001;
    }

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
function commence_the_tutorial() {
    if (is_tutorial_active) {
        return;  // tutorial alredy going on, so skip
    }
    is_tutorial_active = true;
    curr_step_idx = 0;

    // setup tutorial tooltip
    ensure_tooltip_present();

    // here, i've set it up so the game is always paused throughout the tutorial, even if player tries to mess around w/ play/pause btn
    window._tutorialForcedPause = true; 
    if (typeof window.refreshPauseState === 'function') {
        window.refreshPauseState(); // (as game is always paused in tutorial)
    }

    // now tutorial tooltips show 1 by 1 as the player goes about interacting w/ it
    show_step(curr_step_idx);
}


// tutorial over, time to start running lumiere!
function terminate_the_tutorial() {
    // reset global logic trackers
    is_tutorial_active = false;
    curr_step_idx = -1;

    // ...get rid of all the tutorial styling
    clearup_highlight_area();
    dissapear_tooltip();
    // now remove the restriction i put on making tooltips unclickable, as just on this one the player can click anywhere to end tutorial
    if (final_tooltip_click && the_tooltip_el) {
        try { the_tooltip_el.removeEventListener('click', final_tooltip_click); } catch (e) { /* ignore */ }
        final_tooltip_click = null;
    }
    

    // and now, game can resume! Let's gooo!!
    window._tutorialForcedPause = false;
    if (typeof window.refreshPauseState === 'function') {
        window.refreshPauseState();
    } 
}


// now I expose all this logic to main.js so it can be used there without cloging it up
export function kickoff_tutorial() {
    // popup.js gets to see the funcs now too, which it can access through the window
    window.startTutorial = commence_the_tutorial;
    window.endTutorial = terminate_the_tutorial;

    //[DEV NOTE] this lets the user skip tutorial; leaving in for now but want to test for gameplay effect
    window.addEventListener('keydown', (the_key) => {
        if (!is_tutorial_active) return;
        if (the_key.key === 'Escape') {
            terminate_the_tutorial(); // [DEV NOTE]: ending whole tutorial, but could change to just ending current popup?
        } 
    });
}
