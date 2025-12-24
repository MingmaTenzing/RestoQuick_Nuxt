//this end point retrieves the checkout session status and details
//and if checkout is successfull then make a another request for line_items
//and then use that items for adding it to database;

import { useServerStripe } from "#stripe/server";
export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);

  const query = getQuery(event);

  const session_id = query.session_id as string;
  console.log(session_id);

  const session = await stripe.checkout.sessions.retrieve(session_id);
  const lineItems = await stripe.checkout.sessions.listLineItems(session_id);

  //checking is status is expired or open, if yes throw error or send message that checkout is still open
  if (session.status == "expired") {
    throw createError({
      statusCode: 410,
      message: "Checkout Session has expired",
    });
  } else if (session.status == "open") {
    return {
      status: "checkout is still open so please proceed to payment first",
      checkoutUrl: session.url,
    };
  }

  //here's by this point its obvious that the session.status is complete so can proceed to add line_items to order table
  const metadata = lineItems.data[0].metadata;

  const table_id = session.metadata;

  return {
    status: session.status,
    customer_email: session.customer_details?.email,
    lineItems: lineItems,
    table: table_id,
    product_metadata: metadata,
  };
});
