// This file is responsible for the coding of the sidebar, including the button switching and the drag-drop behaviour


// All logic to setup sidebar is encapsulated nicely in this
export function setupSidebar() {
    const tabs = document.querySelectorAll('#sidebar-tabs .tab');  // I have different tabs for the sidebar btns; this fetches the ids so the player can interact w/ them
    const content = document.getElementById('sidebar-content');

    // Example placeholder panels for each tab
    const panels = {
        Lights: `
            <p>Lights available:</p>
            <ul>
                <li>⭐ Fairy Lights</li>
                <li>🌙 Moon Lamp</li>
                <li>✨ Sparkle Beam</li>
            </ul>
        `,
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
    content.innerHTML = panels["Lights"];
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // have to get rid of active from each tab though
            tabs.forEach(t => t.classList.remove('active'));
            // but activate the one that was clicked
            tab.classList.add('active');
            // and then update content panel
            const tabName = tab.textContent.trim();
            content.innerHTML = panels[tabName] || `<p>No content yet.</p>`;
        });
    });
}
