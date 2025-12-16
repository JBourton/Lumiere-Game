// This file is responsible for the coding of the sidebar, including the button switching and the drag-drop behaviour
import { set_placement_item } from "../logic/placementPreview.js";  // this is needed for setting up the interaction w/ the sidebar and the placement preview
import { ATTRACTION_TYPES, ALL_ATTRACTIONS_PLACEABLE_ON_MAP } from "../logic/placeableDefinitions.js";
import { Staff } from "../logic/resources.js";  // have to know about current staff available so whether or not it can be afforded can be displayed in the sidebar w/ colour red

// All logic to setup sidebar is encapsulated nicely in this
export function setupSidebar() {
    const tabs = document.querySelectorAll('#sidebar-tabs .tab');  // I have different tabs for the sidebar btns; this fetches the ids so the player can interact w/ them
    const content = document.getElementById('sidebar-content');

    // I wanted a little 8-bit style sound, so I got this royalty-free one: (Sound Effect by <a href="https://pixabay.com/users/driken5482-45721595/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=236670">Driken Stan</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=236670">Pixabay</a>)
    const clickSound = new Audio("assets/audio/retro-select.mp3"); 
    clickSound.volume = 0.6; // play about w/ this to get the sound bite noise just right


    // here I import the data structure that stores the names & imgs for each light display
    const lightItems = Object.values(ALL_ATTRACTIONS_PLACEABLE_ON_MAP);

    // now the sidebar's ready to be built, using the predefined attraction details
    function generateItemsByType(typeName) {
        const items = Object.values(ALL_ATTRACTIONS_PLACEABLE_ON_MAP)
            .filter(item => item.type === typeName);

        return `
            <div id="item-list">
                ${items.map(item => `
                    <div class="item-row ${item.locked ? "locked" : ""}" data-item-id="${item.id}">
                        <img src="${item.img}" class="item-icon" alt="${item.name}">
                        <span class="item-name">
                            ${item.name}   <! -- this is the styling for the actual attraction -->
                            <span class="staff-cost">👷 ${item.staff_cost}</span>  <!-- this part's responible for showing the staff cost of each atraction -->
                        </span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Example placeholder panels for each tab
    // (Lights panel upgraded to dynamic generator above)
    const panels = {
        [ATTRACTION_TYPES.LIGHTS]: () => generateItemsByType(ATTRACTION_TYPES.LIGHTS),
        [ATTRACTION_TYPES.STAGES]: () => generateItemsByType(ATTRACTION_TYPES.STAGES),
        [ATTRACTION_TYPES.FOOD]: () => generateItemsByType(ATTRACTION_TYPES.FOOD)
    };


    // the first tab that should be open is the "lights" one - that's the theme of Lumiere after all, and the core structure of the 3
    content.innerHTML = panels[ATTRACTION_TYPES.LIGHTS]();  // this just loads all the attractions into the sidebar ready for game-start


    // after page renders, this function attatches listners onto the clickable items
    function set_sidebar_item_listners() {  // no need for args as I'm referencing global vals like Staff from resources.js
        const rows_on_sidebar = document.querySelectorAll('.item-row');

        rows_on_sidebar.forEach(sidebar_row => {

            const itemId = sidebar_row.dataset.itemId;
            const item = ALL_ATTRACTIONS_PLACEABLE_ON_MAP[itemId];

            // fetch the staff-cost label (needed so only the text becomes red, indicating player is too broke to buy it)
            const visual_staff_cost = sidebar_row.querySelector(".staff-cost");
            if (sidebar_row.classList.contains('locked')) {
                sidebar_row.style.pointerEvents = "none";  // player cant interact w/ locked items
                return;
            }

            const check_player_can_afford = (Staff.get() >= item.staff_cost);  // have to ensure the player can actually afford the staff cost to placing an attraction 1st

            // now actually set that affordability on the cost label
            if (visual_staff_cost) {
                if (!check_player_can_afford) {
                    visual_staff_cost.classList.add("cannot-afford");
                } else {
                    visual_staff_cost.classList.remove("cannot-afford");
                }
            }

            // now check if players allowed to click on it
            if (!check_player_can_afford) {
                sidebar_row.style.pointerEvents = "none"; // no? disable it
            } else {
                sidebar_row.style.pointerEvents = "auto";   // yeah? enable it
            }

            sidebar_row.addEventListener('click', () => {
            if (!check_player_can_afford) return;  // do absoltutley nothing if the player can't afford to place the attraction 
                // Play the little 8bit soundbite for clicking on an item
                clickSound.currentTime = 0;  // this is to account for v fast player clicks
                clickSound.play().catch(err => console.warn("Audio blocked:", err));

                // fetch correct id
                const selectedId = sidebar_row.dataset.itemId;

                // lookup attraction id in dict (check placeableDefinitions for more details of this though)
                const item = ALL_ATTRACTIONS_PLACEABLE_ON_MAP[selectedId];
                set_placement_item(item);
            });
        });
    }

    // now put those rows onto the initial sidebar load
    set_sidebar_item_listners();


    window.refreshSidebarAffordability = () => { // this is needed so that the staff cost can be updated as staff cnt varies
        // current tab's contents have to be re-rendered
        const active_tab = document.querySelector('#sidebar-tabs .tab.active');
        const name_of_tab = active_tab ? active_tab.textContent.trim() : ATTRACTION_TYPES.LIGHTS;

        const panel = panels[name_of_tab];
        content.innerHTML = typeof panel === "function" ? panel() : panel;

        // now the dom got rebuilt, I stick the item listners back in place
        set_sidebar_item_listners();
    };


    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            clickSound.currentTime = 0; // play same audio sound as clicking on the items in this tab
            clickSound.play().catch(err => console.warn("Audio blocked:", err));
            // have to get rid of active from each tab though
            tabs.forEach(t => t.classList.remove('active'));
            // but activate the one that was clicked
            tab.classList.add('active');
            if (tab.id !== "tab-food") {
                const foodTab = document.getElementById("tab-food");
                if (foodTab) foodTab.classList.remove("food-alert");
            }
            // and then update content panel
            const tabName = tab.textContent.trim();

            const panel = panels[tabName];
            content.innerHTML = typeof panel === "function" ? panel() : panel || `<p>No content yet.</p>`;

            // NEW: reattach listeners because the DOM has re-rendered
            set_sidebar_item_listners();
        });
    });
}  // these nested functions actually encapsulte the logic pretty well for main.js, so it's a deliberate design choice on my end
