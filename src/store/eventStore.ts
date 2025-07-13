import { create } from 'zustand';
import { Event } from '../types';

interface EventState {
  events: Event[];
  loading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  registerForEvent: (eventId: string, userId: string) => void;
  unregisterFromEvent: (eventId: string, userId: string) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
}

// Mock events data for Bhopal
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Upper Lake Clean-Up Drive',
    description: 'Join us for a community clean-up drive at Upper Lake. Let\'s make Bhopal cleaner together!',
    date: new Date('2025-07-12T06:00:00'),
    time: '6:00 AM - 9:00 AM',
    location: { lat: 23.2494, lng: 77.3910, address: 'Upper Lake, Bhopal' },
    category: 'Clean-up Drive',
    volunteerSlots: 100,
    registeredVolunteers: 67,
    attendees: ['1', '2', '3'],
    organizer: 'Bhopal Municipal Corporation',
    isRegistered: true,
    createdAt: new Date('2024-12-01T10:00:00')
  },
  {
    id: '2',
    title: 'Van Vihar Tree Plantation',
    description: 'Plant trees at Van Vihar National Park to increase green cover in our city.',
    date: new Date('2025-07-19T07:00:00'),
    time: '7:00 AM - 10:00 AM',
    location: { lat: 23.2298, lng: 77.4130, address: 'Van Vihar National Park, Bhopal' },
    category: 'Tree Plantation',
    volunteerSlots: 150,
    registeredVolunteers: 89,
    attendees: ['1', '4', '5'],
    organizer: 'Forest Department',
    isRegistered: true,
    createdAt: new Date('2024-12-02T10:00:00')
  },
  {
    id: '3',
    title: 'Bhopal Marathon 2025',
    description: 'Annual marathon starting from Boat Club Road. Categories: 5K, 10K, and 21K.',
    date: new Date('2025-07-26T05:30:00'),
    time: '5:30 AM - 12:00 PM',
    location: { lat: 23.2456, lng: 77.4045, address: 'Boat Club Road, Bhopal' },
    category: 'Marathon',
    volunteerSlots: 200,
    registeredVolunteers: 156,
    attendees: ['2', '6', '7'],
    organizer: 'Bhopal Sports Council',
    isRegistered: false,
    createdAt: new Date('2024-12-03T10:00:00')
  },
  {
    id: '4',
    title: 'Swachh Bharat Awareness Campaign',
    description: 'Awareness campaign about cleanliness and hygiene in residential areas.',
    date: new Date('2025-07-14T16:00:00'),
    time: '4:00 PM - 7:00 PM',
    location: { lat: 23.2599, lng: 77.4126, address: 'Arera Colony, Bhopal' },
    category: 'Awareness Campaign',
    volunteerSlots: 50,
    registeredVolunteers: 32,
    attendees: ['3', '8', '9'],
    organizer: 'NGO Green Bhopal',
    isRegistered: false,
    createdAt: new Date('2024-12-04T10:00:00')
  },
  {
    id: '5',
    title: 'Digital Literacy Workshop',
    description: 'Free workshop on digital skills for senior citizens and women.',
    date: new Date('2025-07-21T10:00:00'),
    time: '10:00 AM - 1:00 PM',
    location: { lat: 23.2323, lng: 77.4126, address: 'MP Nagar Community Center, Bhopal' },
    category: 'Workshop',
    volunteerSlots: 30,
    registeredVolunteers: 18,
    attendees: ['4', '10'],
    organizer: 'Digital India Initiative',
    isRegistered: false,
    createdAt: new Date('2024-12-05T10:00:00')
  },
  {
    id: '6',
    title: 'Monsoon Preparation Drive',
    description: 'Community preparation for monsoon season - drain cleaning and awareness.',
    date: new Date('2025-07-28T08:00:00'),
    time: '8:00 AM - 11:00 AM',
    location: { lat: 23.2156, lng: 77.4304, address: 'Shahpura, Bhopal' },
    category: 'Clean-up Drive',
    volunteerSlots: 80,
    registeredVolunteers: 42,
    attendees: ['5', '11'],
    organizer: 'Disaster Management Cell',
    isRegistered: false,
    createdAt: new Date('2024-12-06T10:00:00')
  }
];

export const useEventStore = create<EventState>((set, get) => ({
  events: mockEvents,
  loading: false,
  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    set((state) => ({
      events: [newEvent, ...state.events]
    }));
  },
  registerForEvent: (eventId, userId) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId
          ? {
              ...event,
              attendees: [...event.attendees, userId],
              registeredVolunteers: event.registeredVolunteers + 1,
              isRegistered: true
            }
          : event
      )
    }));
  },
  unregisterFromEvent: (eventId, userId) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === eventId
          ? {
              ...event,
              attendees: event.attendees.filter(id => id !== userId),
              registeredVolunteers: Math.max(0, event.registeredVolunteers - 1),
              isRegistered: false
            }
          : event
      )
    }));
  },
  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    }));
  }
}));