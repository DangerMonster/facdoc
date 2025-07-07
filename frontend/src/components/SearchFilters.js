import React, { useState } from 'react';

function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    transaction_type: '',
    company_name: '',
    client_name: '',
    property_address: '',
    factory_industry: '',
    factory_product: '',
    min_area: '',
    max_area: '',
    min_price: '',
    max_price: '',
    min_floors: '',
    max_floors: '',
    hoist_count: '',
    electrical_power: '',
    truck_count: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      search: '',
      transaction_type: '',
      company_name: '',
      client_name: '',
      property_address: '',
      factory_industry: '',
      factory_product: '',
      min_area: '',
      max_area: '',
      min_price: '',
      max_price: '',
      min_floors: '',
      max_floors: '',
      hoist_count: '',
      electrical_power: '',
      truck_count: ''
    });
    onSearch({});
  };

  return (
    <div className="search-container">
      <h3>매물 검색</h3>
      <form onSubmit={handleSubmit}>
        {/* 기본 정보 검색 */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#333' }}>기본 정보</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label>통합 검색</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleInputChange}
                placeholder="회사명, 의뢰자명, 주소, 업종 등"
              />
            </div>

            <div className="form-group">
              <label>거래 종류</label>
                          <select
              name="transaction_type"
              value={filters.transaction_type}
              onChange={handleInputChange}
            >
              <option value="">전체</option>
              <option value="매도">매도</option>
              <option value="매수">매수</option>
              <option value="임대">임대</option>
              <option value="임차">임차</option>
            </select>
            </div>

            <div className="form-group">
              <label>회사명</label>
              <input
                type="text"
                name="company_name"
                value={filters.company_name}
                onChange={handleInputChange}
                placeholder="회사명으로 검색"
              />
            </div>

            <div className="form-group">
              <label>의뢰자명</label>
              <input
                type="text"
                name="client_name"
                value={filters.client_name}
                onChange={handleInputChange}
                placeholder="의뢰자명으로 검색"
              />
            </div>

            <div className="form-group">
              <label>부동산 주소</label>
              <input
                type="text"
                name="property_address"
                value={filters.property_address}
                onChange={handleInputChange}
                placeholder="주소로 검색"
              />
            </div>

            <div className="form-group">
              <label>공장 업종</label>
              <input
                type="text"
                name="factory_industry"
                value={filters.factory_industry}
                onChange={handleInputChange}
                placeholder="업종으로 검색"
              />
            </div>

            <div className="form-group">
              <label>공장 제조품목</label>
              <input
                type="text"
                name="factory_product"
                value={filters.factory_product}
                onChange={handleInputChange}
                placeholder="제조품목으로 검색"
              />
            </div>
          </div>
        </div>

        {/* 면적 및 가격 범위 검색 */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#333' }}>면적 및 가격</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label>최소 면적 (㎡)</label>
              <input
                type="number"
                name="min_area"
                value={filters.min_area}
                onChange={handleInputChange}
                placeholder="최소 면적"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>최대 면적 (㎡)</label>
              <input
                type="number"
                name="max_area"
                value={filters.max_area}
                onChange={handleInputChange}
                placeholder="최대 면적"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>최소 가격 (만원)</label>
              <input
                type="number"
                name="min_price"
                value={filters.min_price}
                onChange={handleInputChange}
                placeholder="최소 가격"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>최대 가격 (만원)</label>
              <input
                type="number"
                name="max_price"
                value={filters.max_price}
                onChange={handleInputChange}
                placeholder="최대 가격"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* 건물 및 시설 정보 검색 */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px', color: '#333' }}>건물 및 시설</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label>최소 층수</label>
              <input
                type="number"
                name="min_floors"
                value={filters.min_floors}
                onChange={handleInputChange}
                placeholder="최소 층수"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>최대 층수</label>
              <input
                type="number"
                name="max_floors"
                value={filters.max_floors}
                onChange={handleInputChange}
                placeholder="최대 층수"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>호이스트 개수</label>
              <input
                type="number"
                name="hoist_count"
                value={filters.hoist_count}
                onChange={handleInputChange}
                placeholder="호이스트 개수"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>전기 용량 (kW)</label>
              <input
                type="number"
                name="electrical_power"
                value={filters.electrical_power}
                onChange={handleInputChange}
                placeholder="전기 용량"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>트럭 대수</label>
              <input
                type="number"
                name="truck_count"
                value={filters.truck_count}
                onChange={handleInputChange}
                placeholder="트럭 대수"
                min="0"
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary">
            검색
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleClear}>
            초기화
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchFilters; 