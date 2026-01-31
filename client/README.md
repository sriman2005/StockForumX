# StockForumX Frontend

![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Socket.io](https://img.shields.io/badge/-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Chart.js](https://img.shields.io/badge/-Recharts-22b5bf?style=for-the-badge&logo=react&logoColor=white)

The user interface for StockForumX, built with **React** and **Vite**, focusing on speed and real-time responsiveness.

## Features

- **Real-time Chat**: Powered by Socket.io client.
- **Live Charts**: Interactive stock charts using Recharts.
- **Responsive Design**: Mobile-first CSS.
- **Authentication**: Secure JWT storage and context.

## Getting Started

### Prerequisites

> [!IMPORTANT]
> Ensure the **Backend** is running on port 5000 before starting the frontend.

- Node.js v18+
- npm or yarn

### Installation

```bash
cd client
npm install
```

### Running Locally

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Building for Production

```bash
npm run build
```

This generates static files in the `dist/` directory, ready to be served by Nginx or any static host.

## Project Structure

```text
src/
├── components/   # UI building blocks
├── pages/        # Application routes
├── context/      # Global state (Auth, Socket)
├── services/     # API integration
└── assets/       # Images and fonts
```

## Configuration

The frontend communicates with the backend via a proxy or direct URL.

> [!NOTE]
> Update `vite.config.js` proxy settings if your backend runs on a different port.

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/socket.io': {
        target: 'http://localhost:5000',
        ws: true
      }
    }
  }
})
```
