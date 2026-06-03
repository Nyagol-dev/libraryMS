import React from 'react';

const DueDateBadge = ({ dueDate }) => {
  if (!dueDate) return null;

  const now = new Date();
  const dueDateObj = new Date(dueDate);
  const daysUntilDue = Math.ceil((dueDateObj - now) / 86400000);

  let badgeStyle = '';
  let badgeText = '';

  if (daysUntilDue <= 0) {
    badgeStyle = 'bg-ak-mahogany-light border border-ak-terracotta text-ak-terracotta';
    badgeText = 'OVERDUE';
  } else if (daysUntilDue <= 1) {
    badgeStyle = 'bg-ak-mahogany-light border border-ak-terracotta text-[#C4862D]';
    badgeText = 'Due Tomorrow';
  } else if (daysUntilDue <= 3) {
    badgeStyle = 'bg-ak-mahogany-light border border-ak-gold text-ak-gold';
    badgeText = `Due in ${daysUntilDue} days`;
  } else {
    badgeStyle = 'bg-ak-mahogany-light text-ak-ash';
    badgeText = `Due: ${dueDateObj.toLocaleDateString()}`;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-body font-semibold ml-2 ${badgeStyle}`}>
      {badgeText}
    </span>
  );
};

export default DueDateBadge;
