import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { 
  Search, 
  BookOpen, 
  Library,
  Book,
  Download,
  Users,
  Star,
  Eye,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const PublicCatalog = () => {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, physical, electronic
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchBooks();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await publicAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchBooks = async (query = '') => {
    try {
      setLoading(true);
      let res;
      if (query) {
        res = await publicAPI.searchBooks(query);
        setBooks(res.data || []);
      } else {
        res = await publicAPI.getBooks({ limit: 50 }); // Adjust as needed
        setBooks(res.data?.books || []);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleBookSelect = async (book) => {
    try {
      // Optional: fetch full book details if needed
      // const res = await publicAPI.getBook(book._id);
      // setSelectedBook(res.data);
      setSelectedBook(book);
      setShowDetailsModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBooks = books.filter((book) => {
    if (filter === 'all') return true;
    if (filter === 'electronic' && book.fileUrl) return true;
    if (filter === 'physical' && !book.fileUrl) return true;
    return false;
  });

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
      <div className={`p-4 rounded-lg ${colorClass}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{statsLoading ? '-' : value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Library className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">University Library</span>
          </Link>
          <div className="flex space-x-4">
            <Link to="/login" className="btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Stats Section */}
      <div className="bg-primary-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Public Catalog
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-primary-100 sm:mt-4">
              Explore our collection of resources
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Books" 
              value={stats?.totalBooks || 0} 
              icon={Library} 
              colorClass="bg-blue-100 text-blue-600" 
            />
            <StatCard 
              title="Available Physical" 
              value={stats?.availablePhysicalBooks || 0} 
              icon={Book} 
              colorClass="bg-green-100 text-green-600" 
            />
            <StatCard 
              title="Electronic Books" 
              value={stats?.totalEbooks || 0} 
              icon={Download} 
              colorClass="bg-purple-100 text-purple-600" 
            />
            <StatCard 
              title="Active Members" 
              value={stats?.totalMembers || 0} 
              icon={Users} 
              colorClass="bg-orange-100 text-orange-600" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm text-base"
            />
          </div>
          
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            {['all', 'physical', 'electronic'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                  filter === f 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                <div className="aspect-w-3 aspect-h-4 relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {book.fileUrl ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm flex items-center">
                        <Download className="w-3 h-3 mr-1" /> Electronic
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium shadow-sm flex items-center">
                        <Book className="w-3 h-3 mr-1" /> Physical
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  
                  <div className="flex items-center justify-between mb-3 mt-auto">
                    <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {book.genre}
                    </span>
                  </div>

                  <div className="mb-4">
                    {book.fileUrl ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available to Download
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        book.availability?.availableCopies > 0 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availability?.availableCopies > 0 
                          ? `${book.availability.availableCopies} Available` 
                          : 'Not Available'
                        }
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleBookSelect(book)}
                      className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/login', { state: { from: '/catalog', bookId: book._id } })}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      Borrow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Book Details Modal */}
      {showDetailsModal && selectedBook && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowDetailsModal(false)} />
            
            <div className="relative bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    {selectedBook.coverImage ? (
                      <img 
                        src={selectedBook.coverImage} 
                        alt={selectedBook.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedBook.title}</h2>
                  <p className="text-lg text-gray-600 mb-4">by {selectedBook.author}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded">
                        {selectedBook.genre}
                      </span>
                      {selectedBook.fileUrl ? (
                        <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded flex items-center">
                          <Download className="w-4 h-4 mr-1" /> Electronic Resource
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded flex items-center">
                          <Book className="w-4 h-4 mr-1" /> Physical Copy
                        </span>
                      )}
                    </div>

                    {selectedBook.description && (
                      <p className="text-gray-700">{selectedBook.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                      {selectedBook.publisher && (
                        <div>
                          <span className="font-medium text-gray-500">Publisher:</span>
                          <p className="text-gray-900">{selectedBook.publisher}</p>
                        </div>
                      )}
                      {selectedBook.isbn && (
                        <div>
                          <span className="font-medium text-gray-500">ISBN:</span>
                          <p className="text-gray-900">{selectedBook.isbn}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
                      <div>
                        {selectedBook.fileUrl ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Available to Download
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedBook.availability?.availableCopies > 0 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedBook.availability?.availableCopies > 0 
                              ? `${selectedBook.availability.availableCopies} of ${selectedBook.availability.totalCopies} available` 
                              : 'Not Available'}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => setShowDetailsModal(false)}
                          className="btn-secondary"
                        >
                          Close
                        </button>
                        <button 
                          onClick={() => navigate('/login', { state: { from: '/catalog', bookId: selectedBook._id } })}
                          className="btn-primary flex items-center space-x-2 px-6"
                        >
                          <span>Login to Borrow</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCatalog;
