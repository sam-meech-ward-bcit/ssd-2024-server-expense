import {
  pgTable,
  text,
  varchar,
  timestamp,
  numeric,
  serial,
  date,
} from "drizzle-orm/pg-core";

export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: date("date", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});