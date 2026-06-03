import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { booksAPI, usersAPI, transactionsAPI } from '../services/api';
import { 
  BookOpen, 
  Users, 
  FileText, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Library,
  CheckCircle,
  Download
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import DueDateBanner from '../components/DueDateBanner';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentBooks, setRecentBooks] = useState([]);
  const [myTransactions, setMyTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (isAdmin) {
          // Admin dashboard data
          const [dashboardStatsRes, recentBooksRes] = await Promise.all([
            usersAPI.getDashboardStats(),
            booksAPI.getBooks({ limit: 5 })
          ]);
          
          setRecentBooks(recentBooksRes.data.books || []);
          setStats(dashboardStatsRes.data);
        } else {
          // User dashboard data
          const [booksRes, transactionsRes] = await Promise.all([
            booksAPI.getBooks({ limit: 6 }),
            usersAPI.getMyTransactions()
          ]);
          
          setRecentBooks(booksRes.data.books || []);
          setMyTransactions(transactionsRes.data || []);
          
          const issuedBooks = transactionsRes.data.filter(t => 
            t.type === 'issue' && t.status === 'approved' && !t.returnedAt
          ).length;
          
          setStats({
            issuedBooks,
            totalTransactions: transactionsRes.data.length,
            pendingRequests: transactionsRes.data.filter(t => t.status === 'pending').length,
            ebookDownloads: transactionsRes.data.filter(t => 
              t.type === 'issue' && t.book?.bookType === 'electronic'
            ).length
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Count due-soon books
  const dueSoonCount = myTransactions.filter(t => {
    if (t.type !== 'issue' || t.status !== 'approved' || t.returnedAt || t.book?.bookType === 'electronic') return false;
    const daysUntilDue = Math.ceil((new Date(t.dueDate) - new Date()) / 86400000);
    return daysUntilDue <= 7 && daysUntilDue > 0;
  }).length;

  const StatCard = ({ icon: Icon, title, value, subtitle, colorClass = 'text-ak-gold' }) => (
    <div className="card page-enter">
      <div className="flex items-center">
        <div className="flex-shrink-0 p-3 rounded-lg bg-ak-mahogany-light">
          <Icon className={`h-5 w-5 ${colorClass}`} />
        </div>
        <div className="ml-4">
          <p className="font-body text-xs font-medium text-ak-ash">{title}</p>
          <p className="font-display text-2xl font-semibold text-ak-parchment">{value}</p>
          {subtitle && (
            <p className="font-body text-[11px] text-ak-gold-dim">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  const BookCard = ({ book }) => (
    <div className="bg-ak-mahogany-dark border border-ak-mahogany-light rounded-ak overflow-hidden hover:border-ak-gold transition-colors">
      <div className="h-20 bg-ak-mahogany-light flex items-center justify-center border-b border-ak-mahogany">
        <BookOpen className="h-7 w-7 text-ak-section-label" />
      </div>
      <div className="p-2.5">
        <div className="flex gap-1 mb-1.5">
          <span className={`text-[9px] font-body font-semibold px-1.5 py-0.5 rounded ${
            book.bookType === 'electronic'
              ? 'bg-success-bg border border-success-dark text-success-dark'
              : 'bg-ak-mahogany-light border border-ak-terracotta text-ak-terracotta'
          }`}>
            {book.bookType === 'electronic' ? 'EBOOK' : 'PHYSICAL'}
          </span>
          <span className={`text-[9px] font-body px-1.5 py-0.5 rounded ${
            book.availability?.availableCopies > 0
              ? 'bg-success-bg text-success'
              : 'bg-ak-mahogany-light text-ak-terracotta'
          }`}>
            {book.availability?.availableCopies > 0 ? 'AVAILABLE' : 'UNAVAILABLE'}
          </span>
        </div>
        <p className="font-display text-sm font-semibold text-ak-parchment mb-0.5 line-clamp-1">{book.title}</p>
        <p className="font-body text-[11px] text-ak-gold-dim mb-2">{book.author}</p>
      </div>
    </div>
  );

  const TransactionItem = ({ transaction }) => {
    const isEbook = transaction.book?.bookType === 'electronic';
    const TypeIcon = isEbook ? Download : BookOpen;

    const getStatusBadge = (status) => {
      const styles = {
        approved: 'bg-success-bg text-success border border-success-dark',
        pending: 'bg-ak-mahogany-light text-ak-gold border border-ak-gold',
        rejected: 'bg-ak-mahogany-light text-ak-terracotta border border-ak-terracotta',
        completed: 'bg-ak-mahogany-light text-ak-ash border border-ak-ash',
      };
      return styles[status] || 'bg-ak-mahogany-light text-ak-ash';
    };

    return (
      <div className="flex items-center justify-between py-3 border-b border-ak-mahogany-light last:border-b-0">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <TypeIcon className={`h-4 w-4 ${isEbook ? 'text-success' : 'text-ak-gold-dim'}`} />
          </div>
          <div>
            <p className="font-body text-xs font-medium text-ak-parchment">
              {transaction.book?.title || 'Book Title'}
            </p>
            <p className="font-body text-[10px] text-ak-gold-dim capitalize">
              {isEbook ? 'Downloaded' : 'Borrowed'} • {new Date(transaction.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-body font-semibold capitalize ${getStatusBadge(transaction.status)}`}>
          {transaction.status}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {!isAdmin && <DueDateBanner transactions={myTransactions} />}
      {/* Header */}
      <div className="mb-6 page-enter">
        <h1 className="font-display text-xl font-semibold text-ak-parchment">
          {getGreeting()}, {user?.firstName}
        </h1>
        <p className="font-body text-xs text-ak-gold-dim mt-0.5">
          {isAdmin 
            ? 'Here\'s an overview of your library system.' 
            : dueSoonCount > 0 
              ? `You have ${dueSoonCount} book${dueSoonCount > 1 ? 's' : ''} due this week`
              : 'Discover and manage your library books.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {isAdmin ? (
          <>
            <StatCard icon={BookOpen} title="Total Books" value={stats.totalBooks || 0} subtitle="In collection" />
            <StatCard icon={Users} title="Total Users" value={stats.totalUsers || 0} subtitle="Registered members" colorClass="text-success" />
            <StatCard icon={Library} title="Available Books" value={stats.availableBooks || 0} subtitle="Ready to borrow" colorClass="text-ak-ash" />
            <StatCard icon={Clock} title="Pending Requests" value={stats.pendingRequests || 0} subtitle="Need approval" colorClass="text-ak-terracotta" />
          </>
        ) : (
          <>
            <StatCard icon={BookOpen} title="Books Issued" value={stats.issuedBooks || 0} subtitle="Currently with you" />
            <StatCard icon={FileText} title="Total Transactions" value={stats.totalTransactions || 0} subtitle="All time" colorClass="text-success" />
            <StatCard icon={Clock} title="Pending Requests" value={stats.pendingRequests || 0} subtitle="Awaiting approval" colorClass="text-ak-terracotta" />
            <StatCard icon={Download} title="Ebook Downloads" value={stats.ebookDownloads || 0} subtitle="All time" colorClass="text-ak-ash" />
          </>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="card page-enter stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-ak-parchment">
              {isAdmin ? 'Recently Added' : 'Available Books'}
            </h2>
            <Library className="h-4 w-4 text-ak-gold-dim" />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {recentBooks.length > 0 ? (
              recentBooks.slice(0, 4).map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <p className="text-ak-gold-dim text-xs text-center py-4 col-span-2">No books available</p>
            )}
          </div>
        </div>

        {/* Recent Activity / Transactions */}
        <div className="card page-enter stagger-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-ak-parchment">
              {isAdmin ? 'Recent Activity' : 'My Transactions'}
            </h2>
            <FileText className="h-4 w-4 text-ak-gold-dim" />
          </div>
          <div>
            {(isAdmin ? [] : myTransactions).length > 0 ? (
              (isAdmin ? [] : myTransactions).slice(0, 5).map((transaction) => (
                <TransactionItem key={transaction._id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-10 w-10 text-ak-mahogany mx-auto mb-3" />
                <p className="text-ak-gold-dim font-body text-xs">
                  {isAdmin ? 'No recent activity' : 'No transactions yet'}
                </p>
                <p className="text-ak-dark-text font-body text-[10px] mt-1">
                  {!isAdmin && 'Start by browsing and requesting books'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;