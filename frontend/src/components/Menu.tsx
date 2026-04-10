function Menu({ categories, addItem }: any) {
  return (
    <div
      style={{
        background: "#e5eaf5",
        padding: 20,
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}>
      {/* Title */}
      <h3
        style={{
          color: "#8458B3",
          marginBottom: 20,
        }}>
        Menu
      </h3>

      {/*Categories */}
      {categories.map((cat: any) => (
        <div
          key={cat.id}
          style={{
            marginBottom: 20,
            background: "white",
            padding: 15,
            borderRadius: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}>
          {/* Category name */}
          <h4
            style={{
              color: "#a28089",
              marginBottom: 10,
            }}>
            {cat.name}
          </h4>

          {/*items */}
          {cat.items.map((item: any) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: "1px solid #ddd",
              }}>

              {/* Item name + price */}
              <span>
                {item.name} ₹{item.price}
              </span>

              <button
                onClick={() => addItem(item)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  backgroundColor: "#a0d2eb",
                  color: "#333",
                  cursor: "pointer",
                  fontSize: 14,
                  transition: "0.3s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                + Add
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Menu;