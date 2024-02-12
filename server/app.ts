import { Hono } from "hono";
import { logger } from "hono/logger";
// import { fakeExpenses } from "./fakedb";
// import type { Expense } from "./fakedb";

const app = new Hono();

app.use("*", logger());

// export const expensesRoute = new Hono()
//   .get("/", async (c) => {
//     await new Promise(resolve => setTimeout(resolve, 5000));

//     return c.json({ expenses: fakeExpenses });
//   })
//   .post("/", async (c) => {
//     // const expense = await c.req.json();
//     const expense: Expense = await c.req.json();
//     expense.date = new Date(expense.date);
//     console.log('New expense: ', expense);   
//     expense.id = fakeExpenses.length + 1; 
//     fakeExpenses.push(expense);

//     return c.json({ expense: expense }, 201);
//   })
//   .get("/total-amount", async (c) => {
//     const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
//     return c.json({ total: total });
//   })
//   .get("/:id{[0-9]+}", async (c) => {
//     const id = Number.parseInt(c.req.param("id"));
//     const expense = fakeExpenses.find((e) => e.id === id);
//     if (!expense) {
//       return c.json({ error: "Expense not found" }, 404);
//     }
//     return c.json({ expense });
//   })
//   .delete("/:id{[0-9]+}", async (c) => {
//     const id = Number.parseInt(c.req.param("id"));
//     const expense = fakeExpenses.find((e) => e.id === id);
//     if (!expense) {
//       return c.json({ error: "Expense not found" }, 404);
//     }
//     const index = fakeExpenses.indexOf(expense);
//     fakeExpenses.splice(index, 1);
//     return c.json({ expense });
//   });





import { expenses as expensesTable } from "./db/schema/expenses";
import { db } from "./db";
import { desc, eq, sum } from "drizzle-orm"

// ...

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    const expenses = await db.select().from(expensesTable).orderBy(desc(expensesTable.createdAt));
    return c.json({ expenses: expenses });
  })
  .post("/", async (c) => {
    const body = await c.req.json();

    const dbExpense = await db
      .insert(expensesTable)
      .values({ ...body, userId: "fake-user-id" })
      .returning();

    return c.json({ expense: dbExpense }, 201);
  })
  .get("/total-amount", async (c) => {
    const result = await db
      .select({ value: sum(expensesTable.amount) })
      .from(expensesTable)
      .limit(1)
      .then((r) => r[0]);
    return c.json({ total: result.value });
  })

app.route("/api/expenses", expensesRoute)

export default app;