// import { getAuthToken } from './AuthService';

// 프록시를 사용하므로 상대 경로 사용
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

class ChecklistService {
  constructor() {
    // CORS 문제로 인해 직접 백엔드 URL 사용
    this.baseUrl = `https://jimcarry.onrender.com/api/checklist`;
  }

  // API 요청 헤더 생성
  async getHeaders() {
    // CORS 우회를 위한 헤더들
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://hackathon-7nsg.vercel.app',
      'Referer': 'https://hackathon-7nsg.vercel.app/'
    };
  }

  // 설문 답변을 체크리스트 항목으로 변환
  convertSurveyToChecklist(selections) {
    const checklistItems = [];
    
    selections.forEach((selection, index) => {
      const { questionId, answer } = selection;
      
      // 답변이 배열인 경우 각각을 별도 항목으로 생성
      if (Array.isArray(answer)) {
        answer.forEach((ans, ansIndex) => {
          checklistItems.push({
            itemId: `${questionId}_${ansIndex}`,
            itemName: ans,
            selected: true,
            category: `question_${questionId}`
          });
        });
      } else {
        // 답변이 단일 값인 경우
        checklistItems.push({
          itemId: questionId,
          itemName: answer,
          selected: true,
          category: `question_${questionId}`
        });
      }
    });
    
    return checklistItems;
  }

  // AI 체크리스트 생성 (설문 완료 후)
  async generateChecklistFromSurvey(selections) {
    try {
      // 설문 답변을 ChecklistItemDto 형식으로 변환
      const checklistItems = this.convertSurveyToChecklist(selections);
      console.log('변환된 체크리스트 데이터:', checklistItems);

      const response = await fetch(`${this.baseUrl}/complete`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(checklistItems)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('백엔드 응답 상태:', response.status, response.statusText);
        console.error('백엔드 응답 헤더:', Object.fromEntries(response.headers.entries()));
        console.error('백엔드 응답 내용:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('체크리스트 생성 실패:', error);
      throw error;
    }
  }

  // 체크리스트 항목 완료 처리
  async completeChecklistItem(itemId) {
    try {
      const response = await fetch(`${this.baseUrl}/item/${itemId}/complete`, {
        method: 'POST',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('체크리스트 항목 완료 처리 실패:', error);
      throw error;
    }
  }

  // 저장된 체크리스트 조회
  async getMyChecklist() {
    try {
      const response = await fetch(`${this.baseUrl}/my-list`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('체크리스트 조회 실패:', error);
      throw error;
    }
  }

  // 체크리스트 항목 토글 (완료/미완료)
  async toggleChecklistItem(itemId, isCompleted) {
    try {
      if (isCompleted) {
        // 완료 처리
        return await this.completeChecklistItem(itemId);
      } else {
        // 미완료 처리 (백엔드에 해당 API가 있다면)
        const response = await fetch(`${this.baseUrl}/item/${itemId}/incomplete`, {
          method: 'POST',
          headers: await this.getHeaders()
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('체크리스트 항목 토글 실패:', error);
      throw error;
    }
  }

  // 백엔드 연결 상태 테스트
  async testConnection() {
    try {
      console.log('백엔드 연결 테스트 시작...');
      console.log('테스트 URL:', `${this.baseUrl}/my-list`);
      
      const response = await fetch(`${this.baseUrl}/my-list`, {
        method: 'GET',
        headers: await this.getHeaders()
      });
      
      console.log('연결 테스트 응답:', response.status, response.statusText);
      console.log('응답 헤더:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('에러 응답:', errorText);
      }
      
      return response.ok;
    } catch (error) {
      console.error('연결 테스트 실패:', error);
      return false;
    }
  }

  // 에러 처리 헬퍼 메서드
  handleApiError(error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      const { status, data } = error.response;
      switch (status) {
        case 401:
          throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
        case 403:
          throw new Error('접근 권한이 없습니다.');
        case 404:
          throw new Error('요청한 리소스를 찾을 수 없습니다.');
        case 500:
          throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        default:
          throw new Error(data?.message || '알 수 없는 오류가 발생했습니다.');
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      throw new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      // 요청 자체를 보내지 못한 경우
      throw new Error('요청을 처리할 수 없습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성
const checklistService = new ChecklistService();

export default checklistService; 