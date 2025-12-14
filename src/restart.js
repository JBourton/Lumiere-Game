// Minimal extracted restart logic. This module exposes a single function
// that performs the same state resets as previously in `main.js` but
// operates using the callbacks/objects passed in so we avoid touching
// main.js internals directly.
export function reset_game_impl(game_restart_options) {
    // back to how it all was at 1st time
    game_restart_options.Magic.set_mgc(10);
    game_restart_options.Staff.set_stf(1);
    game_restart_options.Visitors.set_vstrs(0);
    game_restart_options.Frustration.set_frust(0);

    // git rid of all npcs
    if (game_restart_options.clear_all_npcs) game_restart_options.clear_all_npcs();

    // reset player back to initial pos used at launch
    if (typeof game_restart_options.setPlayerPos === 'function') game_restart_options.setPlayerPos(10, 0);
    if (typeof game_restart_options.setLastPlayerPos === 'function') game_restart_options.setLastPlayerPos(10, 0);

    // reset timers for npc spawn & animation frame
    if (typeof game_restart_options.setCurrTimeFrame === 'function') game_restart_options.setCurrTimeFrame(performance.now());
    if (typeof game_restart_options.setTimeSinceLastNpcSpawn === 'function') game_restart_options.setTimeSinceLastNpcSpawn(0);

    // now clear all placed object,s including food stalls
    if (game_restart_options.placedObjects && Array.isArray(game_restart_options.placedObjects)) {
        game_restart_options.placedObjects.length = 0;
    }

    // then git rid of global foodstall anchors
    if (window.foodStallAnchors && Array.isArray(window.foodStallAnchors)) {
        window.foodStallAnchors.length = 0;
    }

    // redraw map & player as theres now a clean slate
    if (typeof game_restart_options.renderMap === 'function') {
        game_restart_options.renderMap(game_restart_options.currentMap, game_restart_options.currentStatics, game_restart_options.placedObjects, 10,0);
    }

    if (typeof game_restart_options.cleanup_the_map === 'function') game_restart_options.cleanup_the_map();
    if (typeof game_restart_options.remove_all_visitors === 'function') game_restart_options.remove_all_visitors();
    if (typeof game_restart_options.reset_unlocks === 'function') game_restart_options.reset_unlocks();

    // and then finally get rid of all those green overlay squares
    if (typeof game_restart_options.clear_food_coverage === 'function') {
        game_restart_options.clear_food_coverage();
    }

    // reapply accessibility/theme toggles (e.g., colour-blind mode) after a restart
    if (typeof game_restart_options.apply_accessibility_settings === 'function') {
        game_restart_options.apply_accessibility_settings(); // Added by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).
    }

    // finally, restart the gameplay loop cleanly after game over
    if (typeof game_restart_options.requestAnimationFrame === 'function' && game_restart_options.gameplayLoop) {
        game_restart_options.requestAnimationFrame(game_restart_options.gameplayLoop);
    }
}
