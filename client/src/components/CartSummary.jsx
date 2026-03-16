import { useCart } from "../context/CartContext";

export function CartSummary() {
  const { totals } = useCart();

  return (
    <div className="p-6 rounded-2xl shadow bg-white space-y-3">
      <h3 className="text-xl font-semibold">Summary</h3>
      <div className="flex justify-between">
        <span>Items</span>
        <span>{totals.items}</span>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Subtotal</span>
        <span>${totals.subtotal.toFixed(2)}</span>
      </div>
      <button className="w-full bg-black text-white py-3 rounded-2xl">
        Checkout
      </button>
    </div>
  );
}