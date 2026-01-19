import React, { useState } from 'react';
import Input from '../components/Input';

const SuccessModal = ({ onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-[#2b303b] p-8 rounded-2xl shadow-2xl text-center border-t-4 border-xynexis-green max-w-sm w-full animate-scale-up">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-xynexis-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
            <p className="text-gray-300 mb-6">Your registration has been submitted.</p>
            <button
                onClick={onConfirm}
                className="w-full bg-xynexis-green text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition-all"
            >
                OK
            </button>
        </div>
    </div>
);

function Home() {
    const [formData, setFormData] = useState({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        position: '',
        website: '', // Honeypot field
        privacyConsent: false,
        marketingConsent: false
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [csrfToken, setCsrfToken] = useState(null); // State for One-Time Token

    // Fetch CSRF Token on Mount
    React.useEffect(() => {
        const fetchToken = async () => {
            try {
                const res = await fetch('/api/csrf');
                if (res.ok) {
                    const data = await res.json();
                    setCsrfToken(data.token);
                }
            } catch (e) {
                console.error("Failed to fetch security token");
            }
        };
        fetchToken();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Strict Input Patterns (Whitelisting safe characters)
        const nameRegex = /^[a-zA-Z\s\.\-\']+$/; // Letters, spaces, dots, dashes, apostrophes
        const companyPosRegex = /^[a-zA-Z0-9\s\.\-\,\&\'\(\)]+$/; // Alphanumeric + safe punctuation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

        // Full Name Validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full Name is required';
        } else if (formData.fullName.length > 100) {
            newErrors.fullName = 'Name is too long (max 100 chars)';
        } else if (!nameRegex.test(formData.fullName)) {
            newErrors.fullName = 'Name contains invalid characters (Letters only)';
        }

        // Company Validation
        if (!formData.companyName.trim()) {
            newErrors.companyName = 'Company Name is required';
        } else if (formData.companyName.length > 100) {
            newErrors.companyName = 'Company name is too long';
        } else if (!companyPosRegex.test(formData.companyName)) {
            newErrors.companyName = 'Company name contains invalid characters';
        }

        // Position Validation
        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        } else if (!companyPosRegex.test(formData.position)) {
            newErrors.position = 'Position contains invalid characters';
        }

        // Email Validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Phone Validation
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format (e.g., +62812345678)';
        }

        // Privacy Consent Validation
        if (!formData.privacyConsent) {
            newErrors.privacyConsent = 'You must agree to the Privacy Notice to register.';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Security: Validate before processing
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setError(Object.values(validationErrors)[0]);
            return;
        }

        // Honeypot Field (Anti-Bot)
        if (formData.website) return;

        // Token Check
        if (!csrfToken) {
            setError('Security token missing. Please refresh the page.');
            return;
        }

        // Rate Limiting
        const lastSubmission = localStorage.getItem('last_submission');
        if (lastSubmission) {
            const timeSince = Date.now() - parseInt(lastSubmission, 10);
            const COOLDOWN = 60000;
            if (timeSince < COOLDOWN) {
                setError(`Please wait ${Math.ceil((COOLDOWN - timeSince) / 1000)} seconds before submitting again.`);
                return;
            }
        }

        setLoading(true);
        setError(null);

        try {
            // Send data to Serverless Function (Hides API Keys)
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    full_name: formData.fullName.trim(),
                    company_name: formData.companyName.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone_number: formData.phone ? formData.phone.trim() : null,
                    position: formData.position.trim(),
                    privacy_consent: formData.privacyConsent,
                    marketing_consent: formData.marketingConsent,
                    token: csrfToken // Include One-Time Token
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Registration failed.');
            }

            // Success
            localStorage.setItem('last_submission', Date.now().toString());
            setSubmitted(true);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            // Optionally fetch new token here if you want to allow retry without refresh
        } finally {
            setLoading(false);
        }
    };


    // w-full and overflow-x-hidden to prevent horizontal scrolling
    return (
        <div className="w-full min-h-screen bg-xynexis-dark flex flex-col items-center overflow-x-hidden">

            {/* Top Section: Hero / Info with Background Image */}
            {/* Fixed Pixel Height (700px) is safer for iframes to minimize overflow while still big enough */}
            <div
                className="w-full relative min-h-[600px] lg:min-h-[700px] flex items-center bg-cover bg-right bg-no-repeat transition-all duration-300"
                style={{ backgroundImage: "url('/speaker_illustration.png')" }}
            >
                {/* Dark Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-xynexis-dark via-xynexis-dark/80 to-transparent bg-opacity-90"></div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce z-20 hidden md:block">
                    <svg className="w-10 h-10 text-xynexis-green opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Text */}
                    <div className="py-8 md:py-12">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up">
                            <span className="text-white block">PDP 2026: Siap Audit atau Berisiko Sanksi?</span>
                            <span className="text-xynexis-green block text-2xl sm:text-3xl lg:text-4xl mt-2">Roadmap Operasional dan Checklist Wajib Pemimpin IT</span>
                        </h1>
                        <p className="text-white text-sm sm:text-base mb-6 md:mb-8 max-w-xl animate-fade-in-up font-bold tracking-wide"
                            style={{
                                animationDelay: '0.2s',
                                textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                            }}>
                            Webinar ini membahas bagaimana organisasi dapat melampaui sekadar kepatuhan formal menuju PDP yang matang dan siap audit, melalui pemanfaatan maturity assessment untuk mengidentifikasi gap kritis dan menyusun roadmap PDP yang operasional.
                        </p>
                        <div className="flex items-center space-x-4 text-gray-300 text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                            <div className="w-8 md:w-12 h-1 bg-xynexis-green rounded"></div>
                            <span>Xynexis Webinar Series</span>
                        </div>
                    </div>
                    {/* Right: Empty */}
                    <div></div>
                </div>
            </div>

            {/* Bottom Section: Form */}
            {/* Responsive padding and margin. Removed border and shadow to fix 'white line' artifact. */}
            <div className="max-w-2xl w-full bg-[#2b303b] p-6 md:px-12 md:pt-12 md:pb-6 rounded-xl z-10 mt-6 md:mt-8 mx-4 transform transition-all">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 border-b border-gray-600 pb-4 text-center">Registration Form</h2>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Show loading if token not ready (optional, but good for UX) */}
                {!csrfToken ? (
                    <div className="text-center py-4 text-gray-400">Initializing Security Check...</div>
                ) : (
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

                        {/* Consent Checkboxes */}
                        <div className="space-y-4">
                            {/* Privacy Notice (Mandatory) */}
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="privacyConsent"
                                        checked={formData.privacyConsent}
                                        onChange={handleChange}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-500 bg-transparent transition-all checked:border-xynexis-green checked:bg-xynexis-green hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-xynexis-green focus:ring-offset-2 focus:ring-offset-[#2b303b]"
                                    />
                                    <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                                    Saya menyetujui pemrosesan Data Pribadi saya untuk keperluan pendaftaran acara sesuai dengan <a href="https://xynexis.com/privacy-notice/" target="_blank" rel="noopener noreferrer" className="text-xynexis-green hover:underline">Privacy Notice</a>
                                </span>
                            </label>

                            {/* Marketing Consent (Optional) */}
                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        name="marketingConsent"
                                        checked={formData.marketingConsent}
                                        onChange={handleChange}
                                        className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-500 bg-transparent transition-all checked:border-xynexis-green checked:bg-xynexis-green hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-xynexis-green focus:ring-offset-2 focus:ring-offset-[#2b303b]"
                                    />
                                    <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity peer-checked:opacity-100" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-gray-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                                    Saya setuju menerima informasi dan penawaran pemasaran dari Xynexis.
                                </span>
                            </label>
                        </div>

                        {/* Honeypot Field (Hidden from users, visible to bots) */}
                        <div className="hidden">
                            <label>Website</label>
                            <input
                                type="text"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                tabIndex="-1"
                                autoComplete="off"
                            />
                        </div>

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
                )}
            </div>

            {/* Spacing bottom removed */}

            {/* Success Modal Popup */}
            {submitted && <SuccessModal onConfirm={() => window.location.reload()} />}
        </div>
    );
}

export default Home;
