import React, { useState } from 'react';
import { Expense, fakeExpenses } from "../../../server/fakedb";

type ExpenseFormProps = {
    onAddExpense: (expense: Expense) => void;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    const handleAddExpense = () => {
        // Convert the date to the format YYYY-MM-DD
        const formattedDate = new Date(date).toISOString().split('T')[0];

        const newExpense: Expense = {
            id: fakeExpenses.length + 1,
            title,
            amount: parseFloat(amount),
            date: formattedDate,
        };
        onAddExpense(newExpense);
        // Clear form fields after adding expense
        setTitle('');
        setAmount('');
        setDate('');
    };

    return (
        <div>
            <h2 className="text-center">Add New Expense:</h2>
            <div>
                <label htmlFor="title">Title:</label>
                <input 
                    type="text" 
                    value={title} 
                    name="title" 
                    id="title" 
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="amount">Amount:</label>
                <input 
                    type="number"
                    min="0"
                    value={amount}
                    name="amount"
                    id="amount"
                    onChange={(e) => setAmount(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="date">Date:</label>
                <input 
                    type="date"
                    value={date}
                    name="date"
                    id="date"
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div>
            <button onClick={handleAddExpense}>Add Expense</button>
        </div>
    );
};

export default ExpenseForm;
