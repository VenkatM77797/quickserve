import "./css/Bill.css";

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
    <div className="bill-container">
      
      {/* Header */}
      <h2 className="bill-title">Bill</h2>

      {/* Table info */}
      {selectedTable && (
        <p className="bill-table">
          Table: <strong>{selectedTable.tableNumber}</strong>
        </p>
      )}

      {/* Items */}
      {cart.map((item) => (
        <div key={item.id} className="bill-item">
          <span>
            {item.name} x {item.qty}
          </span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      <hr className="bill-divider" />

      {/* Total */}
      <div className="bill-total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
}

export default Bill;