import { ExpenseEditClient } from "@/components/ExpenseEditClient";

// Next 15.4.1: params is a Promise — read it in a server component only.
export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExpenseEditClient id={id} />;
}
