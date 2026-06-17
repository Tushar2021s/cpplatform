import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [handle, setHandle]   = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')
    const { login }             = useAuth()
    const navigate              = useNavigate()

    const handleLogin = async () => {
        if (!handle.trim()) {
            setError('Please enter your Codeforces handle')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await api.get(`/api/auth/test-cf?handle=${handle}`)
            const { jwt, email, name, avatarUrl } = res.data

            login(jwt, { email, name, avatarUrl })
            navigate('/problems')

        } catch (err) {
            setError('Handle not found on Codeforces. Please check and try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">⚡ CPForge</h1>
                    <p className="text-gray-400 mt-2">
                        Your competitive programming journey starts here
                    </p>
                </div>

                {/* Codeforces login */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">
                            Codeforces Handle
                        </label>
                        <input
                            type="text"
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            placeholder="e.g. tourist"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg
                         px-4 py-3 text-white placeholder-gray-500
                         focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800
                       text-white font-semibold py-3 rounded-lg transition"
                    >
                        {loading ? 'Verifying...' : 'Login with Codeforces'}
                    </button>
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-white">9000+</div>
                        <div className="text-xs text-gray-500">Problems</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">35+</div>
                        <div className="text-xs text-gray-500">Tags</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">🔥</div>
                        <div className="text-xs text-gray-500">Streaks</div>
                    </div>
                </div>
            </div>
        </div>
    )
}