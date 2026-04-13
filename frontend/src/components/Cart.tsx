import "./css/Cart.css";

function Cart({
  cart,
  removeItem,
  total,
  clearCart,
  placeOrder,
}: any) {
  return (
    <div className="cart-container">
      <h3 className="cart-title">Cart</h3>

      {cart.length === 0 && (
        <p className="cart-empty">No items added</p>
      )}

      {cart.map((item: any) => (
        <div key={item.id} className="cart-item">
          <span>
            {item.name} x {item.qty}
          </span>

          <button
            onClick={() => removeItem(item.id)}
            className="cart-remove-btn">
            -
          </button>
        </div>
      ))}

      <h3 className="cart-total">Total: ₹{total}</h3>

      <button
        onClick={clearCart}
        className="cart-btn cart-clear-btn">
        Clear Cart
      </button>

      <button
        onClick={placeOrder}
        className="cart-btn cart-place-btn">
        Place Order
      </button>
    </div>
  );
}

export default Cart;