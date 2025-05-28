import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../../src/App';
import "../../src/index.css";

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(<App />);
}
