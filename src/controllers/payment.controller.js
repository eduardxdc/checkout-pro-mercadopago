import { MercadoPagoConfig, Preference } from 'mercadopago';
import { HOST, MERCADOPAGO_API_KEY, INTEGRATOR_ID } from '../config.js';
import axios from "axios";

const client = new MercadoPagoConfig({
  accessToken: MERCADOPAGO_API_KEY,
  integrator_id: INTEGRATOR_ID,
});

export const createOrder = (req, res) => {
  const preference = new Preference(client);

  preference
    .create({
      body: {
        payment_methods: {
          excluded_payment_methods: [
            {
              id: "visa",
            },
          ],
          excluded_payment_types: [],
          installments: 6,
        },
        items: [
          {
            id: "1907",
            title: "Product",
            quantity: 1,
            unit_price: 1000,
            picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
          },
        ],
        back_urls: {
          success: `${HOST}/success`, 
          failure: `${HOST}/failure`,
          pending: `${HOST}/pending`,
        },
        auto_return: "approved",
        notification_url: "https://154d-2001-1284-f50e-31bf-509f-c9b2-c9cf-473a.ngrok-free.app/webhook",
        external_reference: "eduardxdc@gmail.com",
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
      const accessToken = MERCADOPAGO_API_KEY;
      const integrator_id = INTEGRATOR_ID;

      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-integrator-id': integrator_id,
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