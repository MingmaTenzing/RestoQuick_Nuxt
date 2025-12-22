//this end point retrieves the checkout session status and details
//and if checkout is successfull then make a another request for line_items
//and then use that items for adding it to database;

import { useServerStripe } from "#stripe/server";
export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);

  const session = await stripe.checkout.sessions.retrieve("dd");
});
