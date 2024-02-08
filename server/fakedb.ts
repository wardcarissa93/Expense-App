export type Expense = {
    id: number,
    title: string,
    amount: number,
    date: Date
}
export const fakeExpenses: Expense[] = [
    {
        id: 1,
        title: "Food",
        amount: 10,
        date: new Date("2024-02-01")
    },
    {
        id: 2,
        title: "Transport",
        amount: 5,
        date: new Date("2024-02-01")
    }
]