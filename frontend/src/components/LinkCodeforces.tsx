import { useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function LinkCodeforces() {
    const [open, setOpen]             = useState(false)
    const [step, setStep]             = useState<'enter' | 'verify'>('enter')
    const [handle, setHandle]         = useState('')
    const [problemUrl, setProblemUrl] = useState('')
    const [loading, setLoading]       = useState(false)
    const [error, setError]           = useState('')
    const { refreshUser }             = useAuth()

    const requestChallenge = async () => {
        if (!handle.trim()) { setError('Enter your handle'); return }
        setLoading(true); setError('')
        try {
            const res = await api.get(`/api/auth/codeforces/challenge?handle=${handle}`)
            setProblemUrl(res.data.problemUrl)
            setStep('verify')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Handle not found')
        } finally { setLoading(false) }
    }

    const verifyAndLink = async () => {
        setLoading(true); setError('')
        try {
            await api.post('/api/user/link-codeforces', { handle })
            await refreshUser()
            setOpen(false)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed')
        } finally { setLoading(false) }
    }

    if (!open) {
        return (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-3
                      flex items-center justify-between mb-6">
        <span className="text-gray-400 text-sm">
          Link your Codeforces handle to enable Codeforces login
        </span>
                <button onClick={() => setOpen(true)}
                        className="text-white hover:text-gray-300 text-sm font-medium transition">
                    Link now →
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
            {step === 'enter' && (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={handle}
                        onChange={e => setHandle(e.target.value)}
                        placeholder="Your Codeforces handle"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg
                       px-4 py-2 text-white placeholder-gray-600 text-sm
                       focus:outline-none focus:border-white/40"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex gap-2">
                        <button onClick={requestChallenge} disabled={loading}
                                className="bg-white text-black hover:bg-gray-200 text-sm
                               px-4 py-2 rounded-lg transition font-medium">
                            {loading ? 'Checking...' : 'Continue'}
                        </button>
                        <button onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {step === 'verify' && (
                <div className="space-y-3">
                    <p className="text-gray-300 text-sm">
                        Submit code that <span className="text-orange-400">fails to compile</span> to:{' '}
                        <a href={problemUrl} target="_blank" rel="noopener noreferrer"
                           className="text-gray-200 underline break-all hover:text-white">{problemUrl}</a>
                    </p>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button onClick={verifyAndLink} disabled={loading}
                            className="bg-green-600 hover:bg-green-500 text-white text-sm
                             px-4 py-2 rounded-lg transition font-medium">
                        {loading ? 'Verifying...' : "I've submitted it — Verify"}
                    </button>
                </div>
            )}
        </div>
    )
}


// import { useState } from 'react'
// import api from '../api/axios'
// import { useAuth } from '../context/AuthContext'
//
// export default function LinkCodeforces() {
//     const [open, setOpen]             = useState(false)
//     const [step, setStep]             = useState<'enter' | 'verify'>('enter')
//     const [handle, setHandle]         = useState('')
//     const [problemUrl, setProblemUrl] = useState('')
//     const [loading, setLoading]       = useState(false)
//     const [error, setError]           = useState('')
//     const { refreshUser }             = useAuth()
//
//     const requestChallenge = async () => {
//         if (!handle.trim()) { setError('Enter your handle'); return }
//         setLoading(true); setError('')
//         try {
//             const res = await api.get(`/api/auth/codeforces/challenge?handle=${handle}`)
//             setProblemUrl(res.data.problemUrl)
//             setStep('verify')
//         } catch (err: any) {
//             setError(err.response?.data?.message || 'Handle not found')
//         } finally { setLoading(false) }
//     }
//
//     const verifyAndLink = async () => {
//         setLoading(true); setError('')
//         try {
//             await api.post('/api/user/link-codeforces', { handle })
//             await refreshUser()
//             setOpen(false)
//         } catch (err: any) {
//             setError(err.response?.data?.message || 'Verification failed')
//         } finally { setLoading(false) }
//     }
//
//     if (!open) {
//         return (
//             <div className="bg-blue-950/40 border border-blue-900 rounded-xl px-5 py-3
//                       flex items-center justify-between mb-6">
//         <span className="text-blue-300 text-sm">
//           Link your Codeforces handle to enable Codeforces login
//         </span>
//                 <button onClick={() => setOpen(true)}
//                         className="text-blue-400 hover:text-blue-300 text-sm font-medium transition">
//                     Link now →
//                 </button>
//             </div>
//         )
//     }
//
//     return (
//         <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
//             {step === 'enter' && (
//                 <div className="space-y-3">
//                     <input
//                         type="text"
//                         value={handle}
//                         onChange={e => setHandle(e.target.value)}
//                         placeholder="Your Codeforces handle"
//                         className="w-full bg-gray-800 border border-gray-700 rounded-lg
//                        px-4 py-2 text-white placeholder-gray-500 text-sm
//                        focus:outline-none focus:border-blue-500"
//                     />
//                     {error && <p className="text-red-400 text-sm">{error}</p>}
//                     <div className="flex gap-2">
//                         <button onClick={requestChallenge} disabled={loading}
//                                 className="bg-blue-600 hover:bg-blue-500 text-white text-sm
//                                px-4 py-2 rounded-lg transition">
//                             {loading ? 'Checking...' : 'Continue'}
//                         </button>
//                         <button onClick={() => setOpen(false)}
//                                 className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition">
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}
//
//             {step === 'verify' && (
//                 <div className="space-y-3">
//                     <p className="text-gray-300 text-sm">
//                         Submit code that <span className="text-orange-400">fails to compile</span> to:{' '}
//                         <a href={problemUrl} target="_blank" rel="noopener noreferrer"
//                            className="text-blue-400 underline break-all">{problemUrl}</a>
//                     </p>
//                     {error && <p className="text-red-400 text-sm">{error}</p>}
//                     <button onClick={verifyAndLink} disabled={loading}
//                             className="bg-green-700 hover:bg-green-600 text-white text-sm
//                              px-4 py-2 rounded-lg transition">
//                         {loading ? 'Verifying...' : "I've submitted it — Verify"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     )
// }