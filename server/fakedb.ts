export type Expense = {
    id: number,
    title: string,
    amount: number,
    date: Date
};

export const fakeExpenses: Expense[] = [
    {
        id: 1,
        title: "Food",
        amount: 10,
        date: new Date(Date.UTC(2024, 1, 1)) 
    },
    {
        id: 2,
        title: "Transport",
        amount: 5,
        date: new Date(Date.UTC(2024, 1, 1)) 
    }
];
