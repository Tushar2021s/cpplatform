import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

interface User {
    email: string
    name: string
    avatarUrl: string
    codeforcesHandle?: string
}

interface AuthContextType {
    user: User | null
    jwt: string | null
    login: (jwt: string, user: User) => void
    logout: () => void
    refreshUser: () => Promise<void>
    isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [jwt, setJwt] = useState<string | null>(null)

    useEffect(() => {
        const storedJwt  = localStorage.getItem('jwt')
        const storedUser = localStorage.getItem('user')
        if (storedJwt && storedUser) {
            setJwt(storedJwt)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = (newJwt: string, newUser: User) => {
        localStorage.setItem('jwt', newJwt)
        localStorage.setItem('user', JSON.stringify(newUser))
        setJwt(newJwt)
        setUser(newUser)
    }

    const logout = () => {
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
        setJwt(null)
        setUser(null)
    }

    // re-fetch profile from backend — used after linking a CF handle
    const refreshUser = async () => {
        try {
            const res = await api.get('/api/user/profile')
            const updated: User = {
                email: res.data.email,
                name: res.data.name,
                avatarUrl: res.data.avatarUrl,
                codeforcesHandle: res.data.codeforcesHandle,
            }
            localStorage.setItem('user', JSON.stringify(updated))
            setUser(updated)
        } catch (e) {
            console.error('Failed to refresh user', e)
        }
    }

    return (
        <AuthContext.Provider value={{
            user, jwt, login, logout, refreshUser, isLoggedIn: !!jwt
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}