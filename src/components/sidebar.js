// This file is responsible for the coding of the sidebar, including the button switching and the drag-drop behaviour


// All logic to setup sidebar is encapsulated nicely in this
export function setupSidebar() {
    const tabs = document.querySelectorAll('#sidebar-tabs .tab');  // I have different tabs for the sidebar btns; this fetches the ids so the player can interact w/ them
    const content = document.getElementById('sidebar-content');

    // I wanted a little 8-bit style sound, so I got this royalty-free one: (Sound Effect by <a href="https://pixabay.com/users/driken5482-45721595/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=236670">Driken Stan</a> from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=236670">Pixabay</a>)
    const clickSound = new Audio("assets/audio/retro-select.mp3"); 
    clickSound.volume = 0.6; // play about w/ this to get the sound bite noise just right


    // here I setup a data structure that stores the name and associated img for each light display
    const lightItems = [
        { name: "String Lights", img: "assets/imgs/String%20Lights%208bit%20-%20Generated%20by%20ChatGPT.png", locked: false },
        { name: "Mythical Screen", img: "assets/imgs/Magical%20Mirror%208bit-%20Generated%20by%20ChatGPT.png", locked: true },
        { name: "Luminescent Webs", img: "assets/imgs/Spider%20Lights%208bit-%20Generated%20by%20ChatGPT.png", locked: true }
    ];



    //this function is intended as a nice little generator to build the rows of items
    function generateLightItems(items) {
        return `
            <div id="item-list">
                ${items.map(item => `
                    <div class="item-row ${item.locked ? "locked" : ""}" data-item="${item.name}">
                        <img src="${item.img}" class="item-icon" alt="${item.name}">
                        <span class="item-name">${item.name}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Example placeholder panels for each tab
    // (Lights panel upgraded to dynamic generator above)
    const panels = {
        Lights: () => generateLightItems(lightItems),
        Stages: `
            <p>Stages available:</p>
            <ul>
                <li>🎤 Mini Stage</li>
                <li>🎪 Main Showcase Stage</li>
            </ul>
        `,
        "Food Stalls": `
            <p>Food Stalls available:</p>
            <ul>
                <li>🍔 Burger Van</li>
                <li>🍕 Pizza Stand</li>
                <li>🍩 Doughnut Cart</li>
            </ul>
        `
    };

    // the first tab that should be open is the "lights" one - that's the theme of Lumiere after all, and the core structure of the 3
    content.innerHTML = typeof panels["Lights"] === "function" ? panels["Lights"]() : panels["Lights"];

    // post-render, this function attatches listners onto the clickable items
    function attachItemListeners() {
        const rows = document.querySelectorAll('.item-row');

        rows.forEach(row => {
            if (row.classList.contains('locked')) {
                row.style.pointerEvents = "none";  // cannot click locked items
                return;
            }

            row.addEventListener('click', () => {
                // Play the little 8bit soundbite for clicking on an item
                clickSound.currentTime = 0;  // this is to account for v fast player clicks
                clickSound.play().catch(err => console.warn("Audio blocked:", err));

                const selected = row.dataset.item;
                console.log("Selected:", selected);
            });
        });
    }



    // ensure rows respond on initial load
    attachItemListeners();

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            clickSound.currentTime = 0; // play same audio sound as clicking on the items in this tab
            clickSound.play().catch(err => console.warn("Audio blocked:", err));
            // have to get rid of active from each tab though
            tabs.forEach(t => t.classList.remove('active'));
            // but activate the one that was clicked
            tab.classList.add('active');
            // and then update content panel
            const tabName = tab.textContent.trim();

            const panel = panels[tabName];
            content.innerHTML = typeof panel === "function" ? panel() : panel || `<p>No content yet.</p>`;

            // NEW: reattach listeners because the DOM has re-rendered
            attachItemListeners();
        });
    });
}
