import { create } from 'zustand';
import { Issue } from '../types';

interface IssueState {
  issues: Issue[];
  loading: boolean;
  filters: {
    category: string;
    status: string;
    severity: string;
    sortBy: 'newest' | 'oldest' | 'upvotes';
  };
  setFilters: (filters: Partial<IssueState['filters']>) => void;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  voteIssue: (id: string, voteType: 'up' | 'down') => void;
  addComment: (issueId: string, text: string) => void;
  setIssues: (issues: Issue[]) => void;
}

// Mock issues data for Bhopal
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Garbage not collected in Arera Colony',
    description: 'Waste has been accumulating for 3 days near the main gate. Creating health hazards.',
    category: 'Garbage',
    severity: 'high',
    status: 'open',
    location: { lat: 23.2599, lng: 77.4126, address: 'Arera Colony, Bhopal' },
    media: [],
    upvotes: 15,
    downvotes: 1,
    comments: [
      { id: '1', text: 'Same issue in our sector too!', author: '2', authorName: 'Priya Singh', createdAt: new Date('2024-12-20T10:30:00') }
    ],
    reportedBy: '1',
    reporterName: 'Rahul Sharma',
    isAnonymous: false,
    createdAt: new Date('2024-12-19T14:30:00'),
    updatedAt: new Date('2024-12-19T14:30:00')
  },
  {
    id: '2',
    title: 'Tree fallen on road near Habibganj',
    description: 'Large tree has fallen blocking the main road. Urgent action required.',
    category: 'Fallen Trees',
    severity: 'high',
    status: 'in_progress',
    location: { lat: 23.2295, lng: 77.4384, address: 'Habibganj, Bhopal' },
    media: [],
    upvotes: 12,
    downvotes: 0,
    comments: [],
    reportedBy: '2',
    reporterName: 'Neha Gupta',
    isAnonymous: false,
    createdAt: new Date('2024-12-18T09:15:00'),
    updatedAt: new Date('2024-12-19T11:00:00')
  },
  {
    id: '3',
    title: 'Waterlogging near New Market',
    description: 'Heavy waterlogging after recent rains. Drainage system completely blocked.',
    category: 'Waterlogging',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.2584, lng: 77.4017, address: 'New Market, Bhopal' },
    upvotes: 9,
    downvotes: 0,
    comments: [],
    reportedBy: '3',
    reporterName: 'Amit Patel',
    isAnonymous: false,
    createdAt: new Date('2024-12-17T16:45:00'),
    updatedAt: new Date('2024-12-17T16:45:00')
  },
  {
    id: '4',
    title: 'Streetlight not working in Kolar',
    description: 'Multiple streetlights are not working creating safety issues at night.',
    category: 'Streetlight',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.1793, lng: 77.4910, address: 'Kolar, Bhopal' },
    upvotes: 8,
    downvotes: 0,
    comments: [],
    reportedBy: '4',
    reporterName: 'Sunita Sharma',
    isAnonymous: false,
    createdAt: new Date('2024-12-16T20:00:00'),
    updatedAt: new Date('2024-12-16T20:00:00')
  },
  {
    id: '5',
    title: 'Pothole on Link Road',
    description: 'Deep pothole causing vehicle damage. Multiple accidents reported.',
    category: 'Potholes',
    severity: 'high',
    status: 'open',
    location: { lat: 23.2394, lng: 77.4149, address: 'Link Road, Bhopal' },
    upvotes: 18,
    downvotes: 0,
    comments: [],
    reportedBy: '5',
    reporterName: 'Rajesh Kumar',
    isAnonymous: false,
    createdAt: new Date('2024-12-15T12:30:00'),
    updatedAt: new Date('2024-12-15T12:30:00')
  },
  {
    id: '6',
    title: 'Water supply disruption in Shahpura',
    description: 'No water supply for the last 48 hours. Residents facing severe issues.',
    category: 'Water Supply',
    severity: 'high',
    status: 'in_progress',
    location: { lat: 23.2156, lng: 77.4304, address: 'Shahpura, Bhopal' },
    upvotes: 14,
    downvotes: 0,
    comments: [],
    reportedBy: '6',
    reporterName: 'Kavita Jain',
    isAnonymous: false,
    createdAt: new Date('2024-12-14T08:00:00'),
    updatedAt: new Date('2024-12-16T10:00:00')
  },
  {
    id: '7',
    title: 'Stray dogs in Berasia Road',
    description: 'Aggressive stray dogs creating safety concerns for children and elderly.',
    category: 'Stray Animals',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.2885, lng: 77.4405, address: 'Berasia Road, Bhopal' },
    upvotes: 11,
    downvotes: 2,
    comments: [],
    reportedBy: '7',
    reporterName: 'Mohan Verma',
    isAnonymous: false,
    createdAt: new Date('2024-12-13T17:20:00'),
    updatedAt: new Date('2024-12-13T17:20:00')
  },
  {
    id: '8',
    title: 'Drainage overflow in Govindpura',
    description: 'Sewage overflow on main road. Immediate action required for health safety.',
    category: 'Drainage',
    severity: 'high',
    status: 'open',
    location: { lat: 23.2467, lng: 77.4449, address: 'Govindpura, Bhopal' },
    upvotes: 16,
    downvotes: 0,
    comments: [],
    reportedBy: '8',
    reporterName: 'Seema Rao',
    isAnonymous: false,
    createdAt: new Date('2024-12-12T11:45:00'),
    updatedAt: new Date('2024-12-12T11:45:00')
  },
  {
    id: '9',
    title: 'Illegal parking near Railway Station',
    description: 'Vendors and vehicles blocking pedestrian walkways and emergency routes.',
    category: 'Illegal Parking',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.2684, lng: 77.4081, address: 'Railway Station, Bhopal' },
    upvotes: 7,
    downvotes: 3,
    comments: [],
    reportedBy: '9',
    reporterName: 'Vikas Tiwari',
    isAnonymous: false,
    createdAt: new Date('2024-12-11T15:10:00'),
    updatedAt: new Date('2024-12-11T15:10:00')
  },
  {
    id: '10',
    title: 'Public toilet maintenance required',
    description: 'Public toilet near Upper Lake is in poor condition and needs immediate cleaning.',
    category: 'Public Toilets',
    severity: 'medium',
    status: 'resolved',
    location: { lat: 23.2494, lng: 77.3910, address: 'Upper Lake, Bhopal' },
    upvotes: 6,
    downvotes: 0,
    comments: [],
    reportedBy: '10',
    reporterName: 'Rekha Agarwal',
    isAnonymous: false,
    createdAt: new Date('2024-12-10T09:30:00'),
    updatedAt: new Date('2024-12-18T14:00:00'),
    resolvedAt: new Date('2024-12-18T14:00:00')
  },
  {
    id: '11',
    title: 'Traffic signal malfunction at MP Nagar',
    description: 'Traffic signal not working properly causing heavy traffic congestion.',
    category: 'Traffic Signal',
    severity: 'high',
    status: 'open',
    location: { lat: 23.2323, lng: 77.4126, address: 'MP Nagar, Bhopal' },
    upvotes: 13,
    downvotes: 0,
    comments: [],
    reportedBy: '11',
    reporterName: 'Ankit Sharma',
    isAnonymous: false,
    createdAt: new Date('2024-12-09T07:45:00'),
    updatedAt: new Date('2024-12-09T07:45:00')
  },
  {
    id: '12',
    title: 'Construction debris on Hoshangabad Road',
    description: 'Construction materials scattered on road creating traffic hazards.',
    category: 'Construction Issues',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.1765, lng: 77.4434, address: 'Hoshangabad Road, Bhopal' },
    upvotes: 5,
    downvotes: 1,
    comments: [],
    reportedBy: '12',
    reporterName: 'Deepak Gupta',
    isAnonymous: false,
    createdAt: new Date('2024-12-08T13:20:00'),
    updatedAt: new Date('2024-12-08T13:20:00')
  },
  {
    id: '13',
    title: 'Graffiti on public walls in TT Nagar',
    description: 'Inappropriate graffiti on public walls affecting city aesthetics.',
    category: 'Graffiti',
    severity: 'low',
    status: 'open',
    location: { lat: 23.2334, lng: 77.4063, address: 'TT Nagar, Bhopal' },
    upvotes: 4,
    downvotes: 0,
    comments: [],
    reportedBy: '13',
    reporterName: 'Pooja Malhotra',
    isAnonymous: false,
    createdAt: new Date('2024-12-07T16:00:00'),
    updatedAt: new Date('2024-12-07T16:00:00')
  },
  {
    id: '14',
    title: 'Broken sidewalk in Bairagarh',
    description: 'Damaged sidewalk creating difficulty for pedestrians and wheelchair users.',
    category: 'Broken Sidewalks',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.2617, lng: 77.3564, address: 'Bairagarh, Bhopal' },
    upvotes: 8,
    downvotes: 0,
    comments: [],
    reportedBy: '14',
    reporterName: 'Suresh Joshi',
    isAnonymous: false,
    createdAt: new Date('2024-12-06T10:15:00'),
    updatedAt: new Date('2024-12-06T10:15:00')
  },
  {
    id: '15',
    title: 'Noise pollution from construction',
    description: 'Excessive noise from construction site violating permitted hours.',
    category: 'Noise Pollution',
    severity: 'medium',
    status: 'in_progress',
    location: { lat: 23.2223, lng: 77.4267, address: 'Indrapuri, Bhopal' },
    upvotes: 9,
    downvotes: 1,
    comments: [],
    reportedBy: '15',
    reporterName: 'Lakshmi Iyer',
    isAnonymous: false,
    createdAt: new Date('2024-12-05T18:30:00'),
    updatedAt: new Date('2024-12-07T09:00:00')
  },
  {
    id: '16',
    title: 'Park maintenance needed in Shyamla Hills',
    description: 'Park equipment damaged and overgrown vegetation needs attention.',
    category: 'Park Maintenance',
    severity: 'low',
    status: 'open',
    location: { lat: 23.2387, lng: 77.4289, address: 'Shyamla Hills, Bhopal' },
    upvotes: 6,
    downvotes: 0,
    comments: [],
    reportedBy: '16',
    reporterName: 'Ravi Chouhan',
    isAnonymous: false,
    createdAt: new Date('2024-12-04T12:00:00'),
    updatedAt: new Date('2024-12-04T12:00:00')
  },
  {
    id: '17',
    title: 'Encroachment on footpath in Chowk Bazaar',
    description: 'Vendors encroaching on footpath making it difficult for pedestrians.',
    category: 'Encroachment',
    severity: 'medium',
    status: 'open',
    location: { lat: 23.2598, lng: 77.4105, address: 'Chowk Bazaar, Bhopal' },
    upvotes: 10,
    downvotes: 2,
    comments: [],
    reportedBy: '17',
    reporterName: 'Madhuri Sinha',
    isAnonymous: false,
    createdAt: new Date('2024-12-03T14:45:00'),
    updatedAt: new Date('2024-12-03T14:45:00')
  },
  {
    id: '18',
    title: 'Power cut in Ayodhya Nagar',
    description: 'Frequent power cuts affecting daily life and business operations.',
    category: 'Powercut',
    severity: 'high',
    status: 'open',
    location: { lat: 23.2156, lng: 77.4789, address: 'Ayodhya Nagar, Bhopal' },
    upvotes: 12,
    downvotes: 0,
    comments: [],
    reportedBy: '18',
    reporterName: 'Ashok Pandey',
    isAnonymous: false,
    createdAt: new Date('2024-12-02T19:20:00'),
    updatedAt: new Date('2024-12-02T19:20:00')
  },
  {
    id: '19',
    title: 'Air pollution from industrial area',
    description: 'Heavy smoke emission from factories affecting air quality in nearby residential areas.',
    category: 'Air Pollution',
    severity: 'high',
    status: 'open',
    location: { lat: 23.1875, lng: 77.4523, address: 'Mandideep, Bhopal' },
    upvotes: 17,
    downvotes: 0,
    comments: [],
    reportedBy: '19',
    reporterName: 'Dr. Shweta Mishra',
    isAnonymous: false,
    createdAt: new Date('2024-12-01T08:30:00'),
    updatedAt: new Date('2024-12-01T08:30:00')
  },
  {
    id: '20',
    title: 'Road blockage due to fallen electric pole',
    description: 'Electric pole fallen during storm blocking the entire road.',
    category: 'Road Blockage',
    severity: 'high',
    status: 'resolved',
    location: { lat: 23.2045, lng: 77.4378, address: 'Gulmohar Colony, Bhopal' },
    upvotes: 11,
    downvotes: 0,
    comments: [],
    reportedBy: '20',
    reporterName: 'Manoj Singh',
    isAnonymous: false,
    createdAt: new Date('2024-11-30T06:15:00'),
    updatedAt: new Date('2024-12-01T15:30:00'),
    resolvedAt: new Date('2024-12-01T15:30:00')
  }
];

export const useIssueStore = create<IssueState>((set, get) => ({
  issues: mockIssues,
  loading: false,
  filters: {
    category: 'all',
    status: 'all',
    severity: 'all',
    sortBy: 'newest'
  },
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },
  addIssue: (issueData) => {
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      upvotes: 0,
      downvotes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set((state) => ({
      issues: [newIssue, ...state.issues]
    }));
  },
  updateIssue: (id, updates) => {
    set((state) => ({
      issues: state.issues.map(issue =>
        issue.id === id ? { ...issue, ...updates, updatedAt: new Date() } : issue
      )
    }));
  },
  voteIssue: (id, voteType) => {
    set((state) => ({
      issues: state.issues.map(issue => {
        if (issue.id === id) {
          const currentVote = issue.userVote;
          let upvotes = issue.upvotes;
          let downvotes = issue.downvotes;
          let userVote: 'up' | 'down' | undefined = voteType;
          
          // Remove previous vote if exists
          if (currentVote === 'up') upvotes--;
          if (currentVote === 'down') downvotes--;
          
          // Add new vote or remove if same
          if (currentVote === voteType) {
            userVote = undefined;
          } else {
            if (voteType === 'up') upvotes++;
            if (voteType === 'down') downvotes++;
          }
          
          return { ...issue, upvotes, downvotes, userVote };
        }
        return issue;
      })
    }));
  },
  addComment: (issueId, text) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text,
      author: '1', // Current user
      authorName: 'Rahul Sharma',
      createdAt: new Date()
    };
    
    set((state) => ({
      issues: state.issues.map(issue =>
        issue.id === issueId
          ? { ...issue, comments: [...issue.comments, newComment] }
          : issue
      )
    }));
  },
  setIssues: (issues) => {
    set({ issues });
  }
}));