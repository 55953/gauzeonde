
# Gauzeonde
Gauzeonde Transport platform focused on real-time shipment tracking, driver map, and dashboard analytics—all built in React (with Socket.IO, Axios, and Google Maps support).

This React application is the dashboard and shipment tracking portal for Gauzeonde Transport.

## Features

- Real-time driver and shipment tracking (Google Maps)
- Batch location updates for admin/dispatcher dashboard
- JWT-based authentication with API
- Socket.IO WebSocket client for live updates

## Getting Started

1. **Install dependencies**

   ```bash
   npm install

### Project Structure

frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── Auth.js
│   │   ├── ShipmentTracker.js
│   │   ├── DriverMap.js
│   │   └── Dashboard.js
│   ├── App.js
│   ├── index.js
│   └── config.js
├── package.json
├── .env
└── README.md
2. **Configure .env**

```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=http://localhost:3001
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```
3. **Run development**
```bash
npm start
```

### Run

```bash
npx create-react-app gauzeonde-frontend
cd gauzeonde-frontend
npm install socket.io-client axios @react-google-maps/api
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`