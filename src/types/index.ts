export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'admin' | 'resolver' | 'event_manager';
  avatar?: string;
  address?: string;
  bio?: string;
  badgeCount?: number;
  volunteerHours?: number;
  createdAt: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  media?: string[];
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down';
  comments: Comment[];
  reportedBy: string;
  reporterName: string;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  category: string;
  volunteerSlots: number;
  registeredVolunteers: number;
  attendees: string[];
  organizer: string;
  isRegistered?: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorName: string;
  createdAt: Date;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  attachments?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  reportedBy: string;
  assignedTo?: string;
  responses: TicketResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketResponse {
  id: string;
  message: string;
  author: string;
  authorName: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  author: string;
  authorName: string;
  room: string;
  timestamp: Date;
}

export const ISSUE_CATEGORIES = [
  'Potholes',
  'Garbage',
  'Powercut',
  'Water Supply',
  'Streetlight',
  'Drainage',
  'Stray Animals',
  'Waterlogging',
  'Noise Pollution',
  'Air Pollution',
  'Broken Sidewalks',
  'Graffiti',
  'Encroachment',
  'Traffic Signal',
  'Illegal Parking',
  'Public Toilets',
  'Park Maintenance',
  'Road Blockage',
  'Fallen Trees',
  'Construction Issues'
] as const;

export const EVENT_CATEGORIES = [
  'Clean-up Drive',
  'Tree Plantation',
  'Awareness Campaign',
  'Marathon',
  'Cultural Event',
  'Workshop',
  'Town Hall',
  'Volunteer Training'
] as const;

export const TICKET_CATEGORIES = [
  'General Inquiry',
  'Grievance',
  'Feedback',
  'Data Correction',
  'Technical Support',
  'Complaint',
  'Suggestion',
  'Other'
] as const;