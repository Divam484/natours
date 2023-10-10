import axios from "axios";
import { showAlert } from './alerts';

export const signUp = async (name,email,password,passwordConfirm) => {
  // console.log(email, password);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm
      },
    });
    console.log(res)
    if (res.data.status === 'success') {
        showAlert('success', 'Sign-Up in successfully!');
        window.setTimeout(() => {
          location.assign('/');
        }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};