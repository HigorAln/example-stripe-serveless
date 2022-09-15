import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method not allowed!" })
  }
  const { priceId } = req.body;

  if (!priceId) {
    return res.status(400).json({ error: "Something`s is wrong!" })
  }

  const urlSuccess = `http://localhost:3000/api/success`;
  const urlCancel = `http://localhost:3000/`;

  const checkoutSession = await stripe.checkout.sessions.create({
    cancel_url: urlCancel,
    success_url: urlSuccess,
    mode: "payment",
    allow_promotion_codes: true,
    customer_email: "example@gmail.com", // setando um email
    line_items: [
      {
        price: priceId,
        quantity: 1,
      }
    ]
  })

  return res.json({ url: checkoutSession.url })
}