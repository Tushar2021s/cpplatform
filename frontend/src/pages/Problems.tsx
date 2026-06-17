import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import LinkCodeforces from '../components/LinkCodeforces'
interface Problem {
    id: number
    name: string
    rating: number
    tags: string[]
    url: string
    contestId: number
    index: string
}

const RATINGS = [800,900,1000,1100,1200,1300,1400,1500,
    1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,3000,3500]

export default function Problems() {
    const [problems, setProblems]         = useState<Problem[]>([])
    const [tags, setTags]                 = useState<string[]>([])
    const [selectedRating, setRating]     = useState<number | ''>('')
    const [selectedTag, setTag]           = useState('')
    const [loading, setLoading]           = useState(false)
    const [solvedIds, setSolvedIds]       = useState<Set<number>>(new Set())
    const [streak, setStreak]             = useState(0)
    const { user, logout, isLoggedIn }    = useAuth()
    const navigate                        = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) { navigate('/login'); return }
        fetchTags()
        fetchProblems()
        fetchStreak()
        fetchSolved()
    }, [isLoggedIn])

    useEffect(() => {
        fetchProblems()
    }, [selectedRating, selectedTag])

    const fetchProblems = async () => {
        setLoading(true)
        try {
            const params: Record<string, string> = {}
            if (selectedRating) params.rating = String(selectedRating)
            if (selectedTag)    params.tag    = selectedTag

            const res = await api.get('/api/problems/filter', { params })
            setProblems(res.data.slice(0, 100)) // show first 100
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const fetchTags = async () => {
        const res = await api.get('/api/problems/tags')
        setTags(res.data)
    }

    const fetchStreak = async () => {
        try {
            const res = await api.get('/api/streak')
            setStreak(res.data.currentStreak)
        } catch (e) {}
    }

    const fetchSolved = async () => {
        try {
            const res = await api.get('/api/problems/solved')
            const ids = new Set<number>(
                res.data.map((s: any) => s.problem.id)
            )
            setSolvedIds(ids)
        } catch (e) {}
    }

    const markSolved = async (id: number) => {
        try {
            await api.post(`/api/problems/${id}/solve`)
            setSolvedIds(prev => new Set([...prev, id]))
            fetchStreak() // refresh streak
        } catch (e) {}
    }

    const getRatingColor = (r: number) => {
        if (r <= 1200) return 'text-green-400'
        if (r <= 1600) return 'text-blue-400'
        if (r <= 2000) return 'text-purple-400'
        if (r <= 2400) return 'text-orange-400'
        return 'text-red-400'
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {/* Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4
                      flex items-center justify-between">
                <h1 className="text-xl font-bold">⚡ CPForge</h1>
                <div className="flex items-center gap-6">
                    {/* Streak */}
                    <div className="flex items-center gap-2 bg-gray-800
                          px-3 py-1 rounded-full">
                        <span>🔥</span>
                        <span className="font-bold text-orange-400">{streak}</span>
                        <span className="text-gray-400 text-sm">day streak</span>
                    </div>
                    {/* User */}
                    <div className="flex items-center gap-2">
                        {user?.avatarUrl && (
                            <img src={user.avatarUrl}
                                 className="w-8 h-8 rounded-full" alt="avatar" />
                        )}
                        <span className="text-gray-300">{user?.name}</span>
                    </div>
                    <button onClick={logout}
                            className="text-gray-400 hover:text-white text-sm transition">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {!user?.codeforcesHandle && <LinkCodeforces />}
                {/* Filters */}
                <div className="flex gap-4 mb-6 flex-wrap">
                    <select
                        value={selectedRating}
                        onChange={e => setRating(e.target.value ? Number(e.target.value) : '')}
                        className="bg-gray-800 border border-gray-700 rounded-lg
                       px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Ratings</option>
                        {RATINGS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    <select
                        value={selectedTag}
                        onChange={e => setTag(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg
                       px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Tags</option>
                        {tags.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>

                    <div className="ml-auto text-gray-400 text-sm self-center">
                        {loading ? 'Loading...' : `${problems.length} problems`}
                    </div>
                </div>

                {/* Problem list */}
                <div className="space-y-2">
                    {problems.map(problem => (
                        <div key={problem.id}
                             className={`bg-gray-900 border rounded-xl px-5 py-4
                             flex items-center justify-between
                             hover:border-gray-600 transition
                             ${solvedIds.has(problem.id)
                                 ? 'border-green-800 bg-green-950/20'
                                 : 'border-gray-800'}`}>

                            {/* Left side */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Solved indicator */}
                                <span className="text-lg flex-shrink-0">
                  {solvedIds.has(problem.id) ? '✅' : '⬜'}
                </span>

                                {/* Problem name + tags */}
                                <div className="min-w-0">
                                    <a href={problem.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="font-medium hover:text-blue-400 transition truncate block">
                                        {problem.contestId}{problem.index}. {problem.name}
                                    </a>
                                    <div className="flex gap-1 mt-1 flex-wrap">
                                        {problem.tags.slice(0, 3).map(tag => (
                                            <span key={tag}
                                                  className="text-xs bg-gray-800 text-gray-400
                                       px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <span className={`font-bold text-lg ${getRatingColor(problem.rating)}`}>
                  {problem.rating}
                </span>

                                {!solvedIds.has(problem.id) ? (
                                    <button
                                        onClick={() => markSolved(problem.id)}
                                        className="bg-green-700 hover:bg-green-600 text-white
                               text-sm px-3 py-1 rounded-lg transition">
                                        Mark Solved
                                    </button>
                                ) : (
                                    <span className="text-green-400 text-sm font-medium">
                    Solved
                  </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}