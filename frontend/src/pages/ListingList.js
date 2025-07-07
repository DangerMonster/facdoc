import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SearchFilters from '../components/SearchFilters';
import ListingItem from '../components/ListingItem';

function ListingList({ requireAuth, auth }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({});

  useEffect(() => {
    if (auth) {
      fetchListings();
    } else {
      setLoading(false);
    }
  }, [searchParams, auth]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key]) {
          params.append(key, searchParams[key]);
        }
      });

      const response = await axios.get(`/api/listings?${params.toString()}`);
      setListings(response.data);
      setError(null);
    } catch (err) {
      console.error('매물 조회 오류:', err);
      setError('매물 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    requireAuth(() => setSearchParams(filters));
  };

  const handleDelete = (deletedId) => {
    setListings(prevListings => prevListings.filter(listing => listing.id !== deletedId));
  };

  if (!auth) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">매물 목록</h2>
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
          <Link to="/" className="btn btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">매물 목록</h2>
        </div>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 매물 목록</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/" className="btn btn-secondary">
              🏠 홈으로
            </Link>
            <Link to="/add" className="btn btn-primary">
              ➕ 새 매물 등록
            </Link>
          </div>
        </div>
      </div>

      <SearchFilters onSearch={handleSearch} />

      {error && (
        <div className="card">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}

      <div className="listings-container">
        {listings.length === 0 ? (
          <div className="card">
            <p>등록된 매물이 없습니다.</p>
          </div>
        ) : (
          listings.map(listing => (
            <ListingItem key={listing.id} listing={listing} onDelete={id => requireAuth(() => handleDelete(id))} requireAuth={requireAuth} auth={auth} />
          ))
        )}
      </div>
    </div>
  );
}

export default ListingList; 