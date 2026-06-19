import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [streak, setStreak] = useState(0)

    useEffect(() => {
        api.get('/api/streak')
            .then(res => setStreak(res.data.currentStreak))
            .catch(() => {})
    }, [])

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `text-sm px-3 py-1.5 rounded-lg transition ${
            isActive
                ? 'bg-white text-black font-medium'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`

    return (
        <nav className="bg-black border-b border-white/10 px-6 py-3
                    flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-8">
                <span className="text-lg font-bold text-white">⚡ CPForge</span>

                <div className="flex items-center gap-1">
                    <NavLink to="/home" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/problems" className={navLinkClass}>Problems</NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                    <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                    <NavLink to="/leaderboard" className={navLinkClass}>Leaderboard</NavLink>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5 border border-white/10
                        px-3 py-1 rounded-full">
                    <span>🔥</span>
                    <span className="font-bold text-white text-sm">{streak}</span>
                </div>

                <div className="flex items-center gap-2">
                    {user?.avatarUrl && (
                        <img src={user.avatarUrl} className="w-7 h-7 rounded-full" alt="" />
                    )}
                    <span className="text-gray-300 text-sm">{user?.name}</span>
                </div>

                <button
                    onClick={() => { logout(); navigate('/login') }}
                    className="text-gray-500 hover:text-white text-sm transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}