# 🌙 **Lumiere Festival Planner**  
*A tiny 2D management-puzzle game about making Durham glow… without everything falling apart.*

Welcome to **Lumiere Festival Planner**, a small but chaotic love-letter to Durham’s most enchanting November tradition. You step into the shoes of the festival’s chief planner — the person responsible for transforming the city into a glowing maze of installations, attractions and very opinionated visitors.

The premise is simple:  
Build the festival. Keep visitors happy. Avoid causing gridlock on the Bailey.

The reality is slightly less simple:  
Crowd flow changes on the fly, staffing fluctuates, resources ebb and grow and visitors are not shy about expressing their frustration. Your job is to balance it all without letting the whole event collapse like a poorly supported lantern arch.

---

## 🎮 **What You Do in This Game**

### **✨ Place Attractions**  
Scatter installations, statues and key landmarks across the Durham city grid to shape the festival’s layout. Every choice influences crowd behaviour and overall magic.

### **🚶 Manage Visitors (the good, the bad, the mildly confused)**  
Visitors navigate the map autonomously, guided by simple steering logic and a bit of polite chaos. Good design keeps them flowing smoothly. Bad design creates a pile-up near Elvet Bridge.

### **🌟 Maintain the Magic**  
Magic acts as the core festival resource. Good choices boost it, unlocking better attractions. Poor decisions drain it and push the festival towards chaos.

### **😠 Keep Frustration Down**  
Visitors get grumpy when forced into bottlenecks. Grumpy visitors reduce your score and complain loudly, which feels very true to life.

### **🧱 Build Durham (your way)**  
Behind the scenes, the map is a clean grid system, manually designed to reflect recognisable Durham paths. Sprites, icons and a custom 8-bit night backdrop help give the whole thing a distinctive flavour.

---

## 🧩 **Main Gameplay Features**

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

This project is built using **HTML, CSS and JavaScript modules**, with a clean separation between:

- `map.js`, `playerMovement.js`, `resources.js` — core game logic  
- `popup.js` — UI elements and modal behaviour  
- `audio.js` — audio management  
- `src/assets/` — sprites and backgrounds  
- `main.js` — game initialisation

The architecture is intentionally flexible and designed for extension.

---

## 🧭 **Accessibility & UX**

To keep things manageable for a range of players, the prototype includes:

- Clear iconography and simplified UI  
- Muted-on-start audio  
- High-contrast menus  
- Modal-based onboarding

---

## 📦 **External Resources Used**

All external assets are either:

- Created by me  
- Generated using ChatGPT 5.1 (pretty much all the artwork, as my focus was the actual gameplay loop)
- Or free-to-use assets with attribution where relevant (like the background audio)

Full details are provided in the accompanying report.

---

# 🧑‍💻 **How to Play Locally**

### **1. Download or extract the project folder**  
Ensure the folder structure remains intact, especially `src/` and `assets/`.

### **2. Run a local server (required for ES6 modules)**  

#### **Option A: VS Code + Live Server**
1. Open the project folder in VS Code  
2. Install the **Live Server** extension  
3. Right-click `index.html`  
4. Choose **Open with Live Server**

#### **Option B: Python**
Run this in the project’s root directory:

