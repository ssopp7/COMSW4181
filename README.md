# PixelEd – Pixel Tracking Education Platform

PixelEd is an interactive web app designed to help users understand **what pixel tracking is**, **how it operates in real-world websites**, and **what steps users can take to protect their privacy online**.  
The platform includes learning modules, simulations, and a mini-game to provide hands-on experience with browser-based tracking technologies.

---

## Project Structure

### **Main Web App**
These files make up the core PixelEd application:

- `index.html` – Main structure of the web app  
- `scripts.js` – Client-side JavaScript functionality  
- `styles.css` – Styling for the UI  

The main site and the Module 5 game are both deployed on **Netlify**.

---

### **Module 5: Pixel Detective Game**
Located in:

`pixel-tracker-game/`

This directory contains the standalone mini-game where users identify and block “tracking pixels” in a simulated environment.

---

### **Module 3: Pixel Tracking Simulation**
This module uses **two separate deployed websites** to simulate real-world pixel tracking behavior.

- `pixel-tracker-sim/`  
  Contains the simulated shopping website where a tracking pixel records user activity.  
  Deployed using **InfinityFree**.

- `pixel-tracker-dash/`  
  Contains the dashboard that displays the data collected by the tracking pixel.  
  Deployed using **InfinityFree**.

URLs for both sites are embedded directly in **Module 3** of the main app for seamless navigation.

---

## How to Use

### **Option 1 — Use the deployed version (recommended)**
Simply open the Netlify deployment URL included in the Module 1 introduction.

### **Option 2 — Run locally**
If you downloaded the repository:

1. Open your terminal  
2. Navigate to the project directory  
3. Run:

    `open index.html`

This will launch the web app in your default browser.  
No additional setup or dependencies are required.