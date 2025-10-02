import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">E-commerce MVP</h1>
          <p className="text-gray-600">Browse shops and products</p>
        </header>
        
        <main>
          <Link 
            href="/shops" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Shops
          </Link>
        </main>
      </div>
    </div>
  );
}
