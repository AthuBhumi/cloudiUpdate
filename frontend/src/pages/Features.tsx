import React from 'react';
import { 
  CloudArrowUpIcon, 
  KeyIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  BoltIcon,
  ServerIcon,
  CircleStackIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArrowPathIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Features: React.FC = () => {
  const features = [
    {
      icon: <CloudArrowUpIcon className="h-8 w-8" />,
      title: "Cloud Infrastructure",
      description: "Deploy and scale your applications with our robust cloud infrastructure. Get reliable hosting with 99.9% uptime guarantee."
    },
    {
      icon: <KeyIcon className="h-8 w-8" />,
      title: "API Management",
      description: "Powerful API gateway with authentication, rate limiting, and comprehensive analytics. Manage all your APIs from one dashboard."
    },
    {
      icon: <CogIcon className="h-8 w-8" />,
      title: "Automation Tools",
      description: "Automate your workflows with our intelligent tools. Set up CI/CD pipelines, automated backups, and more."
    },
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: "Security First",
      description: "Enterprise-grade security with end-to-end encryption, secure access controls, and compliance certifications."
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "Real-time Analytics",
      description: "Monitor your applications with detailed analytics, performance metrics, and custom dashboards."
    },
    {
      icon: <BoltIcon className="h-8 w-8" />,
      title: "High Performance",
      description: "Lightning-fast response times with global CDN, edge computing, and optimized infrastructure."
    },
    {
      icon: <ServerIcon className="h-8 w-8" />,
      title: "Serverless Functions",
      description: "Run code without managing servers. Auto-scaling serverless functions with pay-per-use pricing."
    },
    {
      icon: <CircleStackIcon className="h-8 w-8" />,
      title: "Database Services",
      description: "Managed databases with automatic backups, scaling, and monitoring. Support for SQL and NoSQL."
    },
    {
      icon: <GlobeAltIcon className="h-8 w-8" />,
      title: "Global Network",
      description: "Deploy to multiple regions worldwide with our global network of data centers for low latency."
    },
    {
      icon: <LockClosedIcon className="h-8 w-8" />,
      title: "Access Control",
      description: "Fine-grained access control with role-based permissions, SSO integration, and audit logs."
    },
    {
      icon: <ArrowPathIcon className="h-8 w-8" />,
      title: "Auto Scaling",
      description: "Automatically scale your resources based on demand. No manual intervention required."
    },
    {
      icon: <ClockIcon className="h-8 w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock technical support with dedicated account managers for enterprise customers."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Features for Modern Development
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Everything you need to build, deploy, and scale your applications with confidence
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-primary-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of developers building amazing applications with Cloudidada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
