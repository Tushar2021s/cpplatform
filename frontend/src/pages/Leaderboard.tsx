import { useState, useEffect } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

interface Entry {
    rank: number
    name: string
    avatarUrl: string
    codeforcesHandle: string | null
    problemsSolved: number
    currentStreak: number
    bestStreak: number
    currentUser: boolean
}

export default function Leaderboard() {
    const [entries, setEntries] = useState<Entry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/api/leaderboard')
            .then(res => setEntries(res.data))
            .finally(() => setLoading(false))
    }, [])

    const medalFor = (rank: number) => {
        if (rank === 1) return '🥇'
        if (rank === 2) return '🥈'
        if (rank === 3) return '🥉'
        return null
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-3xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-1">Leaderboard</h1>
                <p className="text-gray-500 text-sm mb-8">
                    Ranked by total problems solved
                </p>

                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : entries.length === 0 ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center text-gray-500">
                        No one has solved a problem yet — be the first!
                    </div>
                ) : (
                    <div className="space-y-2">
                        {entries.map(entry => (
                            <div
                                key={entry.rank}
                                className={`flex items-center gap-4 rounded-xl px-5 py-3 border transition
                           ${entry.currentUser
                                    ? 'border-white/40 bg-white/[0.06]'
                                    : 'border-white/10 bg-white/[0.02]'}`}
                            >
                                <div className="w-8 text-center font-bold text-gray-400">
                                    {medalFor(entry.rank) || `#${entry.rank}`}
                                </div>

                                {entry.avatarUrl && (
                                    <img src={entry.avatarUrl} className="w-9 h-9 rounded-full" alt="" />
                                )}

                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">
                                        {entry.name}
                                        {entry.currentUser && (
                                            <span className="text-xs text-gray-500 ml-2">(you)</span>
                                        )}
                                    </div>
                                    {entry.codeforcesHandle && (
                                        <div className="text-xs text-gray-500">
                                            @{entry.codeforcesHandle}
                                        </div>
                                    )}
                                </div>

                                <div className="text-right">
                                    <div className="font-bold">{entry.problemsSolved}</div>
                                    <div className="text-xs text-gray-500">solved</div>
                                </div>

                                <div className="text-right w-16">
                                    <div className="font-bold text-green-400">🔥 {entry.currentStreak}</div>
                                    <div className="text-xs text-gray-500">streak</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}