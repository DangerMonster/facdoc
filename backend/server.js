const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// React build 결과물을 정적 파일로 서빙
app.use(express.static(path.join(__dirname, '../frontend/build')));

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('SQLite 데이터베이스에 연결되었습니다.');
    initDatabase();
  }
});

// 안전하게 암호화된 비밀번호(0609의 bcrypt 해시)
const PASSWORD_HASH = '$2b$10$AD0aM3nTKk/BnGxHmrtgOO9oaovOuC5udr1iyphTaUVULivukzbaS';

// 데이터베이스 초기화 및 테이블 생성
function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS real_estate_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_type TEXT NOT NULL,
      company_name TEXT NOT NULL,
      client_position TEXT,
      client_name TEXT NOT NULL,
      client_contact TEXT NOT NULL,
      factory_industry TEXT,
      factory_product TEXT,
      property_address TEXT NOT NULL,
      property_area REAL NOT NULL,
      building_floors INTEGER,
      hoist_count INTEGER,
      electrical_power REAL,
      truck_count INTEGER,
      desired_move_in_date TEXT,
      price REAL NOT NULL,
      price_per_sqm REAL NOT NULL,
      remarks TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('테이블 생성 오류:', err.message);
    } else {
      console.log('real_estate_listings 테이블이 생성되었습니다.');
    }
  });
}

// 평당 가격 계산 함수
function calculatePricePerSqm(price, area) {
  return area > 0 ? price / area : 0;
}

// 매물 등록 API
app.post('/api/listings', (req, res) => {
  const {
    transaction_type,
    company_name,
    client_position,
    client_name,
    client_contact,
    factory_industry,
    factory_product,
    property_address,
    property_area,
    building_floors,
    hoist_count,
    electrical_power,
    truck_count,
    desired_move_in_date,
    price,
    remarks
  } = req.body;

  const price_per_sqm = calculatePricePerSqm(price, property_area);

  const insertQuery = `
    INSERT INTO real_estate_listings (
      transaction_type, company_name, client_position, client_name, client_contact,
      factory_industry, factory_product, property_address, property_area,
      building_floors, hoist_count, electrical_power, truck_count,
      desired_move_in_date, price, price_per_sqm, remarks
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    transaction_type, company_name, client_position, client_name, client_contact,
    factory_industry, factory_product, property_address, property_area,
    building_floors, hoist_count, electrical_power, truck_count,
    desired_move_in_date, price, price_per_sqm, remarks
  ];

  db.run(insertQuery, values, function(err) {
    if (err) {
      console.error('매물 등록 오류:', err.message);
      res.status(500).json({ error: '매물 등록에 실패했습니다.' });
    } else {
      res.status(201).json({
        id: this.lastID,
        message: '매물이 성공적으로 등록되었습니다.',
        price_per_sqm: price_per_sqm
      });
    }
  });
});

// 매물 목록 조회 API (검색 기능 포함)
app.get('/api/listings', (req, res) => {
  const { 
    search, 
    transaction_type, 
    company_name, 
    client_name, 
    property_address,
    factory_industry,
    factory_product,
    min_area,
    max_area,
    min_price,
    max_price,
    min_floors,
    max_floors,
    hoist_count,
    electrical_power,
    truck_count
  } = req.query;
  
  let query = 'SELECT * FROM real_estate_listings WHERE 1=1';
  const params = [];

  if (search) {
    query += ` AND (
      company_name LIKE ? OR 
      client_name LIKE ? OR 
      property_address LIKE ? OR 
      factory_industry LIKE ? OR
      factory_product LIKE ?
    )`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (transaction_type) {
    query += ' AND transaction_type = ?';
    params.push(transaction_type);
  }

  if (company_name) {
    query += ' AND company_name LIKE ?';
    params.push(`%${company_name}%`);
  }

  if (client_name) {
    query += ' AND client_name LIKE ?';
    params.push(`%${client_name}%`);
  }

  if (property_address) {
    query += ' AND property_address LIKE ?';
    params.push(`%${property_address}%`);
  }

  if (factory_industry) {
    query += ' AND factory_industry LIKE ?';
    params.push(`%${factory_industry}%`);
  }

  if (factory_product) {
    query += ' AND factory_product LIKE ?';
    params.push(`%${factory_product}%`);
  }

  if (min_area) {
    query += ' AND property_area >= ?';
    params.push(parseFloat(min_area));
  }

  if (max_area) {
    query += ' AND property_area <= ?';
    params.push(parseFloat(max_area));
  }

  if (min_price) {
    query += ' AND price >= ?';
    params.push(parseFloat(min_price));
  }

  if (max_price) {
    query += ' AND price <= ?';
    params.push(parseFloat(max_price));
  }

  if (min_floors) {
    query += ' AND building_floors >= ?';
    params.push(parseInt(min_floors));
  }

  if (max_floors) {
    query += ' AND building_floors <= ?';
    params.push(parseInt(max_floors));
  }

  if (hoist_count) {
    query += ' AND hoist_count = ?';
    params.push(parseInt(hoist_count));
  }

  if (electrical_power) {
    query += ' AND electrical_power >= ?';
    params.push(parseFloat(electrical_power));
  }

  if (truck_count) {
    query += ' AND truck_count = ?';
    params.push(parseInt(truck_count));
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('매물 조회 오류:', err.message);
      res.status(500).json({ error: '매물 조회에 실패했습니다.' });
    } else {
      res.json(rows);
    }
  });
});

// 특정 매물 상세 조회 API
app.get('/api/listings/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM real_estate_listings WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('매물 상세 조회 오류:', err.message);
      res.status(500).json({ error: '매물 상세 조회에 실패했습니다.' });
    } else if (!row) {
      res.status(404).json({ error: '매물을 찾을 수 없습니다.' });
    } else {
      res.json(row);
    }
  });
});

// 매물 삭제 API
app.delete('/api/listings/:id', (req, res) => {
  const { id } = req.params;
  
  // 먼저 매물이 존재하는지 확인
  db.get('SELECT * FROM real_estate_listings WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('매물 확인 오류:', err.message);
      res.status(500).json({ error: '매물 삭제에 실패했습니다.' });
    } else if (!row) {
      res.status(404).json({ error: '삭제할 매물을 찾을 수 없습니다.' });
    } else {
      // 매물 삭제 실행
      db.run('DELETE FROM real_estate_listings WHERE id = ?', [id], function(err) {
        if (err) {
          console.error('매물 삭제 오류:', err.message);
          res.status(500).json({ error: '매물 삭제에 실패했습니다.' });
        } else {
          res.json({ 
            message: '매물이 성공적으로 삭제되었습니다.',
            deletedId: id
          });
        }
      });
    }
  });
});

// 추천 매물 조회 API
app.get('/api/listings/:id/recommendations', (req, res) => {
  const { id } = req.params;
  
  // 먼저 기준 매물 정보를 가져옴
  db.get('SELECT * FROM real_estate_listings WHERE id = ?', [id], (err, baseListing) => {
    if (err) {
      console.error('기준 매물 조회 오류:', err.message);
      res.status(500).json({ error: '추천 매물 조회에 실패했습니다.' });
      return;
    }
    
    if (!baseListing) {
      res.status(404).json({ error: '기준 매물을 찾을 수 없습니다.' });
      return;
    }

    // 유사도 점수를 계산하여 추천 매물을 가져옴
    const recommendationQuery = `
      SELECT *, 
        (
          -- 업종 일치 (가장 중요) - 35점
          CASE WHEN factory_industry = ? AND factory_industry != '' THEN 35 ELSE 0 END +
          
          -- 면적 유사도 (30% 이내 차이) - 25점
          CASE WHEN ABS(property_area - ?) / ? < 0.3 THEN 25 ELSE 0 END +
          
          -- 가격 유사도 (30% 이내 차이) - 20점
          CASE WHEN ABS(price - ?) / ? < 0.3 THEN 20 ELSE 0 END +
          
          -- 지역 일치 (시/군 단위) - 15점
          CASE WHEN property_address LIKE ? THEN 15 ELSE 0 END +
          
          -- 거래 종류 일치 - 10점
          CASE WHEN transaction_type = ? THEN 10 ELSE 0 END +
          
          -- 층수 유사도 (2층 이내 차이) - 8점
          CASE WHEN ABS(COALESCE(building_floors, 0) - COALESCE(?, 0)) <= 2 THEN 8 ELSE 0 END +
          
          -- 호이스트 개수 일치 - 5점
          CASE WHEN hoist_count = ? AND hoist_count IS NOT NULL THEN 5 ELSE 0 END +
          
          -- 전기 용량 유사도 (20% 이내 차이) - 5점
          CASE WHEN ABS(COALESCE(electrical_power, 0) - COALESCE(?, 0)) / NULLIF(COALESCE(?, 1), 0) < 0.2 THEN 5 ELSE 0 END +
          
          -- 트럭 대수 일치 - 3점
          CASE WHEN truck_count = ? AND truck_count IS NOT NULL THEN 3 ELSE 0 END +
          
          -- 제조품목 키워드 일치 - 2점
          CASE WHEN factory_product LIKE ? AND factory_product != '' THEN 2 ELSE 0 END
        ) as similarity_score,
        
        -- 상세 점수 정보 (디버깅용)
        (
          CASE WHEN factory_industry = ? AND factory_industry != '' THEN '업종일치(35)' ELSE '' END ||
          CASE WHEN ABS(property_area - ?) / ? < 0.3 THEN ' 면적유사(25)' ELSE '' END ||
          CASE WHEN ABS(price - ?) / ? < 0.3 THEN ' 가격유사(20)' ELSE '' END ||
          CASE WHEN property_address LIKE ? THEN ' 지역일치(15)' ELSE '' END ||
          CASE WHEN transaction_type = ? THEN ' 거래일치(10)' ELSE '' END ||
          CASE WHEN ABS(COALESCE(building_floors, 0) - COALESCE(?, 0)) <= 2 THEN ' 층수유사(8)' ELSE '' END ||
          CASE WHEN hoist_count = ? AND hoist_count IS NOT NULL THEN ' 호이스트일치(5)' ELSE '' END ||
          CASE WHEN ABS(COALESCE(electrical_power, 0) - COALESCE(?, 0)) / NULLIF(COALESCE(?, 1), 0) < 0.2 THEN ' 전기유사(5)' ELSE '' END ||
          CASE WHEN truck_count = ? AND truck_count IS NOT NULL THEN ' 트럭일치(3)' ELSE '' END ||
          CASE WHEN factory_product LIKE ? AND factory_product != '' THEN ' 품목일치(2)' ELSE '' END
        ) as score_details
      FROM real_estate_listings 
      WHERE id != ?
      ORDER BY similarity_score DESC 
      LIMIT 5
    `;

    const addressPattern = `%${baseListing.property_address.split(' ')[0]}%`;
    const productPattern = `%${baseListing.factory_product}%`;
    const params = [
      baseListing.factory_industry,
      baseListing.property_area,
      baseListing.property_area,
      baseListing.price,
      baseListing.price,
      addressPattern,
      baseListing.transaction_type,
      baseListing.building_floors,
      baseListing.hoist_count,
      baseListing.electrical_power,
      baseListing.electrical_power,
      baseListing.truck_count,
      productPattern,
      // 상세 점수 정보용 파라미터 (중복)
      baseListing.factory_industry,
      baseListing.property_area,
      baseListing.property_area,
      baseListing.price,
      baseListing.price,
      addressPattern,
      baseListing.transaction_type,
      baseListing.building_floors,
      baseListing.hoist_count,
      baseListing.electrical_power,
      baseListing.electrical_power,
      baseListing.truck_count,
      productPattern,
      id
    ];

    db.all(recommendationQuery, params, (err, recommendations) => {
      if (err) {
        console.error('추천 매물 조회 오류:', err.message);
        res.status(500).json({ error: '추천 매물 조회에 실패했습니다.' });
      } else {
        res.json({
          base_listing: baseListing,
          recommendations: recommendations
        });
      }
    });
  });
});

// 헬스체크 API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 비밀번호 인증 API
app.post('/api/auth/password', (req, res) => {
  console.log('비밀번호 인증 요청 받음:', { body: req.body });
  const { password } = req.body;
  if (!password) {
    console.log('비밀번호가 없음');
    return res.status(400).json({ error: '비밀번호를 입력하세요.' });
  }
  console.log('비밀번호 비교 시작');
  bcrypt.compare(password, PASSWORD_HASH, (err, result) => {
    if (err) {
      console.error('bcrypt 비교 오류:', err);
      return res.status(500).json({ error: '서버 오류' });
    }
    console.log('비밀번호 비교 결과:', result);
    if (!result) {
      return res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
    }
    // 인증 성공
    console.log('비밀번호 인증 성공');
    res.json({ success: true });
  });
});

// React 라우팅을 위한 catch-all 라우트 (API 라우트가 아닌 모든 요청을 React 앱으로)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

// 프로세스 종료 시 데이터베이스 연결 종료
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('데이터베이스 연결 종료 오류:', err.message);
    } else {
      console.log('데이터베이스 연결이 종료되었습니다.');
    }
    process.exit(0);
  });
}); 