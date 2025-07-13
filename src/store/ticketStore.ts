import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  reportedBy: string;
  reporterName: string;
  responses: Array<{
    id: string;
    message: string;
    author: string;
    authorName: string;
    isAdmin: boolean;
    createdAt: Date;
  }>;
}

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  addResponse: (ticketId: string, response: Omit<Ticket['responses'][0], 'id' | 'createdAt'>) => void;
  closeTicket: (id: string) => void;
  getUserTickets: (userId: string) => Ticket[];
}

// Mock tickets data
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Unable to update profile information',
    description: 'I am trying to update my address but the form is not saving the changes.',
    category: 'Technical Support',
    status: 'in_progress',
    priority: 'medium',
    createdAt: new Date('2024-12-18T10:30:00'),
    updatedAt: new Date('2024-12-19T14:20:00'),
    reportedBy: '1',
    reporterName: 'Rahul Sharma',
    responses: [
      {
        id: '1',
        message: 'Thank you for reporting this issue. Our technical team is looking into it.',
        author: 'admin1',
        authorName: 'Support Team',
        isAdmin: true,
        createdAt: new Date('2024-12-18T15:45:00')
      },
      {
        id: '2',
        message: 'We have identified the issue and are working on a fix. Expected resolution by tomorrow.',
        author: 'admin1',
        authorName: 'Support Team',
        isAdmin: true,
        createdAt: new Date('2024-12-19T14:20:00')
      }
    ]
  },
  {
    id: '2',
    title: 'Request for new garbage collection point',
    description: 'Our area needs an additional garbage collection point as the current one is too far.',
    category: 'Suggestion',
    status: 'open',
    priority: 'low',
    createdAt: new Date('2024-12-17T09:15:00'),
    updatedAt: new Date('2024-12-17T09:15:00'),
    reportedBy: '1',
    reporterName: 'Rahul Sharma',
    responses: []
  },
  {
    id: '3',
    title: 'Incorrect issue status update',
    description: 'My reported pothole issue was marked as resolved but it is still not fixed.',
    category: 'Complaint',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2024-12-15T16:20:00'),
    updatedAt: new Date('2024-12-20T11:30:00'),
    reportedBy: '2',
    reporterName: 'Neha Gupta',
    responses: [
      {
        id: '3',
        message: 'We apologize for the confusion. We have re-opened the issue and dispatched a team to fix it.',
        author: 'admin2',
        authorName: 'City Official',
        isAdmin: true,
        createdAt: new Date('2024-12-20T11:30:00')
      }
    ]
  }
];

export const useTicketStore = create<TicketState>()(
  persist(
    (set, get) => ({
      tickets: mockTickets,
      loading: false,
      addTicket: (ticketData) => {
        const newTicket: Ticket = {
          ...ticketData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          tickets: [newTicket, ...state.tickets]
        }));
      },
      updateTicket: (id, updates) => {
        set((state) => ({
          tickets: state.tickets.map(ticket =>
            ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date() } : ticket
          )
        }));
      },
      addResponse: (ticketId, responseData) => {
        const newResponse = {
          ...responseData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date()
        };
        
        set((state) => ({
          tickets: state.tickets.map(ticket =>
            ticket.id === ticketId
              ? { ...ticket, responses: [...ticket.responses, newResponse], updatedAt: new Date() }
              : ticket
          )
        }));
      },
      closeTicket: (id) => {
        set((state) => ({
          tickets: state.tickets.map(ticket =>
            ticket.id === id 
              ? { ...ticket, status: 'resolved' as const, updatedAt: new Date() }
              : ticket
          )
        }));
      },
      getUserTickets: (userId) => {
        const state = get();
        return state.tickets.filter(ticket => ticket.reportedBy === userId);
      }
    }),
    {
      name: 'ticket-storage',
      partialize: (state) => ({ tickets: state.tickets }),
    }
  )
);