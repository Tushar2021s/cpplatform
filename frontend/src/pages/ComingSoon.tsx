import Navbar from '../components/Navbar'

export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="text-4xl mb-4">🚧</div>
                <h1 className="text-xl font-bold mb-2">{title}</h1>
                <p className="text-gray-500">Coming soon — building this next.</p>
            </div>
        </div>
    )
}