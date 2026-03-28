import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './context/Firebase';
import { ThemeProvider } from './context/ThemeContext';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';   
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeProvider>
            <FirebaseProvider>
                <ErrorBoundary>                            
                    <App />
                </ErrorBoundary>                           
            </FirebaseProvider>
        </ThemeProvider>
    </BrowserRouter>
);