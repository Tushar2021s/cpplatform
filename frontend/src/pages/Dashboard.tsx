import { useState, useEffect } from 'react'
import api from '../api/axios'
import Navbar from '../components/Navbar'

interface DayCell {
    date: string
    count: number
    status: 'solved' | 'missed' | 'today' | 'empty'
}

function buildYearGrid(year: number, solvedMap: Record<string, number>): DayCell[][] {
    const start = new Date(year, 0, 1)
    const end = new Date(year, 11, 31)
    const todayStr = new Date().toISOString().split('T')[0]

    // back up to the previous Sunday so every week column has 7 rows
    const gridStart = new Date(start)
    gridStart.setDate(start.getDate() - start.getDay())

    const totalCells = Math.ceil(
        ((end.getTime() - gridStart.getTime()) / 86400000 + 1) / 7
    ) * 7

    const days: DayCell[] = []
    for (let i = 0; i < totalCells; i++) {
        const d = new Date(gridStart)
        d.setDate(gridStart.getDate() + i)
        const dateStr = d.toISOString().split('T')[0]
        const inYear = d.getFullYear() === year
        const count = solvedMap[dateStr] || 0

        let status: DayCell['status']
        if (!inYear || dateStr > todayStr) {
            status = 'empty'
        } else if (dateStr === todayStr) {
            status = 'today'
        } else if (count > 0) {
            status = 'solved'
        } else {
            status = 'missed'
        }

        days.push({ date: dateStr, count, status })
    }

    const weeks: DayCell[][] = []
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7))
    }
    return weeks
}

const cellClass = (status: DayCell['status']) => {
    switch (status) {
        case 'solved': return 'bg-green-500'
        case 'missed': return 'bg-red-600/50'
        case 'today':  return 'bg-white/10 ring-1 ring-white'
        default:       return 'bg-white/[0.04]'
    }
}

export default function Dashboard() {
    const [solvedMap, setSolvedMap] = useState<Record<string, number>>({})
    const [streak, setStreak]       = useState({ currentStreak: 0, bestStreak: 0 })
    const [loading, setLoading]     = useState(true)
    const year = new Date().getFullYear()

    useEffect(() => {
        Promise.all([
            api.get('/api/problems/calendar'),
            api.get('/api/streak'),
        ]).then(([calRes, streakRes]) => {
            setSolvedMap(calRes.data)
            setStreak(streakRes.data)
            setLoading(false)
        })
    }, [])

    const weeks = buildYearGrid(year, solvedMap)
    const totalSolved = Object.values(solvedMap).reduce((a, b) => a + b, 0)
    const activeDays = Object.keys(solvedMap).length


    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-bold mb-8">Your Solving Activity</h1>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">{totalSolved}</div>
                        <div className="text-xs text-gray-500 mt-1">Problems solved ({year})</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">{activeDays}</div>
                        <div className="text-xs text-gray-500 mt-1">Active days</div>
                    </div>
                    <div className="bg-white/[0.03] border border-green-700/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">🔥 {streak.currentStreak}</div>
                        <div className="text-xs text-gray-500 mt-1">Current streak</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">{streak.bestStreak}</div>
                        <div className="text-xs text-gray-500 mt-1">Best streak</div>
                    </div>
                </div>

                {/* Heatmap */}
                {loading ? (
                    <div className="text-gray-500">Loading heatmap...</div>
                ) : (
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 overflow-x-auto">
                        <div className="flex gap-1">
                            {weeks.map((week, wi) => (
                                <div key={wi} className="flex flex-col gap-1">
                                    {week.map(day => (
                                        <div
                                            key={day.date}
                                            title={`${day.date} — ${day.count} solved`}
                                            className={`w-3 h-3 rounded-sm ${cellClass(day.status)}`}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm bg-green-500" /> Solved
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm bg-red-600/50" /> Missed
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm bg-white/10 ring-1 ring-white" /> Today
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}