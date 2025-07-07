import React from 'react';
import { Link } from 'react-router-dom';

function Home({ requireAuth, auth }) {
  if (!auth) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">부동산 매물 관리 시스템</h2>
        </div>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
          <h3 style={{ color: '#176B45', marginBottom: '15px' }}>로그인이 필요합니다</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            매물 목록을 보려면 상단 네비게이션의 <strong>🔒 로그인</strong> 버튼을 클릭하여 비밀번호를 입력해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🏠 부동산 매물 관리 시스템</h2>
        </div>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏢</div>
          <h3 style={{ color: '#176B45', marginBottom: '20px' }}>환영합니다!</h3>
          <p style={{ color: '#666', marginBottom: '30px', fontSize: '16px' }}>
            부동산 매물을 효율적으로 관리할 수 있는 시스템입니다.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginTop: '30px'
          }}>
            <Link to="/listings" className="btn btn-primary" style={{ padding: '20px', fontSize: '16px' }}>
              📋 매물 목록 보기
            </Link>
            <Link to="/add" className="btn btn-secondary" style={{ padding: '20px', fontSize: '16px' }}>
              ➕ 새 매물 등록
            </Link>
          </div>
          
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            <h4 style={{ color: '#176B45', marginBottom: '15px' }}>📊 주요 기능</h4>
            <ul style={{ color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
              <li>매물 등록 및 관리</li>
              <li>상세 검색 및 필터링</li>
              <li>유사 매물 추천</li>
              <li>매물 삭제 및 수정</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 