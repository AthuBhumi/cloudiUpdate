import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const team = [
    {
      name: "Atharva",
      role: "Founder & CEO",
      description: "Passionate about making backend services accessible to every developer."
    },
    {
      name: "Tech Lead",
      role: "CTO",
      description: "Building scalable infrastructure that developers love to use."
    },
    {
      name: "Backend Architect",
      role: "Senior Engineer",
      description: "Ensuring security and performance at every level."
    }
  ];

  const milestones = [
    { year: "2025", event: "Founded Cloudidada", description: "Started with a simple idea to democratize backend services" },
    { year: "2025", event: "2,000+ Developers", description: "Rapid growth in our developer community" },
    { year: "2025", event: "100K+ Files Stored", description: "Securely managing millions of files" },
    { year: "2025", event: "99.99% Uptime SLA", description: "Reliable infrastructure you can depend on" }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Cloudidada</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering developers with simple, scalable, and secure backend services
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Cloudidada started with a simple idea — to make backend services accessible to every developer, 
                freelancer, and startup. No more managing servers or writing complex scripts to handle file uploads 
                or secure your APIs.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that powerful infrastructure shouldn't require a team of DevOps engineers. 
                Every developer should be able to focus on building great products without worrying about 
                the underlying infrastructure.
              </p>
              <Link to="/signup" className="btn-primary">
                Join Our Mission
              </Link>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mission</h3>
              <p className="text-gray-600 mb-6">
                To empower developers by delivering intuitive, scalable, and secure backend services without complexity.
              </p>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-600">
                To be the go-to alternative to Firebase and Cloudinary, and a global platform for developers 
                looking for reliable cloud infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-600">
              The people behind Cloudidada's success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              Key milestones in building Cloudidada
            </p>
          </div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-24 text-right">
                  <span className="text-sm font-medium text-primary-600">{milestone.year}</span>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-primary-600 rounded-full mx-6"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{milestone.event}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Us?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Be part of the next generation of cloud infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Get Started Free
            </Link>
            <Link
              to="/careers"
              className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              View Careers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
