import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Hash, MessageCircle, Smile, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface Message {
  id: string;
  text: string;
  author: string;
  authorName: string;
  timestamp: Date;
  room: string;
}

const CommunityChat: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Good morning everyone! Any updates on the Kolar powercut issue?',
      author: '2',
      authorName: 'Neha Gupta',
      timestamp: new Date('2024-12-20T09:30:00'),
      room: 'general'
    },
    {
      id: '2',
      text: 'I heard they are working on it. Should be resolved by evening.',
      author: '3',
      authorName: 'Amit Patel',
      timestamp: new Date('2024-12-20T09:35:00'),
      room: 'general'
    },
    {
      id: '3',
      text: 'Joining the clean-up drive on Sunday! Who else is coming?',
      author: '4',
      authorName: 'Ravi Kumar',
      timestamp: new Date('2024-12-20T10:15:00'),
      room: 'general'
    },
    {
      id: '4',
      text: 'Count me in! What time does it start?',
      author: '5',
      authorName: 'Priya Singh',
      timestamp: new Date('2024-12-20T10:20:00'),
      room: 'general'
    },
    {
      id: '5',
      text: 'The pothole on Link Road has been fixed! Thanks to everyone who upvoted.',
      author: '6',
      authorName: 'Rajesh Kumar',
      timestamp: new Date('2024-12-20T11:00:00'),
      room: 'general'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [activeRoom, setActiveRoom] = useState('general');
  const [onlineUsers, setOnlineUsers] = useState(47);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = [
    { id: 'general', name: 'General Discussion', icon: Hash, count: 47 },
    { id: 'events', name: 'Events & Volunteering', icon: MessageCircle, count: 23 },
    { id: 'issues', name: 'Issue Updates', icon: MessageCircle, count: 31 },
    { id: 'announcements', name: 'Official Announcements', icon: MessageCircle, count: 12 }
  ];

  const liveMessages = [
    { text: "Just reported a streetlight issue near MP Nagar", author: "Kavita Sharma", room: "general" },
    { text: "The garbage collection in Arera Colony is much better now!", author: "Deepak Gupta", room: "general" },
    { text: "Anyone joining the tree plantation event tomorrow?", author: "Sunita Verma", room: "events" },
    { text: "Water supply restored in Shahpura area 💧", author: "Municipal Officer", room: "issues" },
    { text: "New community guidelines published. Please check announcements.", author: "Admin", room: "announcements" },
    { text: "The pothole on Hoshangabad Road needs urgent attention", author: "Manoj Singh", room: "general" },
    { text: "Great turnout at yesterday's clean-up drive! 🧹", author: "Event Coordinator", room: "events" },
    { text: "Traffic signal at MP Nagar is working again", author: "Traffic Control", room: "issues" },
    { text: "Monthly community meeting scheduled for next Friday", author: "Community Leader", room: "announcements" },
    { text: "Does anyone know about the construction work on Link Road?", author: "Priya Jain", room: "general" }
  ];

  const typingUsers = ["Rahul typing...", "Neha typing...", "Amit typing...", "Priya typing..."];

  // Simulate live messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 3 seconds
        const randomMessage = liveMessages[Math.floor(Math.random() * liveMessages.length)];
        const newLiveMessage: Message = {
          id: Date.now().toString() + Math.random(),
          text: randomMessage.text,
          author: Math.random().toString(),
          authorName: randomMessage.author,
          timestamp: new Date(),
          room: randomMessage.room
        };
        setMessages(prev => [...prev, newLiveMessage]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance
        const randomUser = typingUsers[Math.floor(Math.random() * typingUsers.length)];
        setIsTyping(prev => [...prev, randomUser]);
        
        setTimeout(() => {
          setIsTyping(prev => prev.filter(u => u !== randomUser));
        }, 2000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Simulate online user count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      author: user.id,
      authorName: user.name,
      timestamp: new Date(),
      room: activeRoom
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const filteredMessages = messages.filter(msg => msg.room === activeRoom);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isRecent = (date: Date) => {
    const now = new Date();
    return (now.getTime() - date.getTime()) < 60000; // Less than 1 minute
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex h-[700px]">
            {/* Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Community Chat</h2>
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                      {onlineUsers} online
                    </p>
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Channels</h3>
                  <div className="space-y-1">
                    {rooms.map((room) => {
                      const roomMessages = messages.filter(m => m.room === room.id);
                      const hasNewMessages = roomMessages.some(m => isRecent(m.timestamp));
                      
                      return (
                        <button
                          key={room.id}
                          onClick={() => setActiveRoom(room.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors relative ${
                            activeRoom === room.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <room.icon className="w-4 h-4" />
                            <span className="text-sm font-medium">{room.name}</span>
                            {hasNewMessages && activeRoom !== room.id && (
                              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                            {room.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Online Users */}
                <div className="p-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Online Users ({onlineUsers})
                  </h3>
                  <div className="space-y-2">
                    {['Neha Gupta', 'Amit Patel', 'Ravi Kumar', 'Priya Singh'].map((name, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">{name}</span>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-2">
                      +{onlineUsers - 4} more users
                    </div>
                  </div>
                </div>
              </div>

              {/* Create Channel Button */}
              <div className="p-4 border-t border-gray-200">
                <button 
                  onClick={() => {
                    const channelName = prompt('Enter channel name:');
                    if (channelName) {
                      alert(`Channel "${channelName}" will be created soon!`);
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Channel</span>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      {rooms.find(r => r.id === activeRoom)?.name}
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
                    </h3>
                    <p className="text-sm text-gray-600">
                      {filteredMessages.length} messages • Live chat
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {rooms.find(r => r.id === activeRoom)?.count} members
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.map((message) => (
                  <div key={message.id} className={`flex space-x-3 ${isRecent(message.timestamp) ? 'animate-fadeIn' : ''}`}>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center relative">
                        <span className="text-white text-sm font-medium">
                          {message.authorName.charAt(0)}
                        </span>
                        {isRecent(message.timestamp) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.authorName}</span>
                        <span className="text-xs text-gray-500">
                          {isToday(message.timestamp) 
                            ? formatTime(message.timestamp)
                            : message.timestamp.toLocaleDateString()
                          }
                        </span>
                        {isRecent(message.timestamp) && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{message.text}</p>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicators */}
                {isTyping.length > 0 && (
                  <div className="flex space-x-3 opacity-70">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">...</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-500 italic text-sm">
                        {isTyping.join(', ')}
                      </p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${rooms.find(r => r.id === activeRoom)?.name}`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CommunityChat;