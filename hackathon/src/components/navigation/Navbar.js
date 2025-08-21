import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, onPageChange, onMenuToggle }) => {
  const [showMenu, setShowMenu] = useState(false);

  // 메뉴 상태가 변경될 때마다 부모 컴포넌트에 알림
  useEffect(() => {
    onMenuToggle(showMenu);
  }, [showMenu, onMenuToggle]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const changePage = (page) => {
    onPageChange(page);
    setShowMenu(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      {/* 토글 메뉴 */}
      <div className={`navbar ${showMenu ? 'hidden' : ''}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          <div className="hamburger-icon">
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </button>
      </div>

      {/* 사이드바 오버레이 */}
      {showMenu && (
        <div className="sidebar-overlay" onClick={closeMenu}></div>
      )}

      {/* 사이드바 메뉴 */}
      <div className={`sidebar ${showMenu ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>모두의 이삿짐</h3>
          <button className="close-button" onClick={closeMenu}>
            ✕
          </button>
        </div>
        <div className="sidebar-content">
          <button
            className={`sidebar-item ${currentPage === 'welcome' ? 'active' : ''}`}
            onClick={() => changePage('welcome')}
          >
            메인화면
          </button>
          <button
            className={`sidebar-item ${currentPage === 'survey' ? 'active' : ''}`}
            onClick={() => changePage('survey')}
          >
            설문조사
          </button>
          <button
            className={`sidebar-item ${currentPage === 'ai-checklist' ? 'active' : ''}`}
            onClick={() => changePage('ai-checklist')}
          >
            AI 체크리스트
          </button>
          <button
            className={`sidebar-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => changePage('dashboard')}
          >
            대시보드
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar; 