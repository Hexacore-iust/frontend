import React from 'react';

const Home = () => {
  return (
    <div className="home-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          color: '#1f2937',
          marginBottom: '16px',
          fontWeight: '700',
        }}>
          Welcome to Karchin
        </h1>
        
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <a 
            href="/login"
            style={{
              padding: '12px 32px',
              backgroundColor: '#1abc9c',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1.05)'}
          >
            Login
          </a>
          
          <a 
            href="/signup"
            style={{
              padding: '12px 32px',
              backgroundColor: '#1f2937',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1.05)'}
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;