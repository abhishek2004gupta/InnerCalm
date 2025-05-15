import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Policies.css';

const Policies = () => {
  const location = useLocation();
  const [activePolicy, setActivePolicy] = useState('privacy');

  useEffect(() => {
    // Set active policy based on URL path
    const path = location.pathname;
    if (path.includes('/privacy')) {
      setActivePolicy('privacy');
    } else if (path.includes('/terms')) {
      setActivePolicy('terms');
    } else if (path.includes('/accessibility')) {
      setActivePolicy('accessibility');
    }
  }, [location]);

  const policies = {
    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'March 15, 2024',
      content: [
        {
          section: 'Information We Collect',
          text: 'We collect information that you provide directly to us, including but not limited to your name, email address, and any other information you choose to provide when using our services.'
        },
        {
          section: 'How We Use Your Information',
          text: 'We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to protect our users.'
        },
        {
          section: 'Data Security',
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          section: 'Your Rights',
          text: 'You have the right to access, correct, or delete your personal information. You can also object to our processing of your data or request a copy of your data.'
        }
      ]
    },
    terms: {
      title: 'Terms of Service',
      lastUpdated: 'March 15, 2024',
      content: [
        {
          section: 'Acceptance of Terms',
          text: 'By accessing and using Inner Calm services, you agree to be bound by these Terms of Service and all applicable laws and regulations.'
        },
        {
          section: 'User Responsibilities',
          text: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.'
        },
        {
          section: 'Service Modifications',
          text: 'We reserve the right to modify or discontinue our services at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance.'
        },
        {
          section: 'Limitation of Liability',
          text: 'Inner Calm shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
        }
      ]
    },
    accessibility: {
      title: 'Accessibility Statement',
      lastUpdated: 'March 15, 2024',
      content: [
        {
          section: 'Our Commitment',
          text: 'Inner Calm is committed to ensuring digital accessibility for people of all abilities. We strive to continually improve the user experience for everyone and apply relevant accessibility standards.'
        },
        {
          section: 'Accessibility Features',
          text: 'Our website includes features such as keyboard navigation, screen reader compatibility, adjustable text sizes, and high contrast options to ensure accessibility for all users.'
        },
        {
          section: 'Standards Compliance',
          text: 'We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and regularly test our website for accessibility compliance.'
        },
        {
          section: 'Feedback and Support',
          text: 'If you encounter any accessibility barriers or have suggestions for improvement, please contact us. We value your feedback and are committed to making our services accessible to everyone.'
        }
      ]
    }
  };

  return (
    <div className="policies-container">
      <div className="policies-header">
        <h1>Legal Information</h1>
        <p>Last updated: {policies[activePolicy].lastUpdated}</p>
      </div>

      <div className="policies-content">
        <div className="policies-sidebar">
          <button 
            className={`policy-tab ${activePolicy === 'privacy' ? 'active' : ''}`}
            onClick={() => setActivePolicy('privacy')}
          >
            Privacy Policy
          </button>
          <button 
            className={`policy-tab ${activePolicy === 'terms' ? 'active' : ''}`}
            onClick={() => setActivePolicy('terms')}
          >
            Terms of Service
          </button>
          <button 
            className={`policy-tab ${activePolicy === 'accessibility' ? 'active' : ''}`}
            onClick={() => setActivePolicy('accessibility')}
          >
            Accessibility
          </button>
        </div>

        <div className="policy-details">
          <h2>{policies[activePolicy].title}</h2>
          <div className="policy-sections">
            {policies[activePolicy].content.map((section, index) => (
              <div key={index} className="policy-section">
                <h3>{section.section}</h3>
                <p>{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policies; 