import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [speakers, setSpeakers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSpeakers();
    }, []);

    const fetchSpeakers = async () => {
        try {
            const { data, error } = await supabase
                .from('speakers')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setSpeakers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-xynexis-dark text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
                    <div>
                        <h1 className="text-3xl font-bold text-xynexis-green">Dashboard</h1>
                        <p className="text-gray-400 mt-1">Total Registrants: {speakers.length}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 rounded hover:bg-red-600/40 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
                        Error: {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading data...</div>
                ) : (
                    <div className="bg-[#2b303b] rounded-xl overflow-hidden shadow-xl border border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#1f232c] text-xynexis-green uppercase text-sm font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Full Name</th>
                                        <th className="px-6 py-4">Company</th>
                                        <th className="px-6 py-4">Position</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {speakers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No registrations yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        speakers.map((speaker) => (
                                            <tr key={speaker.id} className="hover:bg-[#323842] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                                                    {formatDate(speaker.created_at)}
                                                </td>
                                                <td className="px-6 py-4 font-medium">{speaker.full_name}</td>
                                                <td className="px-6 py-4 text-gray-300">{speaker.company_name}</td>
                                                <td className="px-6 py-4 text-gray-300">{speaker.position}</td>
                                                <td className="px-6 py-4 text-gray-300">{speaker.email}</td>
                                                <td className="px-6 py-4 text-gray-300">{speaker.phone_number || '-'}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
