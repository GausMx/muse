export default function OrderTable({ orders }) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th className="border p-2">Order ID</th>
          <th className="border p-2">Customer</th>
          <th className="border p-2">Items</th>
          <th className="border p-2">Total</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o._id}>
            <td className="border p-2">{o._id}</td>
            <td className="border p-2">{o.user.name}</td>
            <td className="border p-2">{o.items.length}</td>
            <td className="border p-2">${o.total}</td>
            <td className="border p-2">{o.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
