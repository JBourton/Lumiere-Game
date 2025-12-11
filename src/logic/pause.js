// Global pause flag for play/pause functionality
window.gamePaused = false;
// manual pause flag tracks whether it was player who wanted pause, not function
window._manualPause = false;

let funky_background_audio = null;

// basically whenever a modal (popup screen) is present, I want the game paused
function check_if_any_modal_visible() {
	try {
		const grab_all_modals = Array.from(document.querySelectorAll('.modal'));
		return grab_all_modals.some(a_modal => { // i.e. if any one of the modals are open
			const modal_style_right_now = getComputedStyle(a_modal);  // this is built-in, let's me fetch the css values

            // Important! I'm checking here if each modal is showing or not; if it is, then something's happening so the game needs to be paused
			return modal_style_right_now.display !== 'none' && modal_style_right_now.visibility !== 'hidden' && parseFloat(modal_style_right_now.opacity || '1') > 0;
		});
	} catch (some_excp) {
		return false;
	}
}

// a modular/api-inspired way of setting pause/play state
function get_pause_state() {
	const is_modal_visible = check_if_any_modal_visible();
	const fresh_pause = !!(window._manualPause || is_modal_visible);
	if (fresh_pause === window.gamePaused) return;  // if it's already paused, no need to do anything
	window.gamePaused = fresh_pause;

	// now I need to make sure both the ui and audio are updated to be aware of this
	const btn = document.getElementById('pause-button');
	if (btn) btn.textContent = window.gamePaused ? '▶️' : '⏸️';
	if (window.gamePaused) funky_background_audio?.pauseMusic();
	else funky_background_audio?.resumeMusic();
}

function toggle_the_pause_button() {
	window._manualPause = !window._manualPause;
	get_pause_state();
	return window.gamePaused;
}

// now I can play/pause from any function, so its extended to be max lvl of modularlity
window.toggleGamePaused = () => toggle_the_pause_button();
window.pauseGame = () => { window._manualPause = true; get_pause_state(); };
window.resumeGame = () => { window._manualPause = false; get_pause_state(); };

export function pause_everything(audioManager) {
	funky_background_audio = audioManager;

	// run once on load to pick up any modal that might be visible
	document.addEventListener('DOMContentLoaded', () => {
		get_pause_state();

		// now update play/pause state based on dom changes
		try {
			const playPause_listner = new MutationObserver(() => get_pause_state());  // i found this the best option, as it lets me actively watch for dom chages: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
			playPause_listner.observe(document.body, { attributes: true, childList: true, subtree: true, attributeFilter: ['style', 'class'] });
		} catch (some_excp) {
			// just in case it isn't available, i have this last line of defence to stop crashing (as play/pause isn't super essential)
			setInterval(get_pause_state, 500);
		}
	});
}
