import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ message: 'Server Configuration Error' });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Generate a new token by inserting into the table
        // The DB automatically generates the UUID 'token'
        const { data, error } = await supabase
            .from('submission_tokens')
            .insert([{}]) // Insert empty object to trigger default values
            .select('token')
            .single();

        if (error) throw error;

        return res.status(200).json({ token: data.token });
    } catch (err) {
        console.error('CSRF Error:', err);
        return res.status(500).json({ message: 'Failed to generate security token' });
    }
}
