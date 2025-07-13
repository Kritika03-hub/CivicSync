import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, MessageCircle, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, X, Eye } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useIssueStore } from '../../store/issueStore';
import { useEventStore } from '../../store/eventStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { issues } = useIssueStore();
  const { events } = useEventStore();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const recentIssues = issues.slice(0, 5);
  const upcomingEvents = events.filter(event => event.date > new Date()).slice(0, 3);

  const issueStats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    inProgress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length
  };

  const topIssues = [...issues]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  const getDetailedStats = (type: string) => {
    switch (type) {
      case 'total':
        return {
          title: 'Total Issues',
          count: issueStats.total,
          items: issues.slice(0, 10),
          color: 'blue'
        };
      case 'open':
        return {
          title: 'Open Issues',
          count: issueStats.open,
          items: issues.filter(i => i.status === 'open').slice(0, 10),
          color: 'red'
        };
      case 'inProgress':
        return {
          title: 'In Progress Issues',
          count: issueStats.inProgress,
          items: issues.filter(i => i.status === 'in_progress').slice(0, 10),
          color: 'yellow'
        };
      case 'resolved':
        return {
          title: 'Resolved Issues',
          count: issueStats.resolved,
          items: issues.filter(i => i.status === 'resolved').slice(0, 10),
          color: 'green'
        };
      default:
        return null;
    }
  };

  const DetailModal = ({ type, onClose }: { type: string; onClose: () => void }) => {
    const stats = getDetailedStats(type);
    if (!stats) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{stats.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="mb-6">
              <div className={`text-4xl font-bold mb-2 ${
                stats.color === 'blue' ? 'text-blue-600' :
                stats.color === 'red' ? 'text-red-600' :
                stats.color === 'yellow' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {stats.count}
              </div>
              <p className="text-gray-600">Total {stats.title.toLowerCase()}</p>
            </div>

            <div className="space-y-4">
              {stats.items.map((issue) => (
                <div key={issue.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      issue.status === 'open' ? 'bg-red-100 text-red-800' :
                      issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">📍 {issue.location.address}</span>
                      <span className="text-gray-500">👍 {issue.upvotes}</span>
                    </div>
                    <span className="text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {stats.items.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No issues found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your community today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setExpandedCard('total')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{issueStats.total}</p>
                <div className="flex items-center mt-2">
                  <Eye className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-600">Click to expand</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setExpandedCard('open')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Issues</p>
                <p className="text-2xl font-bold text-orange-600">{issueStats.open}</p>
                <div className="flex items-center mt-2">
                  <Eye className="w-4 h-4 text-orange-600 mr-1" />
                  <span className="text-xs text-orange-600">Click to expand</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setExpandedCard('inProgress')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{issueStats.inProgress}</p>
                <div className="flex items-center mt-2">
                  <Eye className="w-4 h-4 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-600">Click to expand</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setExpandedCard('resolved')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{issueStats.resolved}</p>
                <div className="flex items-center mt-2">
                  <Eye className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">Click to expand</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Issues */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Issues</h2>
                <Link 
                  to="/issues" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{issue.location.address}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        issue.status === 'open' ? 'bg-red-100 text-red-800' :
                        issue.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {issue.upvotes} upvotes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
                <Link 
                  to="/events" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.location.address}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {event.date.toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.registeredVolunteers}/{event.volunteerSlots} volunteers
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/report-issue"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Report Issue</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Join Events</span>
            </Link>
            <Link
              to="/community"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Community Chat</span>
            </Link>
            <Link
              to="/events"
              className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <Users className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-900">Volunteer</span>
            </Link>
          </div>
        </div>

        {/* Top Issues */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Top Voted Issues</h2>
          </div>
          <div className="p-6 space-y-4">
            {topIssues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{issue.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{issue.location.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">{issue.upvotes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Modal */}
        {expandedCard && (
          <DetailModal 
            type={expandedCard} 
            onClose={() => setExpandedCard(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;