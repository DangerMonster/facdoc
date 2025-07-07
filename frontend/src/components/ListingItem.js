import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ListingItem({ listing, onDelete, requireAuth, auth }) {
  const navigate = useNavigate();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const doDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`"${listing.company_name}" 매물을 정말로 삭제하시겠습니까?\n삭제된 매물은 복구할 수 없습니다.`)) {
      return;
    }
    try {
      console.log('삭제 시도 중... 매물 ID:', listing.id);
      const response = await axios.delete(`/api/listings/${listing.id}`);
      console.log('삭제 성공:', response.data);
      alert('매물이 성공적으로 삭제되었습니다.');
      if (onDelete) {
        onDelete(listing.id);
      }
    } catch (err) {
      console.error('매물 삭제 오류:', err);
      console.error('오류 응답:', err.response?.data);
      alert(`매물 삭제에 실패했습니다.\n오류: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = (e) => {
    requireAuth(() => doDelete(e));
  };

  return (
    <div className="listing-item">
      <div className="listing-header">
        <h3 className="listing-title">
          {listing.company_name}
          {listing.remarks && (
            <span style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginLeft: '8px',
              fontWeight: 'normal'
            }}>
              📝 비고 있음
            </span>
          )}
        </h3>
        <span className="listing-type">{listing.transaction_type}</span>
      </div>
      
      <div className="listing-details">
        <div className="listing-detail">
          <strong>의뢰자:</strong> {listing.client_name} ({listing.client_position || '-'})
        </div>
        <div className="listing-detail">
          <strong>연락처:</strong> {listing.client_contact}
        </div>
        <div className="listing-detail">
          <strong>주소:</strong> {listing.property_address}
        </div>
        <div className="listing-detail">
          <strong>면적:</strong> {listing.property_area}㎡
        </div>
        <div className="listing-detail">
          <strong>가격:</strong> {formatPrice(listing.price)}원
        </div>
        <div className="listing-detail">
          <strong>평당가격:</strong> {formatPrice(Math.round(listing.price_per_sqm))}원/㎡
        </div>
        <div className="listing-detail">
          <strong>업종:</strong> {listing.factory_industry || '-'}
        </div>
        <div className="listing-detail">
          <strong>제조품목:</strong> {listing.factory_product || '-'}
        </div>
        <div className="listing-detail">
          <strong>층수:</strong> {listing.building_floors || '-'}층
        </div>
        <div className="listing-detail">
          <strong>호이스트:</strong> {listing.hoist_count || '-'}개
        </div>
        <div className="listing-detail">
          <strong>전기동력:</strong> {listing.electrical_power || '-'}kW
        </div>
        <div className="listing-detail">
          <strong>화물차:</strong> {listing.truck_count || '-'}대
        </div>
        <div className="listing-detail">
          <strong>입주시기:</strong> {formatDate(listing.desired_move_in_date)}
        </div>
      </div>

      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <Link to={`/listing/${listing.id}`} className="btn btn-primary">
          상세보기
        </Link>
        <Link to={`/listing/${listing.id}`} className="btn btn-secondary">
          추천 매물 보기
        </Link>
        {auth && (
          <button 
            className="btn btn-danger" 
            onClick={handleDelete}
            style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          >
            🗑️ 삭제
          </button>
        )}
      </div>
    </div>
  );
}

export default ListingItem; 