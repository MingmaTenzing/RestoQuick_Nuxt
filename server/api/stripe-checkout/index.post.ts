import { useServerStripe } from "#stripe/server";
import type Order_Cart_Item from "~~/types/order-cart";

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);
  const body = await readBody(event);

  const cart_items: Order_Cart_Item[] = body.cart_items;
  const table_id = body.table_id;

  console.log(cart_items, table_id);

  //mapping data for stripe line_items
  const stripe_line_items = cart_items.map((item: Order_Cart_Item) => ({
    price_data: {
      currency: "aud",
      unit_amount: Math.round(item.unitPrice * 100), //the reason for multiplying by 100 is due cause unit_amount should be in cents;
      product_data: {
        name: item.itemName,
        metadata: {
          menuItemId: item.menuItemId, //this is to reference menuitemid lookup.. on database for future purpose.
          specialInstruction: item.specialInstructions || " ", //special instruction fallsback to empty string if nothing provided
        },
        // images: ["https://example.com/katsu-curry.png"],
      },
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    metadata: {
      table_id: table_id, //this is to reference the table_id when checkout completes to add to database
    },
    line_items: stripe_line_items,
    return_url: `http://localhost:3000/session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    clientSecret: session.client_secret,
  };
});
