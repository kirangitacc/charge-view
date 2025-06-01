# Charge View

Charge View is a full-stack web application for managing and monitoring EV charging stations. It allows users to onboard, edit, and delete chargers, filter and search stations, and view all chargers on an interactive map.

## Features

- **User Authentication:** Secure login and registration with JWT-based authentication.
- **Charger Listing:** View all onboarded chargers with filters for status, power output, and connector type.
- **Add/Edit/Delete Chargers:** Easily manage charging stations.
- **Map View:** See all chargers on an interactive OpenStreetMap map. Click markers to view details and manage chargers.
- **Profile Management:** View user profile and logout securely.
- **Protected Routes:** Only authenticated users can manage stations.

## Tech Stack

- **Frontend:** React, React Router, React Select, Leaflet (OpenStreetMap), CSS
- **Backend:** Node.js, Express, SQLite
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/charge-view.git
   cd charge-view
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend app:**
   ```bash
   cd ../frontend
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Register** as a new user or **login** if you already have an account.
- **Add** new charging stations using the form.
- **Edit** or **delete** existing stations from the map or list.
- **Filter** stations by status, power output, or connector type.
- **View** all stations on the map and click markers for details.

## Folder Structure

```
charge-view/
  backend/
    app.js
    ...
  frontend/
    src/
      components/
      App.js
      ...
  README.md
```

## License

This project is licensed under the MIT License.

---

**Made with ❤️ for EV infrastructure management.**