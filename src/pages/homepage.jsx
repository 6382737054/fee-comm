import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileCheck, School, ArrowUpRight, ArrowDownRight, Globe, BookOpen } from 'lucide-react';

const HomePage = () => {
  // Hardcoded data for the chart
  const chartData = [
    { month: 'Jan', applications: 6511 },
    { month: 'Feb', applications: 855 },
    { month: 'Mar', applications: 573 },
    { month: 'Apr', applications: 8844 },
    { month: 'May', applications:88 },
    { month: 'Jun', applications: 1150 }
  ];

  // Hardcoded data for recent applications
  const recentApplications = [
    {
      id: 1,
      college: "St. Joseph's Engineering College",
      type: "Engineering",
      status: "Pending",
      date: "2025-01-08"
    },
    {
      id: 2,
      college: "Chennai Medical Institute",
      type: "Medical",
      status: "Approved",
      date: "2025-01-07"
    },
    {
      id: 3,
      college: "Tamil Nadu Business School",
      type: "Management",
      status: "Under Review",
      date: "2025-01-06"
    },
    {
      id: 4,
      college: "Chennai Arts College",
      type: "Arts",
      status: "Approved",
      date: "2025-01-05"
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to TN Fee Committee Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and manage fee regulations across educational institutions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Applications Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <div className="flex items-center mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mr-2">2,547</h3>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  12.5%
                </span>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Total Institutions Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Registered Institutions</p>
              <div className="flex items-center mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mr-2">1,234</h3>
                <span className="flex items-center text-sm font-medium text-green-600">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  8.2%
                </span>
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <School className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Active Reviews Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Reviews</p>
              <div className="flex items-center mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mr-2">328</h3>
                <span className="flex items-center text-sm font-medium text-red-600">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  3.1%
                </span>
              </div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Application Trends</h2>
            <p className="text-sm text-gray-600">Monthly application submissions</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  dot={{ fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applications List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          </div>
          <div className="space-y-4">
            {recentApplications.map((application) => (
              <div key={application.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div className="bg-blue-50 p-2 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {application.college}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 mr-2">{application.type}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {application.status}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{application.date}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full px-4 py-2 bg-gray-50 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-150">
            View All Applications
          </button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-150">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileCheck className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-blue-900">New Application</span>
          </div>
        </button>
        
        <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-150">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <School className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-medium text-purple-900">Register Institution</span>
          </div>
        </button>
        
        <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors duration-150">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <span className="font-medium text-orange-900">Review Applications</span>
          </div>
        </button>
        
        <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-150">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-green-900">Generate Reports</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;