import type Order_Cart_Item from "../../types/order-cart";
export const useOrderCart = () => {
  const cart_items = useState<Order_Cart_Item[]>("order-cart-items", () => []);

  const add_to_cart = (item: Order_Cart_Item) => {
    //   checks if the item already exists
    const find_item = cart_items.value.find(
      (cart_item) => item.menuItemId == cart_item.menuItemId
    );

    if (find_item) {
      //quantity increases by 1 if item already exists
      find_item.quantity++;
    } else {
      //if no item is found... in cart it adds to cart
      cart_items.value.push(item);
    }
  };

  const remove_from_cart = (item: Order_Cart_Item) => {
    // filters the cart without the item to be removed
    const filtered_items = cart_items.value.filter(
      (cart_item) => item.menuItemId !== cart_item.menuItemId
    );

    cart_items.value = filtered_items;
  };

  return {
    cart_items,
    add_to_cart,
    remove_from_cart,
  };
};
