import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Server-Side)
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { full_name, company_name, email, phone_number, position, privacy_consent, marketing_consent, token } = req.body;

    // Basic Existence Validation
    if (!token || !email || !full_name || !company_name || !position) {
        return res.status(400).json({ message: 'Missing required fields or security token' });
    }

    if (privacy_consent !== true) {
        return res.status(400).json({ message: 'You must agree to the Privacy Notice.' });
    }

    // Strict Input Validation (Regex Patterns)
    const nameRegex = /^[a-zA-Z\s\.\-\']+$/;
    const companyPosRegex = /^[a-zA-Z0-9\s\.\-\,\&\'\(\)]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s-]{10,15}$/;

    if (!nameRegex.test(full_name)) return res.status(400).json({ message: 'Invalid characters in Full Name' });
    if (!companyPosRegex.test(company_name)) return res.status(400).json({ message: 'Invalid characters in Company Name' });
    if (!companyPosRegex.test(position)) return res.status(400).json({ message: 'Invalid characters in Position' });
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid Email format' });
    if (phone_number && !phoneRegex.test(phone_number)) return res.status(400).json({ message: 'Invalid Phone Number format' });

    // Initialize Client
    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ message: 'Server Configuration Error' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Verify and Consume Token (Anti-Brute Force / Anti-Replay)
        // We try to DELETE the token. If it exists, it's valid and now consumed.
        // If it doesn't exist (already deleted or invalid), the operation returns null/empty.
        const { data: tokenData, error: tokenError } = await supabase
            .from('submission_tokens')
            .delete()
            .eq('token', token)
            .select()
            .single();

        if (tokenError || !tokenData) {
            return res.status(403).json({ message: 'Invalid or expired security token. Please refresh the page.' });
        }

        // 2. Insert Data (Sanitized by Parameterized Query)
        const { error } = await supabase
            .from('speakers')
            .insert([
                {
                    full_name: full_name.trim(),
                    company_name: company_name.trim(),
                    email: email.trim().toLowerCase(),
                    phone_number: phone_number ? phone_number.trim() : null,
                    position: position.trim(),
                    privacy_consent: !!privacy_consent,
                    marketing_consent: !!marketing_consent
                }
            ]);

        if (error) {
            if (error.code === '23505') { // Unique violation
                return res.status(409).json({ message: 'This email has already been registered.' });
            }
            throw error;
        }

        return res.status(200).json({ message: 'Success' });
    } catch (err) {
        console.error('Supabase Error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
