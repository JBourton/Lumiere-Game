// [NOTE TO MARKER]: As specified in the coursework announcment, I used generative AI here to add a "colourblind mode"
// as per the module annoucment, this is entirely seperate from the game mechanics, logic and object interactions
// I thought it would be a nice feature to have for accessibility relating exclusivley to the UI design
// p.s. I asked it to reference itself in all areas of the codebase in which it incorporated this feature, as there are a few files in which the functions defined here need to be called
// the model is "GPT-5.1-Codex-Max" so you can do a cntrl + shift + f and search for that to find where it directly inserted the code to get this colourblind feature running.


// %%%%% now for the gen-ai code %%%%%


// Accessibility helper for toggling a colour-blind-friendly theme.
// This keeps logic local and communicates via a small custom event so other
// systems (like the heatmap) can refresh palettes when the mode changes.
// Added by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).

import { Frustration } from "../logic/resources.js";

const defaultHeatmapPalette = [
    [0.0, "rgba(147,115,62,1)"],
    [1.0 / 5.0, "rgba(180,145,78,1)"],
    [2.0 / 5.0, "rgba(226, 168, 160, 1)"],
    [3.0 / 5.0, "rgba(200,120,90,1)"],
    [4.0 / 5.0, "rgba(170,80,60,1)"],
    [5.0 / 5.0, "rgba(150,40,40,1)"]
];

// Brewer-friendly sequential palette (inspired by Viridis) avoids red/green clashes.
const colourblindHeatmapPalette = [
    [0.0, "rgba(220,220,220,1)"],
    [1.0 / 5.0, "rgba(68, 1, 84, 1)"],
    [2.0 / 5.0, "rgba(59, 82, 139, 1)"],
    [3.0 / 5.0, "rgba(33, 145, 140, 1)"],
    [4.0 / 5.0, "rgba(94, 201, 98, 1)"],
    [5.0 / 5.0, "rgba(253, 231, 37, 1)"]
];

const cbFrustrationGradients = [
    { max: 25, gradient: "linear-gradient(180deg,#2d6cc0,#1b9aaa)" },
    { max: 50, gradient: "linear-gradient(180deg,#1b9aaa,#8ecae6)" },
    { max: 75, gradient: "linear-gradient(180deg,#f3a712,#e36414)" },
    { max: 100, gradient: "linear-gradient(180deg,#e36414,#8c2f39)" }
];

const defaultFrustrationGradients = [
    { max: 25, gradient: "limegreen" },
    { max: 50, gradient: "yellow" },
    { max: 75, gradient: "orange" },
    { max: 100, gradient: "red" }
];

let colourblindEnabled = false;
let styleEl = null;
let buttonEl = null;

function ensureInjectedStyles() {
    if (styleEl) return;
    styleEl = document.createElement("style");
    styleEl.id = "colourblind-mode-style";
    styleEl.textContent = `
        body.colourblind-mode #magic-container { background: #0b172a; border-color: #8ecae6; }
        body.colourblind-mode #magic-bar { background: #4cc9f0; }
        body.colourblind-mode #magic-text { color: #f1faee; }
        body.colourblind-mode #staff-container, body.colourblind-mode #visitor-container {
            color: #0b172a;
            background: rgba(255,255,255,0.82);
            padding: 2px 6px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }
        body.colourblind-mode #resource-ui { background: rgba(0,0,0,0.25); padding: 4px 8px; border-radius: 10px; }
        body.colourblind-mode #frustration-bar-container { background: #0b172a; border-color: #8ecae6; }
        body.colourblind-mode #frustration-label { color: #fefae0; text-shadow: 0 1px 2px rgba(0,0,0,0.6); }
        body.colourblind-mode #heatmapMiniContainer { border-color: #8ecae6; background: rgba(18,18,18,0.95); }
        body.colourblind-mode #heatmapMini { border-color: #8ecae6; }
        body.colourblind-mode #mute-button,
        body.colourblind-mode #toggle-heatmap-button,
        body.colourblind-mode #pause-button,
        body.colourblind-mode #colourblind-button {
            background: rgba(0,0,0,0.6);
            color: #fefae0;
        }
        body.colourblind-mode .placement-preview { background-color: rgba(0,120,200,0.2); }
        body.colourblind-mode .placement-preview-tile { outline-color: rgba(0,120,200,0.85); background-color: rgba(0,120,200,0.25); }
        body.colourblind-mode .placement-preview-tile.invalid { outline-color: rgba(230, 132, 34, 0.9); background-color: rgba(230, 132, 34, 0.25); }
        /* Accessibility: highlight existing path tiles without changing gameplay (Added by GitHub Copilot (GPT-5.1-Codex-Max (Preview)).) */
        body.colourblind-mode .path { position: relative; outline: 2px solid #fefae0; box-shadow: 0 0 0 2px rgba(0,0,0,0.6) inset, 0 0 6px 2px rgba(255,255,255,0.35); }
        body.colourblind-mode .path::after {
            content: "";
            position: absolute;
            inset: 3px;
            pointer-events: none;
            display: block;
            background: repeating-linear-gradient(45deg, rgba(255,255,255,0.32) 0 6px, rgba(0,0,0,0.22) 6px 12px);
            border-radius: 3px;
            opacity: 1;
            z-index: 2;
            mix-blend-mode: normal;
        }
    `;
    document.head.appendChild(styleEl);
}

function setButtonLabel() {
    if (!buttonEl) return;
    const symbol = colourblindEnabled ? "⏻" : "⭘";
    const state = colourblindEnabled ? "ON" : "OFF";
    buttonEl.textContent = `Colourblind mode: ${state} ${symbol}`;
}

function findGradient(gradients, lvl) {
    return gradients.find(g => lvl <= g.max)?.gradient || gradients[gradients.length - 1].gradient;
}

function applyFrustrationColours() {
    const bar = document.getElementById("frustration-bar");
    if (!bar) return;
    const lvl = typeof Frustration?.get === "function" ? Frustration.get() : 0;
    const gradients = colourblindEnabled ? cbFrustrationGradients : defaultFrustrationGradients;
    bar.style.background = findGradient(gradients, lvl);
}

function dispatchModeChange() {
    document.dispatchEvent(new CustomEvent("colourblindmodechange", {
        detail: { enabled: colourblindEnabled, palette: getHeatmapPalette() }
    }));
}

function toggleMode() {
    colourblindEnabled = !colourblindEnabled;
    applyMode();
}

function applyMode(options = { emit: true }) {
    ensureInjectedStyles();
    document.body.classList.toggle("colourblind-mode", colourblindEnabled);
    setButtonLabel();
    applyFrustrationColours();
    if (options.emit) dispatchModeChange();
}

function handleFrustrationUpdates() {
    Frustration.addListener(() => {
        if (colourblindEnabled) {
            applyFrustrationColours();
        }
    });
}

export function initColourblindMode() {
    buttonEl = document.getElementById("colourblind-button");
    if (!buttonEl) return;
    ensureInjectedStyles();
    handleFrustrationUpdates();
    buttonEl.addEventListener("click", toggleMode);
    applyMode({ emit: false });
}

export function refreshColourblindStyles() {
    applyMode();
}

export function isColourblindEnabled() {
    return colourblindEnabled;
}

export function getHeatmapPalette() {
    return colourblindEnabled ? colourblindHeatmapPalette : defaultHeatmapPalette;
}
