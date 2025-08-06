import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/outline';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: 'Free Forever',
      description: 'Perfect for getting started',
      features: [
        '5,000 API calls',
        '500MB storage',
        'Community support',
        'Basic dashboard',
        'Standard SSL',
      ],
      cta: 'Get Started Free',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Developer',
      price: '₹499',
      period: '/month',
      description: 'For individual developers',
      features: [
        '50,000 API calls',
        '5GB storage',
        'Email support',
        'Advanced dashboard',
        'Custom domains',
        'API rate limiting',
        'Usage analytics',
      ],
      cta: 'Start Developer Plan',
      href: '/signup',
      popular: true,
    },
    {
      name: 'Business',
      price: '₹4,999',
      period: '/month',
      description: 'For growing teams',
      features: [
        '500,000 API calls',
        '50GB storage',
        'Priority email support',
        'Team management',
        'Advanced analytics',
        'Custom webhooks',
        'SLA guarantee',
        'White-label options',
      ],
      cta: 'Start Business Plan',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom Quote',
      description: 'For large organizations',
      features: [
        'Unlimited API calls',
        'Custom storage',
        'Dedicated account manager',
        'Custom integrations',
        'On-premise deployment',
        'Custom SLA',
        'Priority support',
        'Training & onboarding',
      ],
      cta: 'Contact Sales',
      href: '/contact',
      popular: false,
    },
  ];

  const addOns = [
    {
      name: 'Additional Storage',
      price: '₹50',
      unit: 'per GB/month',
      description: 'Scale your storage as needed',
    },
    {
      name: 'API Burst Pack',
      price: '₹100',
      unit: 'for 100,000 calls',
      description: 'Extra API calls when you need them',
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your project size. Start free and scale as you grow.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-sm border-2 p-8 ${
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.href}
                  className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-ons</h2>
            <p className="text-xl text-gray-600">
              Extend your plan with additional resources
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {addOns.map((addOn, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{addOn.name}</h3>
                <p className="text-gray-600 mb-4">{addOn.description}</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-primary-600">{addOn.price}</span>
                  <span className="text-gray-600 ml-2">{addOn.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Common questions about our pricing
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, we'll provide a full refund.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you approach your limits. You can purchase add-ons or upgrade your plan to continue service without interruption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building with Cloudidada
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
