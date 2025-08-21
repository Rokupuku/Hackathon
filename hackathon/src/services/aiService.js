// AI API 연동 서비스
class AIService {
  constructor() {
    // 실제 AI API 키는 환경변수에서 가져와야 합니다
    this.apiKey = process.env.REACT_APP_AI_API_KEY || 'your-api-key-here';
    this.apiEndpoint = process.env.REACT_APP_AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  }

  // 설문조사 결과를 AI에게 보내서 체크리스트 생성
  async generateChecklist(surveyAnswers) {
    try {
      const prompt = this.createPrompt(surveyAnswers);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '당신은 이사 준비 전문가입니다. 설문조사 결과를 바탕으로 개인화된 이사 체크리스트를 만들어주세요.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error('AI API 요청 실패');
      }

      const data = await response.json();
      const checklist = this.parseAIResponse(data.choices[0].message.content);
      
      return checklist;
    } catch (error) {
      console.error('AI 체크리스트 생성 실패:', error);
      // AI API 실패 시 기본 체크리스트 반환
      return this.generateDefaultChecklist(surveyAnswers);
    }
  }

  // AI에게 보낼 프롬프트 생성
  createPrompt(surveyAnswers) {
    const answers = Object.entries(surveyAnswers).map(([key, value]) => {
      const questionMap = {
        1: '현재 주거 형태',
        2: '이사할 집 형태',
        3: '집에 있는 옵션',
        4: '이삿짐 운반 방법',
        5: '이삿날',
        6: '이삿짐 양',
        7: '특별히 신경 쓰고 싶은 부분'
      };
      
      return `${questionMap[key]}: ${value}`;
    }).join('\n');

    return `
다음 설문조사 결과를 바탕으로 개인화된 이사 체크리스트를 만들어주세요:

${answers}

다음 형식으로 JSON 형태로 응답해주세요:
{
  "title": "개인화된 이사 체크리스트",
  "items": [
    {
      "id": "1",
      "title": "체크리스트 항목 제목",
      "description": "상세 설명",
      "category": "카테고리",
      "priority": "high/medium/low",
      "estimatedTime": "예상 소요 시간",
      "completed": false
    }
  ]
}
    `;
  }

  // AI 응답을 파싱하여 체크리스트 형태로 변환
  parseAIResponse(aiResponse) {
    try {
      // JSON 부분만 추출
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('JSON 파싱 실패');
    } catch (error) {
      console.error('AI 응답 파싱 실패:', error);
      return this.generateDefaultChecklist({});
    }
  }

  // 기본 체크리스트 생성 (AI API 실패 시 사용)
  generateDefaultChecklist(surveyAnswers) {
    return {
      title: "이사 준비 체크리스트",
      items: [
        {
          id: "1",
          title: "현재 집 정리 및 정리",
          description: "불필요한 물건 정리 및 폐기",
          category: "정리",
          priority: "high",
          estimatedTime: "2-3일",
          completed: false
        },
        {
          id: "2",
          title: "이사업체 견적 비교",
          description: "여러 이사업체의 견적을 받아 비교",
          category: "이사업체",
          priority: "high",
          estimatedTime: "1-2일",
          completed: false
        },
        {
          id: "3",
          title: "전입신고 준비",
          description: "주민등록등본, 신분증 등 준비",
          category: "행정",
          priority: "high",
          estimatedTime: "1일",
          completed: false
        },
        {
          id: "4",
          title: "새 집 인테리어 계획",
          description: "가구 배치 및 인테리어 계획 수립",
          category: "인테리어",
          priority: "medium",
          estimatedTime: "2-3일",
          completed: false
        },
        {
          id: "5",
          title: "이삿짐 포장",
          description: "깨지기 쉬운 물건 포장 및 라벨링",
          category: "포장",
          priority: "medium",
          estimatedTime: "3-5일",
          completed: false
        }
      ]
    };
  }
}

export default new AIService(); 