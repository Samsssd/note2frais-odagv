import { ExpenseDetailClient } from "@/components/ExpenseDetailClient";

// Next 15.4.1: params is a Promise — read it in a server component only.
export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExpenseDetailClient id={id} />;
}
