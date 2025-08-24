// API 설정
export const API_CONFIG = {
  // 백엔드 서버 URL (프록시 사용 시 상대 경로)
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  
  // API 버전
  VERSION: process.env.REACT_APP_API_VERSION || 'v1',
  
  // API 엔드포인트
  ENDPOINTS: {
    // 인증 관련
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout'
    },
    
    // 체크리스트 관련
    CHECKLIST: {
      COMPLETE: '/api/checklist/complete',
      ITEM_COMPLETE: '/api/checklist/item',
      MY_LIST: '/api/checklist/my-list'
    },
    
    // 설문조사 관련
    SURVEY: {
      SUBMIT: '/api/survey/submit',
      GET_QUESTIONS: '/api/survey/questions',
      GET_RESULTS: '/api/survey/results'
    },
    
    // 사용자 관련
    USER: {
      PROFILE: '/api/user/profile',
      UPDATE: '/api/user/update',
      DELETE: '/api/user/delete'
    },
    
    // 후기 관련
    REVIEWS: {
      LIST: '/api/reviews',
      CREATE: '/api/reviews/create',
      UPDATE: '/api/reviews',
      DELETE: '/api/reviews'
    },
    
    // 이사 관련
    MOVING: {
      COMPANIES: '/api/moving/companies',
      ESTIMATE: '/api/moving/estimate',
      BOOKING: '/api/moving/booking'
    }
  },
  
  // HTTP 상태 코드
  STATUS_CODES: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // 요청 타임아웃 (밀리초)
  TIMEOUT: 10000,
  
  // 재시도 횟수
  MAX_RETRIES: 3,
  
  // 재시도 간격 (밀리초)
  RETRY_DELAY: 1000
};

// API URL 생성 헬퍼 함수
export const createApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API 응답 처리 헬퍼 함수
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  // 응답이 비어있는 경우 (204 No Content)
  if (response.status === API_CONFIG.STATUS_CODES.NO_CONTENT) {
    return null;
  }
  
  return response.json();
};

// 에러 메시지 변환
export const getErrorMessage = (error) => {
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 400:
        return '잘못된 요청입니다. 입력값을 확인해주세요.';
      case 401:
        return '인증이 필요합니다. 다시 로그인해주세요.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  } else if (error.request) {
    return '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
  } else {
    return error.message || '요청을 처리할 수 없습니다.';
  }
}; 