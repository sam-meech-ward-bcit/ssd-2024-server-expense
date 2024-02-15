export type Expense = {
  id: number,
  title: string,
  amount: number,
  date: string
}
export const fakeExpenses: Expense[] = [
  {
    id: 1,
    title: "Food",
    amount: 10,
    date: "2021-01-01"
  },
  {
    id: 2,
    title: "Transport",
    amount: 5,
    date: "2021-01-02"
  }
]
