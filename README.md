# **Lumiere Festival Planner 🌙🌚🎄**  
*A little 2D management-puzzle game about making Durham glow… without everything falling apart.*

Welcome to **Lumiere Festival Planner**, a small but chaotic love-letter to Durham’s most enchanting November tradition! Should you choose to play, you'll step into the shoes of a poor lowly intern, left to run the festival himself after the festival’s chief planner bunked from his duties to go watch a Newcastle FC match. You'll be the person responsible for transforming the city into a glowing maze of installations, stages, foodstalls and *very* opinionated visitors.

The premise is simple:  
Build the festival. Keep visitors happy, create a "magic" atmosphere. Avoid turning the streets of Durham into absolute carnage. Easy right? Well...😅

The reality is *slightly* less simple:  
As you decorate Durham, more visitors come to the city to see what the fuss is all about. More visitors means busier streets, which can get preeettyy frustrating for those already at the festival and cause the city's "magic" level to decrease. What's more, you'll be managing staff to run your attractions, so you'll need to strike the right balance in your chosen attraction placements to ensure Lumiere's visitors are both well-fed AND well-entertained!

Your job is to balance it all without letting the whole event collapse like an overworked student in summative season. Good work experience for an intern eh!?

---

## **What You'll Be Doing (in more detail)**

### **Placing Attractions 🏗️🏢**  
Scatter lights, stages and food stalls across the Durham city grid to shape the festival’s layout. Every choice influences crowd behaviour and overall magic.

### **Managing Visitors (the happy, the sad and the mildly frustrated) 👯🤼🧑‍🤝‍🧑**  
Visitors navigate the map autonomously, guided by A* steering logic and adapted to try and avoid crowds where possible, but with a good degree of chaos programmed in (don't you worry about that!). Good design keeps them flowing smoothly. Bad design creates a pile-up of grumpy people.

### **Maintain the Magic! 🧙‍♂️🪄🎩**  
Magic acts as the core festival resource. Good choices boost it, unlocking better attractions. Poor decisions drain it and push the festival towards chaos.

### **Keep Frustration Down 😃😐😒😡**  
Visitors get grumpy when crammed together. Grumpy visitors complain loudly and drain magic QUICKLY, which also reduces incoming visitors.

### **Build Durham (your own way) 💒🧱**  
Behind the scenes the map is a clean grid system, manually designed to (vaguely) reflect paths in Durham. Sprites, icons and a custom 8-bit backdrop help give the whole game it's own little distinctive personality.

---

## **Main Gameplay Features 🧩🎲**

- Grid-based environment rendered dynamically  
- Player character with smooth directional movement  
- Custom 8-bit art of real Durham landmarks  
- Resource bars (Magic, Staff, Visitors, Frustration) updated throughout gameplay  
- Positive and negative feedback loops shaping player strategy  
- Modular code layout with logic separated from UI  
- Intro modal that appears on first load per session  
- Sound system with mute support  

---

## 🛠️ **Technical Structure**

So my game is both manageable for development and easily adaptable to a wide player-base, the design was intentionally modular. UX and accessibility features were kept seperate from the logical gameplay layers in the following way:

### src/logic

This directory contains all my core simulation systems and gameplay logic and is designed to support future extensibility.

- **map.js** – Builds & maintains the grid-based Durham map + exposes its state to other systems (like the heatmap).  
- **pathfinding.js** – Implements A* pathfinding with congestion-avoidance, using helper functions to identify valid walkable path tiles.
- **visitors.js** – Controls autonomous visitor NPC behaviour like state transitions, movement and attraction selection.  
- **congestion.js** – Models localised crowd congestion and frustration using spatial overlap detection and heatmap aggregation.  
- **resources.js** – Manages core gameplay resources such as Magic, Staff, Visitors and Frustration.  
- **placementPreview.js** – Handles placement validation and visual feedback when the player positions attractions.  
- **foodCoverage.js** – Computes attraction coverage areas and applies food-related gameplay effects.
- **playerMovement.js** - Encapsulates player movement logic, enforcing path-only navigation and collision rules.
- **unlock.js** - Enables sequential unlocking of different attraction types.
- **restart.js** - Resets game state.
- **pause.js** - Suspends game state.
- **placeableDefinitions.js** - A config file containing information on attractions values.
- **config.js** - The main global config file for tweaking gameplay hyperparameters.


### src/components

This directory contains the js systems responsible for visualisation, feedback & accessibility. They do not interefere with the core game mechanics.

- **popup.js** – Provides the game state notifications (game won/loss + introduction)
- **tutorial.js** - Implements tooltip-based onboarding by highlighting key aspects of the game sequentially. 
- **sidebar.js** – Contains the attractions the player can place.  
- **heatmap.js** – Renders the congestion heatmap overlay and exposes simplified spatial data for strategic feedback and accessibility.  
- **renderVisitors.js** – Draws visitor sprites onto the map independently of NPC behaviour logic.  
- **audio.js** – Manages background audio and sound effects with explicit user-controlled toggles.  
- **colourblindMode.js** – Provides an optional colour-blind-friendly visual mode limited strictly to UI styling and colour palettes (this one's ai-generated).

---

## **Accessibility & UX ♿🦻🧑‍🦯‍➡️**

To make my game as accessible and visually pleasing as possible for a range of players, the game includes:

- Heatmap overlay: driven by the current game state, this serves a dual purpose both allowing for strategic planning at a glance, and also as an accessibility feature to allow players to visualise otherwise invisible crowd density data, thus supporting informed decision making.
- Clear iconography and simplified UI: resource indicators, controls and system feedback presented with icons and minimal visual clutter to reduce player's congnitive load and allow for quick interpretation of game state without having to rely on text overlays beyond the tutorial.
- Toggleable audio: music sets the theme, but my game recognises that this could be overwhelming for some players, and thus allows it to be played/paused on command.
- High-contrast menus: My core UI components (e.g. resource bars, attraction buttons) use strong contrast with clear boundaries so the game is easily legible across different visual abilities.
- Tootltip-based tutorial prompts: on game load, the player is presented with an optional tutorial through the use of a series of tooltips highlighting core elements of the game.
- Consistent feedback across UI and simulation: as congestion, frustration and magic changes, visual cues like an expressive crowd emotion bar are setup to reinforce the relationship between the player's decisions and the system's responses, supporting players in devloping accurate mental models of the game's mechanics quickly.

---

## **External Resources I Used 📦🗃️**

All external assets are either:

- Created by me  
- Generated using ChatGPT 5.1 (pretty much all the artwork, as my focus was the actual gameplay loop)
- Or free-to-use assets with attribution where relevant (like the background audio)

Full details are provided in the accompanying report.

---

# **How to Play Locally 🧑‍💻**

### **1. Download or extract the project folder**  
Ensure the folder structure remains intact, especially `src/` and `assets/`.

### **2. Run a local server**  

#### **Option A: VS Code + Live Server**
1. Open the project folder in VS Code  
2. Install the **Live Server** extension  
3. Right-click `index.html`  
4. Choose **Open with Live Server**

#### **Option B: Python**
Run this in the project’s root directory:
```sh
python -m http.server 8000
```
Then open your browser and go to [http://localhost:8000](http://localhost:8000)



# 🧑‍💻 **Use of Generative AI**
I used OpenAI's GPT 5.1 Codex (Preview) model inside CoPilot VS Code extension to add in a colourblind mode that expands on top of my self-constructed UI. I prompted it to look at how my colours and structure was setup in my repo and build the feature with logic placed within (primarily) a seperate UI file (src/components/colourblind.js), adding in explicit AI accreditation on the areas it modified.

Specifically, the prompt used was:
*"I want a new file in src/components that activates a "colour blind mode". Help me to try this out. The only change that should happen is that there's a button positioned to the right of the current row of control buttons in index.html that says "Colourblind mode: " with on/off symbols. When the user clicks it, it should modify the game's styles to be suitable to colourblind people, including highlighting the paths in a colour-blind-accessible style. I want this to be as minimal on the rest of the codebase as possible, but should still be added to necessary files like game restart and other appropriate areas of the codebase, with minimal modifications to those files other than to prevent bugs. You'll need to scan the whole repo to see where the other buttons are incoporated and use them in a similar context. Use your knowledge of colourblind colours to do this, putting almost all of the logic (as much as possible) in a new file called colourblind.js in src/components. Credit yourslef (inc. model name) in every part where you apply changes.*

Additionally, all the images in the game were custom-generated using Chat GPT 5.1, including the path, pavement and grass images.


# Links to Machinations Diagrams
- [Machinations Diagram 01: Game's Internal Resources](https://my.machinations.io/d/updated-machinations-diagram-01-games-internal-resources/27025f9bbefa11f0838a0abc5ce0dcc9)
- [Machinations Diagram 02: Dynamic Object Interactions](https://my.machinations.io/d/updated-machinations-diagram-02-dynamic-object-interactions/33248d73bf1311f0838a0abc5ce0dcc9)