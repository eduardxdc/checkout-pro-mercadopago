import { MercadoPagoConfig, Preference } from "mercadopago";
import axios from "axios";

const client = new MercadoPagoConfig({
  accessToken:
    "APP_USR-8693778713813598-042714-56aa663e3f7c0fc3778dc68b561df61c-1788151692",
});

export const createOrder = (req, res) => {
  const preference = new Preference(client);

  preference
    .create({
      body: {
        items: [
          {
            title: "Product",
            quantity: 1,
            unit_price: 1000,
          },
        ],
        back_urls: {
          success: "http://localhost:3000/payment/success",
          failure: "http://localhost:3000/payment/failure",
          pending: "http://localhost:3000/payment/pending",
        },
        notification_url: "https://f63d-170-247-194-174.ngrok-free.app/webhook",
      },
    })
    .then((response) => {
      console.log(response);
      res.send(response);
    })
    .catch((error) => {
      console.error("Error creating order:", error);
      res.status(500).send("Failed to create order");
    });
};

export const receiveWebhook = async (req, res) => {
  const payment = req.query;

  try {
    if (payment.type === "payment") {
      const id = payment["data.id"];
      const accessToken = "APP_USR-8693778713813598-042714-56aa663e3f7c0fc3778dc68b561df61c-1788151692"; // Substitua pelo seu token de acesso

      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = response.data;
      console.log(data);
    }
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: error.message });
  }
};