import React from 'react';

const DueDateBadge = ({ dueDate }) => {
  if (!dueDate) return null;

  const now = new Date();
  const dueDateObj = new Date(dueDate);
  const daysUntilDue = Math.ceil((dueDateObj - now) / 86400000);

  let badgeStyle = '';
  let badgeText = '';

  if (daysUntilDue <= 0) {
    badgeStyle = 'bg-red-100 text-red-800';
    badgeText = 'OVERDUE';
  } else if (daysUntilDue <= 1) {
    badgeStyle = 'bg-orange-100 text-orange-800';
    badgeText = 'Due Tomorrow';
  } else if (daysUntilDue <= 3) {
    badgeStyle = 'bg-yellow-100 text-yellow-800';
    badgeText = `Due in ${daysUntilDue} days`;
  } else {
    badgeStyle = 'bg-gray-100 text-gray-800';
    badgeText = `Due: ${dueDateObj.toLocaleDateString()}`;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ml-2 ${badgeStyle}`}>
      {badgeText}
    </span>
  );
};

export default DueDateBadge;
