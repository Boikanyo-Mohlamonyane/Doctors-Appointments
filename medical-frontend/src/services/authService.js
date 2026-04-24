import api from "./api";

// LOGIN
export const loginUser = (email, password) => {
  return api.post(
    "/auth/login",
    {
      email: email,
      password: password
    },
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};