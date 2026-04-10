type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type Table = {
  id: number;
  tableNumber: number;
};

type Props = {
  cart: CartItem[];
  total: number;
  selectedTable?: Table | null;
};

function Bill({ cart, total, selectedTable }: Props) {
  return (
    <div
      style={{
        marginTop: 15,
        padding: 16,
        border: "1px solid #ccc",
        borderRadius: 15,
        background: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}>
      {/* Header */}
      <h2 style={{ marginBottom: 10 }}>Bill</h2>

      {/* Table info */}
      {selectedTable && (
        <p style={{ marginBottom: 10 }}>
          Table: <strong>{selectedTable.tableNumber}</strong>
        </p>
      )}

      {/* Items */}
      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span>
            {item.name} x {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr style={{ margin: "10px 0" }} />

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}

export default Bill;