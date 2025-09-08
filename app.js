import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const app = express();
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:5173", //for local dev

//     credentials: true,
//   })
// );

// const allowedOrigins = [
//   "http://localhost:5173", // for local dev
//   "https://odia-dish-harsh-parthak-client-mpi9.vercel.app", // your deployed frontend
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes("localhost:5173") ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// checkout api       //localhost
// app.post("/api/create-checkout-session", async (req, res) => {
//   const { products } = req.body;
//   console.log(products);
//   const lineItems = products.map((product) => ({
//     price_data: {
//       currency: "inr",
//       product_data: {
//         name: product.dish,
//         images: [product.imgdata],
//       },
//       unit_amount: product.price * 100,
//     },
//     quantity: product.qnty,
//   }));

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: lineItems,
//     mode: "payment",
//     // success_url: "http://localhost:5173/success", //localhost
//     // cancel_url: "http://localhost:5173/cancel",  //localhost

//     success_url:
//       "https://odia-dish-harsh-parthak-client-mpi9.vercel.app/success",
//     cancel_url: "https://odia-dish-harsh-parthak-client-mpi9.vercel.app/cancel",
//   });

//   // res.json({ id: session.id }); localhost

//   res.json({ url: session.url });
// });

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;
    const lineItems = products.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.dish,
          images: [product.imgdata],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qnty,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url:
        "https://odia-dish-harsh-parthak-client-mpi9.vercel.app/success",
      cancel_url:
        "https://odia-dish-harsh-parthak-client-mpi9.vercel.app/cancel",
    });

    res.json({ url: session.url }); // send session URL back
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// const PORT = process.env.PORT || 5000;
const PORT = 7000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
