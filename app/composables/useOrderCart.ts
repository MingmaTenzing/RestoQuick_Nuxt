import type Order_Cart_Item from "../../types/order-cart";
export const useOrderCart = () => {
  const cart_items = useState<Order_Cart_Item[]>("order-cart-items", () => []);

  // Helper: create a unique string for selected options (order doesn't matter)
  // This lets us compare two cart items by their options, even if the order is different
  const optionsSignature = (item: Order_Cart_Item) =>
    [...item.selected_options]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((o) => `${o.id}:${o.quantity}`)
      .join("|");

  // Helper: check if two cart items are the same variant (menu, options, instructions)
  // This is VALUE-based, not reference-based
  const isSameCartVariant = (a: Order_Cart_Item, b: Order_Cart_Item) =>
    a.menuItemId === b.menuItemId &&
    optionsSignature(a) === optionsSignature(b) &&
    (a.specialInstructions ?? "") === (b.specialInstructions ?? "");

  // Sum selected options total for a given cart item (in cents)
  const options_total_cents = (item: Order_Cart_Item) =>
    item.selected_options.reduce(
      (sum, opt) => sum + (opt.priceCents || 0) * (opt.quantity || 1),
      0,
    );

  // Row total (base + options) * quantity (in cents)
  const row_total_cents = (item: Order_Cart_Item) =>
    (item.unitPrice + options_total_cents(item)) * item.quantity;

  const find_cart_item = (provided_item: Order_Cart_Item) => {
    return cart_items.value.find((item) =>
      isSameCartVariant(item, provided_item),
    );
  };

  const quantity_for_menu_item = (menuItemId: string) => {
    return cart_items.value
      .filter((item) => item.menuItemId === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Subtotal in cents including selected option prices
  const subtotal_cents = computed(() =>
    cart_items.value.reduce((sum, item) => sum + row_total_cents(item), 0),
  );

  const total_item_count = computed(() =>
    cart_items.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  // Add to cart: if same variant exists, increase quantity, else add new row
  const add_to_cart = (item: Order_Cart_Item) => {
    const find_item = find_cart_item(item);
    if (find_item) {
      // If same variant exists, just increase quantity
      find_item.quantity++;
    } else {
      // Otherwise, add as new cart row
      cart_items.value.push(item);
    }
    // For debugging
    console.log(item);
  };

  // Remove only the exact variant from cart
  const remove_from_cart = (item: Order_Cart_Item) => {
    cart_items.value = cart_items.value.filter(
      (cart_item) => !isSameCartVariant(cart_item, item),
    );
  };

  // Increase quantity for the exact variant
  const increase_quantity = (item_in_cart: Order_Cart_Item) => {
    const find_item = find_cart_item(item_in_cart);
    if (!find_item) return;
    find_item.quantity++;
  };

  // Decrease quantity for the exact variant, remove if reaches 0
  const decrease_quantity = (item_in_cart: Order_Cart_Item) => {
    const find_item = find_cart_item(item_in_cart);
    if (!find_item) return;
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
    optionsSignature,
    options_total_cents,
    row_total_cents,
    add_to_cart,
    empty_cart,
    remove_from_cart,
    increase_quantity,
    decrease_quantity,
  };
};
