import useAuth from "@/features/auth/hooks/use-auth";

export default function InventoryPage() {
  const { user } = useAuth();
  return <div>Inventory: {user?.username}</div>;
}
