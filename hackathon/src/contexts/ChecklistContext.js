import React, { createContext, useContext, useReducer, useEffect } from 'react';

// 체크리스트 상태 관리 Context
const ChecklistContext = createContext();

// 초기 상태
const initialState = {
  checklists: [],
  currentChecklist: null,
  loading: false,
  error: null
};

// 액션 타입
const CHECKLIST_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_CHECKLIST: 'ADD_CHECKLIST',
  UPDATE_CHECKLIST: 'UPDATE_CHECKLIST',
  DELETE_CHECKLIST: 'DELETE_CHECKLIST',
  SET_CURRENT_CHECKLIST: 'SET_CURRENT_CHECKLIST',
  TOGGLE_ITEM: 'TOGGLE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM'
};

// 리듀서
function checklistReducer(state, action) {
  switch (action.type) {
    case CHECKLIST_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case CHECKLIST_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case CHECKLIST_ACTIONS.ADD_CHECKLIST:
      return {
        ...state,
        checklists: [...state.checklists, action.payload],
        currentChecklist: action.payload,
        loading: false,
        error: null
      };
    
    case CHECKLIST_ACTIONS.UPDATE_CHECKLIST:
      return {
        ...state,
        checklists: state.checklists.map(checklist =>
          checklist.id === action.payload.id ? action.payload : checklist
        ),
        currentChecklist: state.currentChecklist?.id === action.payload.id 
          ? action.payload 
          : state.currentChecklist,
        loading: false
      };
    
    case CHECKLIST_ACTIONS.DELETE_CHECKLIST:
      return {
        ...state,
        checklists: state.checklists.filter(checklist => checklist.id !== action.payload),
        currentChecklist: state.currentChecklist?.id === action.payload ? null : state.currentChecklist
      };
    
    case CHECKLIST_ACTIONS.SET_CURRENT_CHECKLIST:
      return { ...state, currentChecklist: action.payload };
    
    case CHECKLIST_ACTIONS.TOGGLE_ITEM:
      if (!state.currentChecklist) return state;
      
      const updatedItems = state.currentChecklist.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, completed: !item.completed }
          : item
      );
      
      const updatedChecklist = {
        ...state.currentChecklist,
        items: updatedItems
      };
      
      return {
        ...state,
        currentChecklist: updatedChecklist,
        checklists: state.checklists.map(checklist =>
          checklist.id === updatedChecklist.id ? updatedChecklist : checklist
        )
      };
    
    case CHECKLIST_ACTIONS.UPDATE_ITEM:
      if (!state.currentChecklist) return state;
      
      const updatedItems2 = state.currentChecklist.items.map(item =>
        item.id === action.payload.itemId
          ? { ...item, ...action.payload.updates }
          : item
      );
      
      const updatedChecklist2 = {
        ...state.currentChecklist,
        items: updatedItems2
      };
      
      return {
        ...state,
        currentChecklist: updatedChecklist2,
        checklists: state.checklists.map(checklist =>
          checklist.id === updatedChecklist2.id ? updatedChecklist2 : checklist
        )
      };
    
    default:
      return state;
  }
}

// Context Provider 컴포넌트
export function ChecklistProvider({ children }) {
  const [state, dispatch] = useReducer(checklistReducer, initialState);

  // 로컬 스토리지에서 체크리스트 불러오기
  useEffect(() => {
    const savedChecklists = localStorage.getItem('checklists');
    if (savedChecklists) {
      try {
        const parsed = JSON.parse(savedChecklists);
        if (parsed.length > 0) {
          dispatch({ type: CHECKLIST_ACTIONS.ADD_CHECKLIST, payload: parsed[0] });
        }
      } catch (error) {
        console.error('저장된 체크리스트 파싱 실패:', error);
      }
    }
  }, []);

  // 체크리스트 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (state.checklists.length > 0) {
      localStorage.setItem('checklists', JSON.stringify(state.checklists));
    }
  }, [state.checklists]);

  // 액션 생성자들
  const actions = {
    setLoading: (loading) => dispatch({ type: CHECKLIST_ACTIONS.SET_LOADING, payload: loading }),
    
    setError: (error) => dispatch({ type: CHECKLIST_ACTIONS.SET_ERROR, payload: error }),
    
    addChecklist: (checklist) => dispatch({ type: CHECKLIST_ACTIONS.ADD_CHECKLIST, payload: checklist }),
    
    updateChecklist: (checklist) => dispatch({ type: CHECKLIST_ACTIONS.UPDATE_CHECKLIST, payload: checklist }),
    
    deleteChecklist: (checklistId) => dispatch({ type: CHECKLIST_ACTIONS.DELETE_CHECKLIST, payload: checklistId }),
    
    setCurrentChecklist: (checklist) => dispatch({ type: CHECKLIST_ACTIONS.SET_CURRENT_CHECKLIST, payload: checklist }),
    
    toggleItem: (itemId) => dispatch({ type: CHECKLIST_ACTIONS.TOGGLE_ITEM, payload: { itemId } }),
    
    updateItem: (itemId, updates) => dispatch({ 
      type: CHECKLIST_ACTIONS.UPDATE_ITEM, 
      payload: { itemId, updates } 
    })
  };

  return (
    <ChecklistContext.Provider value={{ state, actions }}>
      {children}
    </ChecklistContext.Provider>
  );
}

// Context 사용을 위한 Hook
export function useChecklist() {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error('useChecklist는 ChecklistProvider 내에서 사용되어야 합니다');
  }
  return context;
} 