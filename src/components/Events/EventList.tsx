import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Filter, 
  Plus, 
  ChevronRight,
  CheckCircle,
  UserPlus,
  UserMinus,
  Star,
  Trophy,
  Heart
} from 'lucide-react';
import { useEventStore } from '../../store/eventStore';
import { useAuthStore } from '../../store/authStore';
import { EVENT_CATEGORIES } from '../../types';

const EventList: React.FC = () => {
  const { events, registerForEvent, unregisterFromEvent } = useEventStore();
  const { user } = useAuthStore();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    sortBy: 'date'
  });

  const currentDate = new Date();
  
  const filteredEvents = events.filter(event => {
    if (filters.category !== 'all' && event.category !== filters.category) return false;
    if (filters.status === 'upcoming' && event.date <= currentDate) return false;
    if (filters.status === 'past' && event.date > currentDate) return false;
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'popular':
        return b.registeredVolunteers - a.registeredVolunteers;
      case 'spots':
        return (b.volunteerSlots - b.registeredVolunteers) - (a.volunteerSlots - a.registeredVolunteers);
      default:
        return 0;
    }
  });

  const upcomingEvents = filteredEvents.filter(event => event.date > currentDate);
  const pastEvents = filteredEvents.filter(event => event.date <= currentDate);

  const handleEventRegistration = (eventId: string, isRegistered: boolean) => {
    if (!user) return;
    
    if (isRegistered) {
      unregisterFromEvent(eventId, user.id);
    } else {
      registerForEvent(eventId, user.id);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Clean-up Drive': return '🧹';
      case 'Tree Plantation': return '🌱';
      case 'Marathon': return '🏃';
      case 'Awareness Campaign': return '📢';
      case 'Workshop': return '🎓';
      default: return '📅';
    }
  };

  const getStatusColor = (event: any) => {
    const spotsLeft = event.volunteerSlots - event.registeredVolunteers;
    if (spotsLeft === 0) return 'text-red-600 bg-red-50';
    if (spotsLeft <= 10) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-IN', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isEventTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const getDateLabel = (date: Date) => {
    if (isEventToday(date)) return 'Today';
    if (isEventTomorrow(date)) return 'Tomorrow';
    return formatDate(date);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Events</h1>
            <p className="text-gray-600">
              Join events and volunteer opportunities to make Bhopal better
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
            <Link
              to="/create-event"
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-green-600">{upcomingEvents.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Events</p>
                <p className="text-2xl font-bold text-purple-600">
                  {events.filter(e => e.isRegistered).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-bold text-orange-600">
                  {events.reduce((sum, event) => sum + event.registeredVolunteers, 0)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {EVENT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past Events</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date</option>
                  <option value="popular">Most Popular</option>
                  <option value="spots">Available Spots</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Featured Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-2xl">{getCategoryIcon(event.category)}</span>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
                    <p className="text-blue-100 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center space-x-4 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{getDateLabel(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {event.registeredVolunteers}/{event.volunteerSlots} volunteers
                        </span>
                      </div>
                      <button
                        onClick={() => handleEventRegistration(event.id, event.isRegistered || false)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          event.isRegistered
                            ? 'bg-white/20 hover:bg-white/30'
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {event.isRegistered ? 'Registered' : 'Register'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-8">
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getCategoryIcon(event.category)}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                              {event.title}
                            </h3>
                            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {event.category}
                            </span>
                          </div>
                        </div>
                        {event.isRegistered && (
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">Registered</span>
                          </div>
                        )}
                      </div>

                      {/* Event Details */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{getDateLabel(event.date)}</span>
                          {(isEventToday(event.date) || isEventTomorrow(event.date)) && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                              {isEventToday(event.date) ? 'Today!' : 'Tomorrow'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{event.location.address}</span>
                        </div>
                      </div>

                      {/* Volunteer Info */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Volunteers</span>
                          <span className={`font-medium px-2 py-1 rounded-full text-xs ${getStatusColor(event)}`}>
                            {event.volunteerSlots - event.registeredVolunteers} spots left
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${(event.registeredVolunteers / event.volunteerSlots) * 100}%`
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                          <span>{event.registeredVolunteers} registered</span>
                          <span>{event.volunteerSlots} total</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          by {event.organizer}
                        </span>
                        <button
                          onClick={() => handleEventRegistration(event.id, event.isRegistered || false)}
                          disabled={!event.isRegistered && event.registeredVolunteers >= event.volunteerSlots}
                          className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                            event.isRegistered
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : event.registeredVolunteers >= event.volunteerSlots
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {event.isRegistered ? (
                            <>
                              <UserMinus className="w-4 h-4" />
                              <span>Unregister</span>
                            </>
                          ) : event.registeredVolunteers >= event.volunteerSlots ? (
                            <>
                              <Users className="w-4 h-4" />
                              <span>Full</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              <span>Register</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Events</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pastEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden opacity-75">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl grayscale">{getCategoryIcon(event.category)}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                              {event.title}
                            </h3>
                            <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              Completed
                            </span>
                          </div>
                        </div>
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{event.registeredVolunteers} volunteers participated</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          by {event.organizer}
                        </span>
                        <div className="flex items-center space-x-1 text-green-600">
                          <Heart className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">Thank you!</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new events.
            </p>
            <Link
              to="/create-event"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Event</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;