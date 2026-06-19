import { useEffect, useState } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

interface ProfileData {
    name: string
    email: string
    avatarUrl: string
    codeforcesHandle?: string
    currentStreak: number
    bestStreak: number
    authProvider: string
}

export default function Profile() {
    const [profile, setProfile] = useState<ProfileData | null>(null)

    useEffect(() => {
        api.get('/api/user/profile').then(res => setProfile(res.data))
    }, [])

    if (!profile) return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="p-10 text-gray-500">Loading...</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-10">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center gap-4 mb-6">
                        {profile.avatarUrl && (
                            <img src={profile.avatarUrl} className="w-16 h-16 rounded-full" alt="" />
                        )}
                        <div>
                            <div className="text-xl font-bold">{profile.name}</div>
                            <div className="text-gray-500 text-sm">{profile.email}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-green-400">🔥 {profile.currentStreak}</div>
                            <div className="text-xs text-gray-500 mt-1">Current streak</div>
                        </div>
                        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold">{profile.bestStreak}</div>
                            <div className="text-xs text-gray-500 mt-1">Best streak</div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-5">
                        <div className="text-sm text-gray-500 mb-1">Codeforces handle</div>
                        <div className="font-medium">
                            {profile.codeforcesHandle || (
                                <span className="text-gray-600">Not linked</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}