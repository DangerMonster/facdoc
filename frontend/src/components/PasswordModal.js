import React, { useState } from 'react';
import axios from 'axios';

function PasswordModal({ open, onSuccess, onClose }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log('비밀번호 인증 요청 시작:', { password: password ? '***' : 'empty' });
      const res = await axios.post('/api/auth/password', { password });
      console.log('비밀번호 인증 응답:', res.data);
      if (res.data.success) {
        setPassword('');
        setError('');
        if (onSuccess) onSuccess();
      } else {
        setError('비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('비밀번호 인증 오류:', err);
      console.error('오류 응답:', err.response?.data);
      console.error('오류 상태:', err.response?.status);
      setError(err.response?.data?.error || '서버 오류');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 24px rgba(23,107,69,0.15)' }}>
        <h3 style={{ color: '#176B45', marginBottom: 18 }}>비밀번호 인증</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            style={{ width: '100%', padding: 12, borderRadius: 6, border: '1.5px solid #b2d8c5', fontSize: 16, marginBottom: 12 }}
            autoFocus
          />
          {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 80 }}>
              {loading ? '확인 중...' : '확인'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordModal; 