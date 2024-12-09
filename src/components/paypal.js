import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButtonsComponent = ({ onPaymentSuccess }) => {
  const initialOptions = {
    "client-id": "AZ5BUeUrpQM4EFmt5eTBcuR00JPHZsX63-tGHHssjVq09DGtrwTieK4I2VaUx4zggN0MtT0xgMOaqkox",
    currency: "MXN",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "200", // El monto de la transacción
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      //alert("Pago completo, gracias " + details.payer.name.given_name);
      if (onPaymentSuccess) {
        onPaymentSuccess(); // Notifica al componente principal
      }
    });
  };

  const onError = (err) => {
    console.error("Ocurrió un error con el pago: ", err);
    //alert("Hubo un error procesando el pago. Por favor, inténtalo de nuevo.");
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
        onError={(err) => onError(err)}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButtonsComponent; 