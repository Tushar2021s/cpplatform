import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const cards = [
    { to: '/problems',    icon: '📚', title: 'Problems',    desc: 'Browse by rating & tags', accent: 'border-white/20' },
    { to: '/daily',       icon: '🎯', title: 'Daily Problem', desc: 'Personalized pick for today', accent: 'border-white/20' },
    { to: '/dashboard',   icon: '📅', title: 'Dashboard',   desc: 'Your solving heatmap', accent: 'border-green-700/40' },
    { to: '/profile',     icon: '👤', title: 'Profile',     desc: 'Stats & linked accounts', accent: 'border-white/20' },
    { to: '/leaderboard', icon: '🏆', title: 'Leaderboard', desc: 'See where you rank', accent: 'border-white/20' },
]

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-12">
                <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
                <p className="text-gray-500 mb-10">Where do you want to go?</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {cards.map(card => (
                        <Link
                            key={card.to}
                            to={card.to}
                            className={`bg-white/[0.03] border ${card.accent} rounded-2xl p-6
                         hover:bg-white/[0.06] hover:border-white/40
                         transition group`}
                        >
                            <div className="text-3xl mb-3">{card.icon}</div>
                            <div className="font-semibold text-white mb-1
                              group-hover:translate-x-0.5 transition">
                                {card.title}
                            </div>
                            <div className="text-sm text-gray-500">{card.desc}</div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}