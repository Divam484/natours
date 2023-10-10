import axios from "axios";
import { showAlert } from "./alerts";
import Stripe from "stripe";

const stripe = Stripe(
  "pk_test_51NxoS5SElrsgII8xiL3TO4NiuCi1wcXrpQdzH8zeXrNTAlg6UycBGKIvOvBfSGa7qre9vVNC7wD8OoqhCmTBph5h00WkLxUt0U"
);

export const bookTour = async (tourId) => {

  try {
  // 1) Get checkout session from API
  const session = await axios(
    `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
  );

  console.log('-----',session.data.session.url);

  // 2) Create checkout form + charge credit card
    // stripe.redirectToCheckout({
    //   sessionId: session.data.session.id
    // });
    if(session){
      window.location.replace(session.data.session.url);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
