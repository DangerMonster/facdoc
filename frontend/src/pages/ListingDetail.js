import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ListingDetail({ requireAuth, auth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    fetchListingDetail();
  }, [id]);

  const fetchListingDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/listings/${id}`);
      setListing(response.data);
      setError(null);
    } catch (err) {
      console.error('매물 상세 조회 오류:', err);
      setError('매물 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`/api/listings/${id}/recommendations`);
      setRecommendations(response.data.recommendations);
      setShowRecommendations(true);
    } catch (err) {
      console.error('추천 매물 조회 오류:', err);
      alert('추천 매물을 불러오는데 실패했습니다.');
    }
  };

  const doDelete = async () => {
    if (!window.confirm('정말로 이 매물을 삭제하시겠습니까?\n삭제된 매물은 복구할 수 없습니다.')) {
      return;
    }
    try {
      console.log('삭제 시도 중... 매물 ID:', id);
      const response = await axios.delete(`/api/listings/${id}`);
      console.log('삭제 성공:', response.data);
      alert('매물이 성공적으로 삭제되었습니다.');
      navigate('/');
    } catch (err) {
      console.error('매물 삭제 오류:', err);
      console.error('오류 응답:', err.response?.data);
      alert(`매물 삭제에 실패했습니다.\n오류: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = () => {
    requireAuth(doDelete);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (!auth) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">매물 상세 정보</h2>
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
            매물 상세 정보를 보려면 상단 네비게이션의 <strong>🔒 로그인</strong> 버튼을 클릭하여 비밀번호를 입력해주세요.
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
          <h2 className="card-title">매물 상세 정보</h2>
        </div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">매물 상세 정보</h2>
        </div>
        <p style={{ color: 'red' }}>{error || '매물을 찾을 수 없습니다.'}</p>
        <Link to="/" className="btn btn-primary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">{listing.company_name} - 매물 상세 정보</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={fetchRecommendations}
            >
              추천 매물 보기
            </button>
            <Link to="/" className="btn btn-secondary">
              목록으로 돌아가기
            </Link>
            {auth && (
              <button 
                className="btn btn-danger" 
                onClick={handleDelete}
                style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
              >
                🗑️ 매물 삭제
              </button>
            )}
          </div>
        </div>

        <div className="listing-details" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div className="listing-detail">
            <strong>거래 종류:</strong> {listing.transaction_type}
          </div>
          <div className="listing-detail">
            <strong>회사명:</strong> {listing.company_name}
          </div>
          <div className="listing-detail">
            <strong>의뢰자:</strong> {listing.client_name} ({listing.client_position || '-'})
          </div>
          <div className="listing-detail">
            <strong>연락처:</strong> {listing.client_contact}
          </div>
          <div className="listing-detail">
            <strong>공장 업종:</strong> {listing.factory_industry || '-'}
          </div>
          <div className="listing-detail">
            <strong>제조품목:</strong> {listing.factory_product || '-'}
          </div>
          <div className="listing-detail">
            <strong>부동산 주소:</strong> {listing.property_address}
          </div>
          <div className="listing-detail">
            <strong>부동산 면적:</strong> {listing.property_area}㎡
          </div>
          <div className="listing-detail">
            <strong>건물 층수:</strong> {listing.building_floors || '-'}층
          </div>
          <div className="listing-detail">
            <strong>호이스트 개수:</strong> {listing.hoist_count || '-'}개
          </div>
          <div className="listing-detail">
            <strong>전기 동력:</strong> {listing.electrical_power || '-'}kW
          </div>
          <div className="listing-detail">
            <strong>화물차 대수:</strong> {listing.truck_count || '-'}대
          </div>
          <div className="listing-detail">
            <strong>원하는 입주시기:</strong> {formatDate(listing.desired_move_in_date)}
          </div>
          <div className="listing-detail">
            <strong>가격:</strong> {formatPrice(listing.price)}원
          </div>
          <div className="listing-detail">
            <strong>평당 가격:</strong> {formatPrice(Math.round(listing.price_per_sqm))}원/㎡
          </div>
          <div className="listing-detail">
            <strong>등록일:</strong> {formatDate(listing.created_at)}
          </div>
          {listing.remarks && (
            <div className="listing-detail" style={{ gridColumn: '1 / -1', marginTop: '15px' }}>
              <strong>비고:</strong>
              <div style={{ 
                marginTop: '5px', 
                padding: '10px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '4px',
                whiteSpace: 'pre-wrap'
              }}>
                {listing.remarks}
              </div>
            </div>
          )}
        </div>
      </div>

      {showRecommendations && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">추천 매물 (유사도 순)</h3>
          </div>
          
          {recommendations.length === 0 ? (
            <p>유사한 매물이 없습니다.</p>
          ) : (
            <div className="recommendations-container">
              {recommendations.map((rec, index) => (
                <div key={rec.id} className="recommendation-item" style={{
                  border: '1px solid #b2d8c5',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0, color: '#176B45' }}>
                      {index + 1}. {rec.company_name}
                    </h4>
                    <span style={{ 
                      backgroundColor: '#176B45', 
                      color: 'white', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      유사도: {rec.similarity_score}점
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '14px' }}>
                    <div><strong>거래:</strong> {rec.transaction_type}</div>
                    <div><strong>주소:</strong> {rec.property_address}</div>
                    <div><strong>면적:</strong> {rec.property_area}㎡</div>
                    <div><strong>가격:</strong> {formatPrice(rec.price)}원</div>
                    <div><strong>업종:</strong> {rec.factory_industry || '-'}</div>
                    <div><strong>층수:</strong> {rec.building_floors || '-'}층</div>
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <Link to={`/listing/${rec.id}`} className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }}>
                      상세보기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ListingDetail; 