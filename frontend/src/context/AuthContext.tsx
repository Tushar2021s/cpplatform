import { createContext, useContext, useState, useEffect } from 'react'

interface User {
    email: string
    name: string
    avatarUrl: string
}

interface AuthContextType {
    user: User | null
    jwt: string | null
    login: (jwt: string, user: User) => void
    logout: () => void
    isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [jwt, setJwt] = useState<string | null>(null)

    // on app load, restore session from localStorage
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

    return (
        <AuthContext.Provider value={{
            user, jwt, login, logout, isLoggedIn: !!jwt
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