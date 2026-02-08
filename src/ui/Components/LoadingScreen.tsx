import React from 'react';

export const LoadingScreen: React.FC = () => {
    return (
        <div style={{
            background: "white",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            fontSize: '1.2rem'
        }}>
            Loading 3D Configurator...
        </div>
    );
};
