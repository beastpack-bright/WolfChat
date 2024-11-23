import React from 'react';
import { createRoot } from 'react-dom/client';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import HowlForm from './components/HowlForm';
import Feed from './components/Feed';
import Layout from './components/Layout';
import NotFound from './components/NotFound'
import Settings from './components/Settings';
import Profile from './components/Profile';

const App = () => {
    const path = window.location.pathname;

    // Only show NavBar if user is logged in (not on login, 404 or signup pages)
    const isAuthPage = path === '/' || path === '/signup' || path === "/404";

    const getComponent = () => {
        switch (path) {
            case '/signup':
                return <SignupForm />;
            case '/howls':
                return <HowlForm />;
            case '/feed':
                return <Feed />;
            case '/settings':
                return <Settings />;
            case '/404':
                return <NotFound />;
            default:
                // Add this section to handle profile routes
                if (path.startsWith('/profile/')) {
                    return <Profile />;
                }
                return <LoginForm />;
        }
    };

    return isAuthPage ? getComponent() : (
        <Layout>
            {getComponent()}
        </Layout>
    );
};
document.addEventListener('DOMContentLoaded', () => {
    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
});