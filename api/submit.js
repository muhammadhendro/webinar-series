import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Server-Side)
// Vercel automatically loads environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { full_name, company_name, email, phone_number, position } = req.body;

    // Basic Validation
    if (!email || !full_name || !company_name || !position) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Initialize Client
    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ message: 'Server Configuration Error' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // 1. Check for Duplicate Email (Securely on Server)
        // Note: We already added the UNIQUE constraint to the DB, so we can rely on that error,
        // OR we can explicit SELECT here. Since we are on server, SELECT is safe (if RLS allows service role or we use anon).
        // Using simple Insert + Error catching is efficient.

        // 2. Insert Data
        const { error } = await supabase
            .from('speakers')
            .insert([
                {
                    full_name,
                    company_name,
                    email,
                    phone_number,
                    position
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
