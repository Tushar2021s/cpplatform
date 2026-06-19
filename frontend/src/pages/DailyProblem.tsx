import { useState, useEffect } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

interface Problem {
    id: number
    name: string
    rating: number
    tags: string[]
    url: string
    contestId: number
    index: string
}

export default function DailyProblem() {
    const [problem, setProblem] = useState<Problem | null>(null)
    const [solved, setSolved]   = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchDaily()
    }, [])

    const fetchDaily = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/problems/daily')
            if (res.data.problem) {
                setProblem(res.data.problem)
                setSolved(res.data.solved)
            } else {
                setMessage(res.data.message)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const markSolved = async () => {
        if (!problem) return
        try {
            await api.post(`/api/problems/${problem.id}/solve`)
            setSolved(true)
        } catch (e) {}
    }

    const getRatingColor = (r: number) => {
        if (r <= 1200) return 'text-gray-300'
        if (r <= 1600) return 'text-blue-400'
        if (r <= 2000) return 'text-purple-400'
        if (r <= 2400) return 'text-orange-400'
        return 'text-red-400'
    }

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
    })

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-12">
                <p className="text-gray-500 text-sm mb-1">{today}</p>
                <h1 className="text-2xl font-bold mb-8">Today's Recommended Problem</h1>

                {loading ? (
                    <div className="text-gray-500">Picking a problem for you...</div>
                ) : message ? (
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center">
                        <div className="text-3xl mb-3">🏆</div>
                        <p className="text-gray-300">{message}</p>
                    </div>
                ) : problem && (
                    <div className={`border rounded-2xl p-8 transition
                          ${solved
                        ? 'border-green-700/30 bg-green-500/[0.04]'
                        : 'border-white/10 bg-white/[0.03]'}`}>

                        <div className="flex items-start justify-between mb-4">
                            <a href={problem.url} target="_blank" rel="noopener noreferrer"
                               className="text-xl font-semibold hover:underline">
                                {problem.contestId}{problem.index}. {problem.name}
                            </a>
                            <span className={`font-bold text-xl ${getRatingColor(problem.rating)}`}>
                {problem.rating}
              </span>
                        </div>

                        <div className="flex gap-1.5 flex-wrap mb-6">
                            {problem.tags.map(tag => (
                                <span key={tag} className="text-xs bg-white/[0.06] text-gray-400
                                           px-2 py-0.5 rounded-full">
                  {tag}
                </span>
                            ))}
                        </div>

                        <p className="text-gray-500 text-sm mb-6">
                            Picked based on your solving history — slightly above your
                            average to help you grow. A new one arrives tomorrow.
                        </p>

                        {solved ? (
                            <div className="text-green-400 font-medium">
                                ✅ Solved — nice work today
                            </div>
                        ) : (
                            <button onClick={markSolved}
                                    className="bg-white text-black hover:bg-gray-200
                                 font-medium px-5 py-2.5 rounded-lg transition">
                                Mark as Solved
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}