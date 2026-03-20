import type Order_Cart_Item from "../../types/order-cart";
export const useOrderCart = () => {
  const cart_items = useState<Order_Cart_Item[]>("order-cart-items", () => []);

  const find_cart_item = (menuItemId: string) => {
    return cart_items.value.find((item) => item.menuItemId === menuItemId);
  };

  const quantity_for_menu_item = (menuItemId: string) => {
    return cart_items.value
      .filter((item) => item.menuItemId === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const subtotal_cents = computed(() =>
    cart_items.value.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    ),
  );

  const total_item_count = computed(() =>
    cart_items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  const add_to_cart = (item: Order_Cart_Item) => {
    // checks if the item already exists
    const find_item = find_cart_item(item.menuItemId);

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
      (cart_item) => item.menuItemId !== cart_item.menuItemId,
    );

    cart_items.value = filtered_items;
  };

  const increase_quantity = (item_in_cart: Order_Cart_Item) => {
    const find_item = find_cart_item(item_in_cart.menuItemId);

    if (!find_item) {
      return;
    }

    find_item.quantity++;
  };

  const decrease_quantity = (item_in_cart: Order_Cart_Item) => {
    const find_item = find_cart_item(item_in_cart.menuItemId);

    if (!find_item) {
      return;
    }

    if (find_item.quantity > 1) {
      find_item.quantity--;
      return;
    }

    remove_from_cart(find_item);
  };

  const empty_cart = () => {
    cart_items.value = [];
  };
  return {
    cart_items,
    find_cart_item,
    quantity_for_menu_item,
    subtotal_cents,
    total_item_count,
    add_to_cart,
    empty_cart,
    remove_from_cart,
    increase_quantity,
    decrease_quantity,
  };
};
