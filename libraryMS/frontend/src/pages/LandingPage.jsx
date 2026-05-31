import React from 'react';
import { Link } from 'react-router-dom';
import { Library, BookOpen, Download, Search } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Library className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">University Library</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/catalog" className="btn-secondary">
              Browse Catalog
            </Link>
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
            <span className="block">Discover Knowledge</span>
            <span className="block text-primary-600">Empower Your Future</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mb-8">
            Access thousands of physical books, electronic resources, and academic materials. Your gateway to unlimited learning starts here.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/catalog" className="btn-primary text-lg px-8 py-3">
              Browse Catalog
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3 bg-white">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse our catalog</h3>
              <p className="text-gray-600">
                Explore our extensive collection of materials across various disciplines and genres.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Borrow physical books</h3>
              <p className="text-gray-600">
                Reserve and borrow physical copies from our library locations with easy pickup.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Download ebooks</h3>
              <p className="text-gray-600">
                Instantly access and download electronic materials directly to your devices.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer text */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p className="text-sm">Library Management System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
