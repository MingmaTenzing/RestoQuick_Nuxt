import { useServerStripe } from "#stripe/server";

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: 1800, // $18.00
          product_data: {
            name: "Katsu Curry",

            description: "Japanese curry with crispy chicken katsu",
            // images: ["https://example.com/katsu-curry.png"],
          },
        },
        quantity: 2,
      },
      {
        price_data: {
          currency: "aud",
          unit_amount: 1500, // $15.00
          product_data: {
            name: "Chicken Ramen",
            description: "Rich chicken broth ramen with noodles and egg",
            // images: ["https://example.com/chicken-ramen.png"],
          },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "aud",
          unit_amount: 1200, // $12.00
          product_data: {
            name: "Vegetable Gyoza (6 pcs)",
            description: "Pan-fried vegetable dumplings served with soy sauce",
            // images: ["https://example.com/gyoza.png"],
          },
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "aud",
          unit_amount: 600, // $6.00
          product_data: {
            name: "Miso Soup",
            description: "Traditional Japanese miso soup with tofu and seaweed",
            // images: ["https://example.com/miso-soup.png"],
          },
        },
        quantity: 2,
      },
      {
        price_data: {
          currency: "aud",
          unit_amount: 500, // $5.00
          product_data: {
            name: "Green Tea",
            description: "Hot Japanese green tea",
            // images: ["https://example.com/green-tea.png"],
          },
        },
        quantity: 3,
      },
    ],
    return_url: `http://localhost:3000/session_id={CHECKOUT_SESSION_ID}`,
  });

  return {
    clientSecret: session.client_secret,
  };

  //   const sesssion = await stripe.checkout.sessions.create({
  //     ui_mode:'embedded',
  //     line_items: [
  //       {
  //         price_data: {
  //           currency: "aud",
  //           unit_amount: "20",
  //           quantity: 1,

  //           product_data: {
  //             name: "Katsu Curry",
  //             description: "Katsu with currry",
  //             //images: [] url of images of the product
  //           },
  //         },
  //       },
  //     ],
  //     return_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`,
  //   });
  // });
});
