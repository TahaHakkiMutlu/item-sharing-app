# 🌱 ShareHub (Eşyanı Paylaş)

> **ShareHub** is a modern, map-supported web application with an integrated Green Points rewards system designed to help communities share unused items, exchange goods, and promote sustainable living.

---

## ✨ Features

* **🔐 User & Admin Management:**
  * User registration, authentication, and dedicated Admin Mode.
  * Comprehensive Admin Panel to manage users (add/deduct points, toggle roles, remove users) and moderate active listings.
* **🗺️ Interactive Map Integration (Leaflet.js):**
  * Real-time map view displaying item listings based on location.
  * Direct "Focus on Map" navigation from item details.
* **📦 Item Sharing & Smart Filtering:**
  * Post new items for free or offer them for trade.
  * Filter listings by category, type (Free vs. Trade), and keyword search.
* **💬 Built-in Messaging System:**
  * Direct in-app chat with item owners to coordinate pickups and exchanges.
* **🏆 Green Points & Leaderboard (Gamification):**
  * Earn **Green Points** for every shared item and compete on the community leaderboard.
* **👤 User Profile Management:**
  * Edit user details, review active listings, and manage personal contributions.
* **🔔 Toast Notification System:**
  * Sleek, animated alerts for system actions and status updates.

---

## 🛠️ Tech Stack

* **Frontend Framework:** [Vue.js 3](https://vuejs.org/) (CDN / Global Build)
* **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) & Custom CSS (`style.css`)
* **Mapping Library:** [Leaflet.js](https://leafletjs.com/)
* **Typography:** Plus Jakarta Sans
* **Core Logic:** Modern JavaScript (ES6+)

---

## 📁 Project Structure

```text
.
├── index.html        # Main HTML markup and Vue 3 template
├── style.css         # Custom animations and styling overrides
└── script.js         # Vue app state, component logic, and Leaflet map integration
