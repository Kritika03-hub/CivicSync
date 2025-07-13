import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Calendar, MessageCircle, CheckCircle, ArrowRight, Heart, Target, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: 'Report Issues',
      description: 'Easily report civic issues like potholes, garbage, power cuts, and more with location and photo evidence.'
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: 'Community Engagement',
      description: 'Connect with fellow citizens, upvote issues, and participate in making Bhopal a better place.'
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: 'Events & Volunteering',
      description: 'Join clean-up drives, tree plantation, marathons, and other community events happening in Bhopal.'
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-orange-600" />,
      title: 'Real-time Chat',
      description: 'Discuss local issues, coordinate with neighbors, and get updates from city officials.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
      title: 'Issue Tracking',
      description: 'Track the progress of your reported issues from submission to resolution with real-time updates.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'Secure & Transparent',
      description: 'All reports are handled securely with complete transparency in the resolution process.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Citizens' },
    { number: '5,000+', label: 'Issues Resolved' },
    { number: '250+', label: 'Events Organized' },
    { number: '80%', label: 'Resolution Rate' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl backdrop-blur-sm border border-white/30">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-7xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  CivicSync
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 font-medium">Syncing Citizens. Solving Cities.</p>
              </div>
            </div>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Empowering citizens to report civic issues, participate in community events, and collaborate with local officials for cleaner, safer, and better cities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center space-x-3"
              >
                <span>Get Started</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/80 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Making Real Impact
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of citizens creating positive change in their communities
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Making Civic Engagement Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CivicSync provides all the tools you need to actively participate in making Bhopal a better place to live, work, and thrive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How CivicSync Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to make a difference in your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl text-2xl font-bold mb-6 mx-auto shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Report Issues</h3>
              <p className="text-gray-600">
                Spot a problem in your neighborhood? Report it with photos and precise location details in seconds.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl text-2xl font-bold mb-6 mx-auto shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Action</h3>
              <p className="text-gray-600">
                Citizens upvote important issues, discuss solutions, and participate in community events.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl text-2xl font-bold mb-6 mx-auto shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600">
                Local officials address issues, provide real-time updates, and work with citizens to solve problems efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-red-400 mr-2" />
            <Target className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make Your City Better?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens who are already making a difference in their communities. Your voice matters, and together we can solve cities.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center space-x-3"
          >
            <span>Join CivicSync Today</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;