import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CloudArrowUpIcon, 
  KeyIcon, 
  CogIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const features = [
    {
      icon: KeyIcon,
      title: 'API Key Management',
      description: 'Generate, manage, and restrict access with simple key policies.'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Cloud File Storage',
      description: 'Upload any file format securely. Images, PDFs, docs, media — all welcome.'
    },
    {
      icon: CogIcon,
      title: 'Scalable Infrastructure',
      description: 'Auto-scaling servers that support large-scale apps and millions of users.'
    },
    {
      icon: ChartBarIcon,
      title: 'Logs & Monitoring',
      description: 'View real-time data access logs, track API usage, and monitor storage consumption.'
    },
    {
      icon: BoltIcon,
      title: 'Real-time Access',
      description: 'Get notified when files are uploaded or APIs are accessed.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Admin Dashboard',
      description: 'Control access, reset keys, monitor bandwidth, and upgrade plans.'
    }
  ];

  const testimonials = [
    {
      content: "Cloudidada simplified our backend infrastructure completely. We went from managing servers to focusing on our product in just days.",
      author: "Sarah Chen",
      role: "Lead Developer at StartupXYZ"
    },
    {
      content: "The API key management is intuitive and the file storage is lightning fast. Perfect alternative to Firebase for our needs.",
      author: "Michael Rodriguez",
      role: "Freelance Developer"
    },
    {
      content: "Zero setup time and excellent documentation. Cloudidada saved us weeks of development time.",
      author: "Emma Thompson",
      role: "CTO at TechFlow"
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-sky-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Build, Scale, and Store with{' '}
              <span className="text-blue-600">Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A powerful, secure, and developer-friendly platform for API key generation, file storage, and scalable backend services. Cloudidada simplifies backend management so you can focus on building exceptional apps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started Free
              </Link>
              <Link
                to="/docs"
                className="btn-outline text-lg px-8 py-3"
              >
                View API Docs
              </Link>
              <Link
                to="/contact"
                className="btn-secondary text-lg px-8 py-3"
              >
                Request a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Cloudidada Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Cloudidada?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to build modern applications without the complexity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CogIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fully Managed Cloud Infrastructure</h3>
              <p className="text-gray-600">No server management, no complex configurations. Just simple, reliable cloud services.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Zero Setup – Get Started in 30 Seconds</h3>
              <p className="text-gray-600">Create your account, get your API key, and start building immediately.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Access & Secure Storage</h3>
              <p className="text-gray-600">Enterprise-grade security with real-time monitoring and access controls.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Services</h2>
            <p className="text-xl text-gray-600">Powerful tools to accelerate your development</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted By</h2>
            <p className="text-gray-600">Developers and teams worldwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="bg-gray-200 h-12 rounded flex items-center justify-center">
                <span className="text-gray-600 font-semibold">Startup XYZ</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-12 rounded flex items-center justify-center">
                <span className="text-gray-600 font-semibold">TechFlow</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-12 rounded flex items-center justify-center">
                <span className="text-gray-600 font-semibold">DevStudio</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-12 rounded flex items-center justify-center">
                <span className="text-gray-600 font-semibold">AppCraft</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Developers Say</h2>
            <p className="text-xl text-gray-600">Real feedback from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start building smarter backends with Cloudidada
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust Cloudidada for their backend infrastructure needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
