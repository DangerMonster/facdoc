import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ auth, onLogin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          부동산 매물 관리 시스템
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              🏠 홈
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/listings" className="nav-link">
              📋 매물 목록
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/add" className="nav-link">
              ➕ 매물 등록
            </Link>
          </li>
          <li className="nav-item">
            {auth ? (
              <button 
                onClick={onLogout} 
                className="nav-link"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                🔓 로그아웃
              </button>
            ) : (
              <button 
                onClick={onLogin} 
                className="nav-link"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                🔒 로그인
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar; 