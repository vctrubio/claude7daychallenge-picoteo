import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for your order. We'll process it and get back to you soon.
            </p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/shops" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <br />
            <Link 
              href="/" 
              className="inline-block text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}