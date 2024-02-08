import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import './App.css';

type Expense = {
  id: number;
  title: string;
  amount: string;
  date: string;
};

type ExpensesQueryData = {
  expenses: Expense[];
};

async function getTotalExpenses() {
  const res = await fetch('/api/expenses/total-amount');
  const json = await res.json();
  return json;
}

async function getAllExpenses() {
  const res = await fetch('/api/expenses');
  const json: ExpensesQueryData = await res.json();
  return json;
}

function App() {
  const totalAmountQuery = useQuery({
    queryKey: ['total-amount'],
    queryFn: getTotalExpenses,
  });

  const expensesQuery = useQuery({
    queryKey: ['expenses'],
    queryFn: getAllExpenses,
  });

  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    date: '',
  });

  const [submissionMessage, setSubmissionMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'amount' && isNaN(parseFloat(value))) {
      // If the entered value is not a valid number, don't update the state
      return;
    }

    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: name === 'amount' ? value : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionMessage('Submitting expense...'); // Display submission message

    // Check if the title is entered
    if (!newExpense.title) {
      setSubmissionMessage('Error: Please enter a title.');
      return;
    }

    // Check if the date is selected
    if (!newExpense.date) {
      setSubmissionMessage('Error: Please select a date.');
      return;
    }

    try {
      const amountValue = parseFloat(newExpense.amount);

      // Check if 'amount' is a valid number before submitting
      if (isNaN(amountValue)) {
        setSubmissionMessage('Error: Please enter a valid amount.');
        return;
      }

      await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount),
        }),
      });

      // Wait for the queries to complete
      await Promise.all([
        totalAmountQuery.refetch(),
        expensesQuery.refetch(),
      ]);

      // Clear form fields directly
      setNewExpense({ title: '', amount: '', date: '' });

      // Set success message
      setSubmissionMessage('Expense Submitted!');

    } catch (error) {
      // Display error message
      setSubmissionMessage(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    // Clear form fields when submission is successful
    if (submissionMessage === 'Expense Submitted!') {
      // Clear success message after 3000 milliseconds
      const timeoutId = setTimeout(() => {
        setSubmissionMessage('');
      }, 3000);

      // Clear the timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [submissionMessage]);

  return (
    <div className="w-screen h-screen bg-white dark:bg-black text-black dark:text-white">
      {totalAmountQuery.error ? (
        <div>{totalAmountQuery.error.message}</div>
      ) : totalAmountQuery.isPending ? (
        <div className="flex flex-col max-w-96 m-auto animate-pulse">
          Loading Total Spent ...
        </div>
      ) : (
        <div className="flex flex-col max-w-96 m-auto">
          Total Spent: ${totalAmountQuery.data.total.toFixed(2)}
        </div>
      )}
      <div className="line"></div>
      {expensesQuery.error ? (
        <div>{expensesQuery.error.message}</div>
      ) : expensesQuery.isPending ? (
        <div className="flex flex-col max-w-96 m-auto animate-pulse">
          Loading Expenses ...
        </div>
      ) : (
        <div>
          <h2 className="text-center">Expenses:</h2>
          {expensesQuery.data?.expenses.slice()
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => (
              <div key={expense.id} className="expense-item">
                <div>{expense.date} - {expense.title}:</div>
                <div>${parseFloat(expense.amount).toFixed(2)}</div>
              </div>
            ))}
        </div>
      )}
      <div className="line"></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={newExpense.title}
            onChange={handleInputChange}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"  
            name="amount"
            id="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            className='form-input'
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            name="date"
            id="date"
            value={newExpense.date}
            onChange={handleInputChange}
            className='form-input'
          />
        </div>
        <button type="submit" className="form-button">
          Add Expense
        </button>
        {submissionMessage && <p>{submissionMessage}</p>}
      </form>
    </div>
  );
}

export default App;
