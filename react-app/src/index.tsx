// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Auth0Provider
    domain="dev-g11osle77cypjnvf.us.auth0.com"
    clientId="zsw70GFiQRM1HxFj9AmhT85vfMUW7KRg"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://dev-g11osle77cypjnvf.us.auth0.com/api/v2/",
      scope: "openid profile email read:current_user update:current_user_metadata read:roles"
    }}
  >
    <Router>
      <App />
    </Router>
  </Auth0Provider>
);