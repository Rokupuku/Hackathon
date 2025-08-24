class AuthService {
  constructor() {
    this.tokenKey = 'jimcarry_auth_token';
    this.userKey = 'jimcarry_user_info';
  }

  // 토큰 저장
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // 토큰 가져오기
  getAuthToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // 토큰 제거
  removeAuthToken() {
    localStorage.removeItem(this.tokenKey);
  }

  // 사용자 정보 저장
  setUserInfo(userInfo) {
    if (userInfo) {
      localStorage.setItem(this.userKey, JSON.stringify(userInfo));
    } else {
      localStorage.removeItem(this.userKey);
    }
  }

  // 사용자 정보 가져오기
  getUserInfo() {
    const userInfo = localStorage.getItem(this.userKey);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // 사용자 정보 제거
  removeUserInfo() {
    localStorage.removeItem(this.userKey);
  }

  // 로그인 상태 확인
  isAuthenticated() {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      // JWT 토큰 만료 확인 (간단한 방식)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        // 토큰이 만료된 경우
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
      this.logout();
      return false;
    }
  }

  // 로그아웃
  logout() {
    this.removeAuthToken();
    this.removeUserInfo();
    // 로그인 페이지로 리다이렉트
    window.location.href = '/';
  }

  // 토큰 갱신 (필요시)
  async refreshToken() {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        this.setAuthToken(data.token);
        return data.token;
      } else {
        throw new Error('토큰 갱신 실패');
      }
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      this.logout();
      throw error;
    }
  }
}

// 싱글톤 인스턴스 생성
const authService = new AuthService();

export default authService;

// 개별 함수들을 export
export const getAuthToken = () => authService.getAuthToken();
export const setAuthToken = (token) => authService.setAuthToken(token);
export const removeAuthToken = () => authService.removeAuthToken();
export const isAuthenticated = () => authService.isAuthenticated();
export const logout = () => authService.logout(); 