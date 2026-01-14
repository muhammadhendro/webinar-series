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
      <div className="min-h-screen flex items-center justify-center p-4 bg-xynexis-dark">
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-xynexis-dark flex flex-col items-center">
      <div className="max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Side: Hero / Info */}
        <div className="hidden md:block">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">Become a </span>
            <span className="text-xynexis-green">Speaker</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Join our webinar series and share your expertise in Post-Quantum Cryptography and Cyber Security.
          </p>
          <div className="flex items-center space-x-4 text-gray-400">
            <div className="w-12 h-1 bg-xynexis-green rounded"></div>
            <span>Xynexis Webinar Series</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-[#2b303b] p-8 rounded-xl shadow-2xl w-full">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Registration Form</h2>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
              className={`w-full mt-4 bg-xynexis-green text-white font-bold py-3 px-4 rounded transition-all transform hover:scale-[1.02] hover:bg-xynexis-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xynexis-green focus:ring-offset-[#2b303b] ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
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
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Xynexis. All rights reserved.
      </div>
    </div>
  );
}

export default App;
