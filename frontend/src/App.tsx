import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type ExpenseTotal = {
  total: string;
};

async function getTotalExpenses() {
  const res = await fetch("/api/expenses/total-amount");
  const json: ExpenseTotal = await res.json();
  return json;
}

type Expense = {
  id: number;
  title: string;
  amount: string;
  date: string;
};

type ExpensesResponse = {
  expenses: Expense[];
};

async function getAllExpenses() {
  const res = await fetch("/api/expenses");
  const json: ExpensesResponse = await res.json();
  return json;
}

function App() {
  const totalAmountQuery = useQuery({
    queryKey: ["total-amount"],
    queryFn: getTotalExpenses,
  });

  const allExpensesQuery = useQuery({
    queryKey: ["all-expenses"],
    queryFn: getAllExpenses,
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const submitExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting the form", title, amount, date);


    // handle error and loading states
    await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, amount, date }),
    });

    allExpensesQuery.refetch();
    totalAmountQuery.refetch();
  };

  return (
    <div className="w-screen h-screen bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-center">Expenses</h1>

      {totalAmountQuery.error ? (
        <div>{totalAmountQuery.error.message}</div>
      ) : totalAmountQuery.isPending ? (
        <div className="flex flex-col max-w-96 m-auto animate-pulse">
          Total Spent ...
        </div>
      ) : (
        <div className="flex flex-col max-w-96 m-auto">
          Total Spent {totalAmountQuery.data.total}
        </div>
      )}

      {allExpensesQuery.error ? (
        <div>{allExpensesQuery.error.message}</div>
      ) : allExpensesQuery.isPending ? (
        <div className="flex flex-col max-w-96 m-auto animate-pulse">
          All Expenses ....
        </div>
      ) : (
        <div className="flex flex-col max-w-96 m-auto">
          <h2 className=" text-2xl pt-6">All expenses</h2>
          {allExpensesQuery.data.expenses.map((expense) => (
            <div key={expense.id} className="flex justify-between">
              <div>{expense.title}</div>
              <div>{expense.amount}</div>
              <div>{expense.date}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col max-w-96 m-auto">
        <h2 className=" text-2xl pt-6">Create a new expense</h2>

        <form
          className="flex flex-col max-w-96 m-auto"
          onSubmit={submitExpense}
        >
          <label htmlFor="title">Title</label>
          <input
          className="text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="title"
            name="title"
          />

          <label htmlFor="amount">Amount</label>
          <input
          className="text-black"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            id="amount"
            name="amount"
          />

          <label htmlFor="date">Date</label>
          <input
          className="text-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            id="date"
            name="date"
          />

          <button type="submit">Create Expense</button>
        </form>
      </div>
    </div>
  );
}

export default App;
