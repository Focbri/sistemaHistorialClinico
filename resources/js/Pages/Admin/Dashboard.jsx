import React from 'react';

export default function AdminDashboard() {
    return (
        <div>
            <h1>Dashboard de Administrador</h1>
            <p>Bienvenido, Administrador {window.user.name}!</p>
        </div>
    );
}