function Cart({
  cart,
  removeItem,
  total,
  clearCart,
  placeOrder,
}: any) {
  return (
    <div
      style={{
        background: "#e5eaf5",
        padding: 20,
        borderRadius: 12,
        fontFamily: "Poppins, sans-serif",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
      }}>
      {/* Title */}
      <h3
        style={{
          color: "#8458B3",
          marginBottom: 15,
        }}>
        Cart
      </h3>

      {/* display empty cart msg in bg */}
      {cart.length === 0 && (
        <p style={{ color: "#777" }}>No items added</p>
      )}

      {/* Cart items */}
      {cart.map((item: any) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
            padding: 10,
            background: "white",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
          {/* Item name + quantity */}
          <span>
            {item.name} x {item.qty}
          </span>

          {/* Remove button */}
          <button
            onClick={() => removeItem(item.id)}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              backgroundColor: "#d0bdf4",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",   
            }}>
            -
          </button>
        </div>
      ))}

      {/* Total */}
      <h3
        style={{
          marginTop: 15,
          color: "#333",
        }}>
        Total: ₹{total}
      </h3>

      {/*Clear Cart btn */}
      <button
        onClick={clearCart}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: 10,
          borderRadius: 8,
          border: "none",
          backgroundColor: "#a28089",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
        Clear Cart
      </button>

      {/* Place Order btn */}
      <button
        onClick={placeOrder}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: 10,
          borderRadius: 8,
          border: "none",
          backgroundColor: "#a0d2eb",
          color: "#333",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
        Place Order
      </button>
    </div>
  );
}

export default Cart;