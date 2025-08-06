import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon, 
  CloudArrowUpIcon, 
  CpuChipIcon,
  CircleStackIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const projects = [
    {
      id: 1,
      name: "E-commerce API",
      status: "Active",
      requests: "1.2M",
      uptime: "99.9%",
      lastDeployed: "2 hours ago",
      color: "bg-green-500"
    },
    {
      id: 2,
      name: "Mobile App Backend",
      status: "Active", 
      requests: "847K",
      uptime: "99.8%",
      lastDeployed: "1 day ago",
      color: "bg-blue-500"
    },
    {
      id: 3,
      name: "Analytics Dashboard",
      status: "Inactive",
      requests: "124K",
      uptime: "99.5%",
      lastDeployed: "1 week ago",
      color: "bg-gray-500"
    }
  ];

  const stats = [
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Total Requests",
      value: "2.1M",
      change: "+12%",
      changeColor: "text-green-600"
    },
    {
      icon: <CloudArrowUpIcon className="h-8 w-8" />,
      title: "Active Projects",
      value: "8",
      change: "+2",
      changeColor: "text-green-600"
    },
    {
      icon: <CpuChipIcon className="h-8 w-8" />,
      title: "CPU Usage",
      value: "67%",
      change: "-5%",
      changeColor: "text-green-600"
    },
    {
      icon: <CircleStackIcon className="h-8 w-8" />,
      title: "Storage Used",
      value: "2.4GB",
      change: "+0.3GB",
      changeColor: "text-blue-600"
    }
  ];

  const recentActivity = [
    {
      action: "Deployed new version",
      project: "E-commerce API",
      time: "2 hours ago",
      status: "success"
    },
    {
      action: "Database backup completed",
      project: "Mobile App Backend",
      time: "4 hours ago", 
      status: "success"
    },
    {
      action: "High CPU usage alert",
      project: "Analytics Dashboard",
      time: "6 hours ago",
      status: "warning"
    },
    {
      action: "SSL certificate renewed",
      project: "E-commerce API",
      time: "1 day ago",
      status: "success"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-primary-600">
                  {stat.icon}
                </div>
                <span className={`text-sm font-medium ${stat.changeColor}`}>
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                  <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                    <PlusIcon className="h-4 w-4" />
                    New Project
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">Last deployed {project.lastDeployed}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{project.requests}</div>
                          <div className="text-gray-600">Requests</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{project.uptime}</div>
                          <div className="text-gray-600">Uptime</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.project}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <Link 
                    to="/docs" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BoltIcon className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">View API Documentation</span>
                  </Link>
                  <Link 
                    to="/api" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <EyeIcon className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">Monitor Performance</span>
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ArrowTrendingUpIcon className="h-5 w-5 text-primary-600" />
                    <span className="text-sm font-medium text-gray-700">Upgrade Plan</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
