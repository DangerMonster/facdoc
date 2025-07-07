import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AddListing({ requireAuth, auth }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    transaction_type: '',
    company_name: '',
    client_position: '',
    client_name: '',
    client_contact: '',
    factory_industry: '',
    factory_product: '',
    property_address: '',
    property_area: '',
    building_floors: '',
    hoist_count: '',
    electrical_power: '',
    truck_count: '',
    desired_move_in_date: '',
    price: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const doSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // 숫자 필드들을 변환
      const submitData = {
        ...formData,
        property_area: parseFloat(formData.property_area) || 0,
        building_floors: parseInt(formData.building_floors) || null,
        hoist_count: parseInt(formData.hoist_count) || null,
        electrical_power: parseFloat(formData.electrical_power) || null,
        truck_count: parseInt(formData.truck_count) || null,
        price: parseFloat(formData.price) || 0
      };
      const response = await axios.post('/api/listings', submitData);
      alert('매물이 성공적으로 등록되었습니다!');
      navigate('/');
    } catch (err) {
      console.error('매물 등록 오류:', err);
      setError('매물 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requireAuth(doSubmit);
  };

  if (!auth) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">새 매물 등록</h2>
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
            매물을 등록하려면 상단 네비게이션의 <strong>🔒 로그인</strong> 버튼을 클릭하여 비밀번호를 입력해주세요.
          </p>
          <Link to="/" className="btn btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">새 매물 등록</h2>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label>거래 종류 *</label>
            <select
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleInputChange}
              required
            >
              <option value="">선택하세요</option>
              <option value="매도">매도</option>
              <option value="매수">매수</option>
              <option value="임대">임대</option>
              <option value="임차">임차</option>
            </select>
          </div>

          <div className="form-group">
            <label>회사명 *</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              placeholder="회사명을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>의뢰자 직책</label>
            <input
              type="text"
              name="client_position"
              value={formData.client_position}
              onChange={handleInputChange}
              placeholder="의뢰자 직책을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>의뢰자 이름 *</label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleInputChange}
              required
              placeholder="의뢰자 이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>의뢰자 연락처 *</label>
            <input
              type="text"
              name="client_contact"
              value={formData.client_contact}
              onChange={handleInputChange}
              required
              placeholder="연락처를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>공장 업종</label>
            <input
              type="text"
              name="factory_industry"
              value={formData.factory_industry}
              onChange={handleInputChange}
              placeholder="공장 업종을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>공장 제조품목</label>
            <input
              type="text"
              name="factory_product"
              value={formData.factory_product}
              onChange={handleInputChange}
              placeholder="제조품목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>부동산 주소 *</label>
            <input
              type="text"
              name="property_address"
              value={formData.property_address}
              onChange={handleInputChange}
              required
              placeholder="부동산 주소를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>부동산 면적 (㎡) *</label>
            <input
              type="number"
              name="property_area"
              value={formData.property_area}
              onChange={handleInputChange}
              required
              step="0.01"
              placeholder="면적을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>건물 층수</label>
            <input
              type="number"
              name="building_floors"
              value={formData.building_floors}
              onChange={handleInputChange}
              placeholder="층수를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>호이스트 개수</label>
            <input
              type="number"
              name="hoist_count"
              value={formData.hoist_count}
              onChange={handleInputChange}
              placeholder="호이스트 개수를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>전기 동력 (kW)</label>
            <input
              type="number"
              name="electrical_power"
              value={formData.electrical_power}
              onChange={handleInputChange}
              step="0.1"
              placeholder="전기 동력을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>화물차 대수</label>
            <input
              type="number"
              name="truck_count"
              value={formData.truck_count}
              onChange={handleInputChange}
              placeholder="화물차 대수를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>원하는 입주시기</label>
            <input
              type="date"
              name="desired_move_in_date"
              value={formData.desired_move_in_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>가격 (원) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              step="1000"
              placeholder="가격을 입력하세요"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>비고</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              placeholder="추가적인 정보나 특이사항을 입력하세요"
              rows="4"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ddd', 
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '등록 중...' : '매물 등록'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddListing; 