import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

declare global {
    interface Window { google: any }
}

type CfStep = 'closed' | 'enter-handle' | 'verify'

export default function Login() {
    const [cfStep, setCfStep]         = useState<CfStep>('closed')
    const [handle, setHandle]         = useState('')
    const [problemUrl, setProblemUrl] = useState('')
    const [loading, setLoading]       = useState(false)
    const [error, setError]           = useState('')
    const googleBtnRef                = useRef<HTMLDivElement>(null)
    const { login }                   = useAuth()
    const navigate                    = useNavigate()

    // initialize Google Sign-In button once the script has loaded
    useEffect(() => {
        const initGoogle = () => {
            if (!window.google || !googleBtnRef.current) return

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            })

            window.google.accounts.id.renderButton(googleBtnRef.current, {
                theme: 'filled_black',
                size: 'large',
                width: 320,
            })
        }

        // the script loads async — poll briefly until it's ready
        const interval = setInterval(() => {
            if (window.google) {
                initGoogle()
                clearInterval(interval)
            }
        }, 100)

        return () => clearInterval(interval)
    }, [])

    const handleGoogleResponse = async (response: any) => {
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/api/auth/google', { token: response.credential })
            const { jwt, email, name, avatarUrl } = res.data
            login(jwt, { email, name, avatarUrl })
            navigate('/problems')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Google sign-in failed')
        } finally {
            setLoading(false)
        }
    }

    const requestChallenge = async () => {
        if (!handle.trim()) { setError('Enter your Codeforces handle'); return }
        setLoading(true)
        setError('')
        try {
            const res = await api.get(`/api/auth/codeforces/challenge?handle=${handle}`)
            setProblemUrl(res.data.problemUrl)
            setCfStep('verify')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Handle not found on Codeforces')
        } finally {
            setLoading(false)
        }
    }

    const verifyAndLogin = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/api/auth/codeforces/login', { handle })
            const { jwt, email, name, avatarUrl } = res.data
            login(jwt, { email, name, avatarUrl })
            navigate('/problems')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">⚡ CPForge</h1>
                    <p className="text-gray-400 mt-2">Sign up or log in to continue</p>
                </div>

                {/* Primary — Google */}
                <div className="flex justify-center mb-6">
                    <div ref={googleBtnRef}></div>
                </div>

                <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gray-800"></div>
                    <span className="text-gray-500 text-xs">OR</span>
                    <div className="flex-1 h-px bg-gray-800"></div>
                </div>

                {/* Secondary — Codeforces, only for already-linked accounts */}
                {cfStep === 'closed' && (
                    <button
                        onClick={() => setCfStep('enter-handle')}
                        className="w-full text-gray-400 hover:text-white text-sm
                       border border-gray-800 hover:border-gray-700
                       rounded-lg py-2.5 transition"
                    >
                        Log in with a linked Codeforces handle
                    </button>
                )}

                {cfStep === 'enter-handle' && (
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={handle}
                            onChange={e => setHandle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && requestChallenge()}
                            placeholder="Your linked Codeforces handle"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg
                         px-4 py-2.5 text-white placeholder-gray-500
                         focus:outline-none focus:border-blue-500 transition"
                        />
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            onClick={requestChallenge}
                            disabled={loading}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white
                         text-sm py-2.5 rounded-lg transition"
                        >
                            {loading ? 'Checking...' : 'Continue'}
                        </button>
                    </div>
                )}

                {cfStep === 'verify' && (
                    <div className="space-y-3">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <p className="text-gray-300 text-sm mb-2">
                                Submit any code that <span className="text-orange-400">fails to compile</span> to:
                            </p>
                            <a href={problemUrl} target="_blank" rel="noopener noreferrer"
                               className="text-blue-400 underline text-sm break-all">
                                {problemUrl}
                            </a>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            onClick={verifyAndLogin}
                            disabled={loading}
                            className="w-full bg-green-700 hover:bg-green-600 text-white
                         text-sm py-2.5 rounded-lg transition"
                        >
                            {loading ? 'Verifying...' : "I've submitted it — Verify"}
                        </button>
                        <button
                            onClick={() => { setCfStep('closed'); setError('') }}
                            className="w-full text-gray-500 hover:text-gray-300 text-xs transition"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}