import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';

export const useOverdueCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchOverdueCount = async () => {
      try {
        const response = await usersAPI.getMyTransactions();
        const transactions = response.data || [];
        const now = new Date();
        
        const overdueTransactions = transactions.filter(t => 
          t.type === 'issue' &&
          t.status === 'approved' &&
          t.dueDate &&
          new Date(t.dueDate) < now &&
          !t.returnedAt
        );
        
        setCount(overdueTransactions.length);
      } catch (error) {
        console.error('Error fetching overdue count:', error);
        setCount(0);
      }
    };

    fetchOverdueCount();
  }, []);

  return count;
};

export default useOverdueCount;
