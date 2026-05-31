import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Clock, X } from 'lucide-react';

const DueDateBanner = ({ transactions }) => {
  const [dismissedIds, setDismissedIds] = useState([]);

  if (!transactions || transactions.length === 0) return null;

  const now = new Date();

  // Filter for physical book transactions:
  // type: 'issue', status: 'approved', has a dueDate, not electronic, and not returned
  const physicalTransactions = transactions.filter(t => 
    t.type === 'issue' &&
    t.status === 'approved' &&
    t.dueDate &&
    t.book?.bookType !== 'electronic' &&
    !t.returnedAt
  );

  // Map to include daysUntilDue and filter for books due within 5 days
  const upcomingTransactions = physicalTransactions
    .map(t => {
      const dueDate = new Date(t.dueDate);
      const daysUntilDue = Math.ceil((dueDate - now) / 86400000);
      return { ...t, daysUntilDue, dueDate };
    })
    .filter(t => t.daysUntilDue <= 5);

  // If no upcoming due dates within 5 days, return null
  if (upcomingTransactions.length === 0) return null;

  // Filter out dismissed banners
  const visibleTransactions = upcomingTransactions.filter(t => !dismissedIds.includes(t._id));

  // If all banners are dismissed, return null
  if (visibleTransactions.length === 0) return null;

  const handleDismiss = (id) => {
    setDismissedIds(prev => [...prev, id]);
  };

  return (
    <div className="space-y-3 mb-6 w-full">
      {visibleTransactions.map((t) => {
        let bannerStyle = '';
        let Icon = null;
        let message = '';

        if (t.daysUntilDue <= 0) {
          bannerStyle = 'bg-red-50 border-red-500 text-red-800';
          Icon = AlertCircle;
          message = `OVERDUE: ${t.book?.title || 'Book'} was due on ${t.dueDate.toLocaleDateString()}. You may be accumulating fines.`;
        } else if (t.daysUntilDue <= 1) {
          bannerStyle = 'bg-orange-50 border-orange-500 text-orange-800';
          Icon = AlertTriangle;
          message = `${t.book?.title || 'Book'} is due TOMORROW — please return it to your library.`;
        } else if (t.daysUntilDue <= 3) {
          bannerStyle = 'bg-yellow-50 border-yellow-500 text-yellow-800';
          Icon = Clock;
          message = `${t.book?.title || 'Book'} is due in ${t.daysUntilDue} days on ${t.dueDate.toLocaleDateString()}.`;
        } else {
          // If daysUntilDue is 4 or 5, we don't show a banner per the specific banner styles in requirements
          return null;
        }

        return (
          <div
            key={t._id}
            className={`flex items-start justify-between p-4 border-l-4 rounded-md shadow-sm transition-all duration-200 ${bannerStyle}`}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{message}</p>
            </div>
            <button
              onClick={() => handleDismiss(t._id)}
              className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default DueDateBanner;
