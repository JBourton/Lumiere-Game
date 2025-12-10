// this file is responsible for the effects of food stalls on nearby visitors interacting w/ attractions
// rule: no food stalls when visitors are interacting = magic gain proportional to num visitors

export const FoodCoverage = {

    // this draws on the coverage for a singular food stall
    _draw_single_coverage(centre_x_pos_of_fstall, centre_y_pos_of_fstall, effect_w, effect_h) {
        const grid = document.getElementById("grid");
        if (!grid) return;

        // begin identifying map squares to highlight based on where foodstall was placed
        const start_area_x = centre_x_pos_of_fstall - Math.floor(effect_w / 2);
        const start_area_y = centre_y_pos_of_fstall - Math.floor(effect_h / 2);

        // now I go through and fetch all the map squares to create the div on which to overlay on the (big) map
        for (let y_change = 0; y_change < effect_h; y_change++) {
            for (let x_change = 0; x_change < effect_w; x_change++) {
                const map_pos_x = start_area_x + x_change;
                const map_pos_y = start_area_y + y_change;

                if (map_pos_x < 0 || map_pos_y < 0) continue;  // ofc don't render outside of bounds, just skip

                const map_sq = grid.querySelector(`.cell[data-x="${map_pos_x}"][data-y="${map_pos_y}"]`); // fetch map sq to overlay onto w/ div
                if (!map_sq) continue;

                const overlay_cov_tile = document.createElement("div"); // 1 div per 1 overlay sq
                overlay_cov_tile.className = "food-coverage-tile";  // so it can be coloured in

                // now that new div, which has been styles (check styles.css for that class) is pushed on top of the map sq
                map_sq.appendChild(overlay_cov_tile);
            }
        }
    },

    // now publicly all coverage tiles are redrawn using array
    redraw_all_food_coverage(arr_of_foodstalls) {
        const grid = document.getElementById("grid");
        if (!grid) return;

        // any old coverage tiles get chucked out
        document.querySelectorAll('.food-coverage-tile').forEach(cov_tile => cov_tile.remove());

        if (!arr_of_foodstalls || !arr_of_foodstalls.length) return;
        // now new ones are drawn on
        for (const stall of arr_of_foodstalls) {
            this._draw_single_coverage(stall.x, stall.y, stall.effect_w, stall.effect_h);
        }
    }
};
