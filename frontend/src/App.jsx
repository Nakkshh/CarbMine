import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/HomePage';
import CalculationsPage from './pages/CalculationsPage';
import EstimatePage from './pages/EstimatePage';
import SavedReportsPage from './pages/SavedReportsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PredictionMapPage from './pages/PredictionMapPage';


function App() {
    return (
        <Routes>
            {/* ── Auth pages — NO navbar/footer ── */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

            {/* ── All other pages — WITH navbar/footer ── */}
            <Route path='/' element={
                <Layout>
                    <HomePage />
                </Layout>
            } />
            <Route path='/calculation' element={
                <Layout>
                    <ProtectedRoute><CalculationsPage /></ProtectedRoute>
                </Layout>
            } />
            <Route path='/estimate' element={
                <Layout>
                    <ProtectedRoute><EstimatePage /></ProtectedRoute>
                </Layout>
            } />
            <Route path='/view' element={
                <Layout>
                    <ProtectedRoute><SavedReportsPage /></ProtectedRoute>
                </Layout>
            } />
            <Route path='/predict' element={
                <Layout>
                    <ProtectedRoute><PredictionMapPage /></ProtectedRoute>
                </Layout>
            } />
        </Routes>
    );
}

export default App;