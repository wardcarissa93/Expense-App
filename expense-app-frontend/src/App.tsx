import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';

type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
};

type ExpensesQueryData = {
  expenses: Expense[];
};

async function getTotalExpenses() {
  const res = await fetch("/api/expenses/total-amount");
  const json = await res.json();
  return json;
}

async function getAllExpenses() {
  const res = await fetch("/api/expenses");
  const json: ExpensesQueryData = await res.json();
  return json;
}

function App() {
  const totalAmountQuery = useQuery({
    queryKey: ["total-amount"],
    queryFn: getTotalExpenses,
  });

  const expensesQuery = useQuery({
    queryKey: ['expenses'],
    queryFn: getAllExpenses,
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);

  return (
    <div className="w-screen h-screen bg-white dark:bg-black text-black dark:text-white">
      {totalAmountQuery.error ? (
        <div>{totalAmountQuery.error.message}</div>
      ) : totalAmountQuery.isPending ? (
        <div className="flex flex-col max-w-96 m-auto animate-pulse">
          Total Spent ...
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
          Expenses ...
        </div>
      ) : (
        <div>
          <h2 className="text-center">Expenses:</h2>
          {expensesQuery.data?.expenses.map((expense) => (
            <div key={expense.id}>
              {expense.title}: ${expense.amount.toFixed(2)}
            </div>
          ))}
        </div>
      )}
      <div className="line"></div>
      <ExpenseForm
        onAddExpense={(newExpense) => {
          setExpenses([...expenses, newExpense]);
        }}
      />
    </div>
  );
}

export default App;
