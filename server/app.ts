import { Hono } from "hono";
import { logger } from "hono/logger";
import { fakeExpenses } from "./fakedb";
import { serveStatic } from "hono/bun";

import { expenses as expensesTable } from "./db/schema/expenses";
import { db } from "./db";
import { desc, eq, sum } from "drizzle-orm";

const app = new Hono();

app.use("*", logger());

type Expense = {
  title: string;
  amount: string;
  date: string;
};

export const expensesRoute = new Hono()
  .get("/", async (c) => {
    const expenses = await db.select().from(expensesTable);
    return c.json({ expenses });
  })
  .post("/", async (c) => {
    const userId = "fake-user-id"
    const expense: Expense = await c.req.json();

    const databaseExpense = await db
      .insert(expensesTable)
      .values({...expense, userId})
      .returning()
      .then((rows) => rows[0]);

    return c.json({ expense: databaseExpense }, 201);
  })
  .get("/total-amount", async (c) => {
    const total = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .then((rows) => rows[0]);

    return c.json(total);
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.json({ error: "Expense not found" }, 404);
    }
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const expense = fakeExpenses.find((e) => e.id === id);
    if (!expense) {
      return c.json({ error: "Expense not found" }, 404);
    }
    const index = fakeExpenses.indexOf(expense);
    fakeExpenses.splice(index, 1);
    return c.json({ expense });
  });

app.route("/api/expenses", expensesRoute);

app.get("*", serveStatic({ root: "./frontend/dist" }));
app.get("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
