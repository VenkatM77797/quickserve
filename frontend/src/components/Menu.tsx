import "./css/Menu.css";

function Menu({ categories, addItem }: any) {
  return (
    <div className="menu-container">
      <h3 className="menu-title">Menu</h3>

      {categories.map((cat: any) => (
        <div key={cat.id} className="menu-category">
          <h4 className="menu-category-title">{cat.name}</h4>

          {cat.items.map((item: any) => (
            <div key={item.id} className="menu-item">
              <span>
                {item.name} ₹{item.price}
              </span>

              <button
                onClick={() => addItem(item)}
                className="menu-add-btn">
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