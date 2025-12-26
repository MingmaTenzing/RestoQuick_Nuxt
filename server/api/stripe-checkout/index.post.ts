import { useServerStripe } from "#stripe/server";
import type Order_Cart_Item from "~~/types/order-cart";

//this endpoint create checkout session

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = await useServerStripe(event);
  const body = await readBody(event);

  const cart_items: Order_Cart_Item[] = body.cart_items;
  const table_id = body.table_id;

  console.log(cart_items, table_id);

  //mapping data for stripe line_items
  const stripe_line_items = cart_items.map((item: Order_Cart_Item) => ({
    price_data: {
      currency: "aud",
      unit_amount: item.unitPrice,

      product_data: {
        name: item.itemName,
        //here the metadata is included so it can be looked up by making a products_object request
        //however for this we need to make make a separate api call... so its just here for reference
        // the line_item itself includes metada object below for easily accessing the itemname,menuid, and special instructions
        metadata: {
          menuItemId: item.menuItemId,
          specialInstruction: item.specialInstructions || " ",
        },
        // images: ["https://example.com/katsu-curry.png"],
      },
    },
    //here metadata is set to line_item cause its easier to access it without calling for another price/product object api..
    metadata: {
      name: item.itemName,
      menuItemId: item.menuItemId,
      specialInstructions: item.specialInstructions || "",
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    metadata: {
      table_id: table_id, //this is to reference the table_id when checkout completes to add to database
    },
    line_items: stripe_line_items,
    return_url: `${config.HOST}/order-table/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    clientSecret: session.client_secret,
  };
});
