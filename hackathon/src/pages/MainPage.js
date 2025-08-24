import React, { useState } from 'react';
import './MainPage.css';

const MainPage = ({ onPageChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // 검색 기능 구현
      console.log('검색어:', searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="main-page">
      {/* 검색바 */}
      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="이삿짐 센터 이름을 검색해보세요!"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            아이콘1
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="main-content">
        <h2 className="section-title">함께 이사해볼까요?</h2>
        
        <div className="cards-section">
          {/* 이사준비 카드 (파란색) */}
          <div className="preparation-card" onClick={() => onPageChange('survey')}>
            <div className="card-content">
              <div className="card-text">
                <h3>이사준비</h3>
                <p>당신만을 위한 체크리스트로 이사 준비를 지금 바로 시작해보세요!</p>
              </div>
            </div>
            <div className="arrow-icon">→</div>
          </div>

          {/* 이사업체 후기 카드들 (흰색) */}
          <div className="review-cards">
            <div className="review-card" onClick={() => onPageChange('reviews')}>
              <h4>이사업체 후기</h4>
            </div>
            <div className="review-card" onClick={() => onPageChange('reviews')}>
              <h4>이사업체 후기</h4>
            </div>
          </div>
        </div>

        {/* BEST 이삿짐 후기 섹션 */}
        <div className="best-reviews-section">
          <div className="section-header">
            <h3>BEST 이삿짐 후기</h3>
            <span className="more-link">더보기</span>
          </div>

          {/* 공지사항 */}
          <div className="notice-bar">
            <span className="notice-label">공지</span>
            <span className="notice-text">8월달 BEST
              <br/>이삿짐 후기 당첨자 명단</span>
            <span className="notice-arrow">→</span>
          </div>

          {/* 후기 목록 */}
          <div className="reviews-list">
            {/* 첫 번째 후기 */}
            <div className="review-item">
              <div className="review-image">
                <div className="image-placeholder">아이콘1</div>
                <span className="image-number">2424</span>
              </div>
              <div className="review-content">
                <div className="review-header">
                  <h4>신부동 베스트 이사</h4>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="review-text">
                  이번에 이삿짐을 옮기는데 아주 깔끔하고 친절하게 옮겨주셨어요! 
                  특히 이런저런점이 제일 좋았고 또 이런점도 좋았습니다. 
                  옮긴 짐이 적진 않았을텐데 힘든 티 내지 않으시고 기분좋게 일해주셨어요. 
                  굉장히 좋은 기억이 되었습니다!
                </p>
              </div>
            </div>

            {/* 두 번째 후기 */}
            <div className="review-item">
              <div className="review-image">
                <div className="image-placeholder">아이콘2</div>
                <span className="image-number">2424</span>
              </div>
              <div className="review-content">
                <div className="review-header">
                  <h4>신부동 베스트 이사</h4>
                  <div className="rating">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="review-text">
                  이번에 이삿짐을 옮기는데 아주 깔끔하고 친절하게 옮겨주셨어요! 
                  특히 이런저런점이 제일 좋았고 또 이런점도 좋았습니다. 
                  옮긴 짐이 적진 않았을텐데 힘든 티 내지 않으시고 기분좋게 일해주셨어요. 
                  굉장히 좋은 기억이 되었습니다!
                </p>
              </div>
            </div>

            {/* 세 번째 후기 */}
            <div className="review-item">
              <div className="review-image">
                <div className="image-placeholder">아이콘3</div>
                <span className="image-number">2424</span>
              </div>
              <div className="review-content">
                <div className="review-header">
                  <h4>신부동 베스트 이사</h4>
                  <div className="rating">⭐⭐⭐⭐</div>
                </div>
                <p className="review-text">
                  이번에 이삿짐을 옮기는데 아주 깔끔하고 친절하게 옮겨주셨어요! 
                  특히 이런저런점이 제일 좋았고...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 