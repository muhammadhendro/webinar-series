import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import Input from './components/Input';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('speakers')
        .insert([
          {
            full_name: formData.fullName,
            company_name: formData.companyName,
            email: formData.email,
            phone_number: formData.phone,
            position: formData.position
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center p-8 bg-xynexis-dark min-h-[400px]">
        <div className="max-w-md w-full bg-[#2b303b] p-8 rounded-lg shadow-xl text-center border-t-4 border-xynexis-green">
          <svg className="w-16 h-16 text-xynexis-green mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-gray-300">Thank you for registering as a speaker. We will contact you shortly.</p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ fullName: '', companyName: '', email: '', phone: '', position: '' }); }}
            className="mt-6 text-xynexis-green hover:text-white font-medium underline"
          >
            Register another person
          </button>
        </div>
      </div>
    );
  }

  return (
    // w-full and overflow-x-hidden to prevent horizontal scrolling
    <div className="w-full bg-xynexis-dark flex flex-col items-center overflow-x-hidden">

      {/* Top Section: Hero / Info with Background Image */}
      {/* Reduced Height to avoid double scroll: 500px on desktop */}
      <div
        className="w-full relative min-h-[350px] lg:min-h-[600px] flex items-center bg-cover bg-right bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: "url('/speaker_illustration.png')" }}
      >
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-xynexis-dark via-xynexis-dark/80 to-transparent bg-opacity-90"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2">
          {/* Left: Text */}
          <div className="py-8 md:py-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-white">Become a </span>
              <span className="text-xynexis-green">Speaker</span>
            </h1>
            <p className="text-gray-300 text-base sm:text-lg mb-6 md:mb-8 max-w-xl">
              Join our webinar series and share your expertise in Post-Quantum Cryptography and Cyber Security.
            </p>
            <div className="flex items-center space-x-4 text-gray-300 text-sm sm:text-base">
              <div className="w-8 md:w-12 h-1 bg-xynexis-green rounded"></div>
              <span>Xynexis Webinar Series</span>
            </div>
          </div>
          {/* Right: Empty to let image show */}
          <div></div>
        </div>
      </div>

      {/* Bottom Section: Form */}
      {/* Responsive padding and margin */}
      <div className="max-w-2xl w-full bg-[#2b303b] p-6 md:px-12 md:pt-12 md:pb-6 rounded-xl shadow-2xl z-10 mt-6 md:mt-8 mx-4 border border-gray-700/50 transform transition-all">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 border-b border-gray-600 pb-4 text-center">Registration Form</h2>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your organization"
            required
          />

          <Input
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="e.g. Senior Security Analyst"
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
          />

          <Input
            label="Phone Number (Optional)"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+62..."
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-xynexis-green text-white font-bold py-3 md:py-4 px-6 rounded-lg text-lg transition-all transform hover:scale-[1.01] hover:bg-xynexis-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xynexis-green focus:ring-offset-[#2b303b] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : 'Submit Registration'}
          </button>
        </form>
      </div>

      {/* Spacing bottom removed */}
    </div>
  );
}

export default App;
