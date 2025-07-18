import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  currentUser: null,
  campaigns: [
    {
      id: 1,
      title: 'Emergency Food Relief',
      description: 'Providing meals to families in need during crisis',
      goal: 50000,
      raised: 32500,
      donors: 245,
      endDate: '2025-08-15',
      status: 'active',
      category: 'emergency',
      createdAt: '2025-06-01',
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Clean Water Initiative',
      description: 'Building wells in rural communities',
      goal: 75000,
      raised: 45000,
      donors: 180,
      endDate: '2025-09-30',
      status: 'active',
      category: 'infrastructure',
      createdAt: '2025-06-15',
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Education for All',
      description: 'Scholarships for underprivileged children',
      goal: 100000,
      raised: 89000,
      donors: 320,
      endDate: '2025-07-31',
      status: 'active',
      category: 'education',
      createdAt: '2025-05-20',
      image: '/api/placeholder/400/250'
    }
  ],
  donations: [
    { id: 1, campaignId: 1, amount: 100, donor: 'John Doe', email: 'john@example.com', date: '2025-07-15', status: 'completed' },
    { id: 2, campaignId: 2, amount: 250, donor: 'Jane Smith', email: 'jane@example.com', date: '2025-07-14', status: 'completed' },
    { id: 3, campaignId: 1, amount: 50, donor: 'Mike Johnson', email: 'mike@example.com', date: '2025-07-13', status: 'completed' },
    { id: 4, campaignId: 3, amount: 500, donor: 'Sarah Wilson', email: 'sarah@example.com', date: '2025-07-12', status: 'completed' }
  ],
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ADD_CAMPAIGN':
      return { 
        ...state, 
        campaigns: [...state.campaigns, { ...action.payload, id: Date.now() }] 
      };
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.payload.id ? action.payload : campaign
        )
      };
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload)
      };
    case 'ADD_DONATION':
      return {
        ...state,
        donations: [...state.donations, { ...action.payload, id: Date.now() }]
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
