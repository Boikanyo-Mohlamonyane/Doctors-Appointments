import api from "./api";

// REGISTER
export const registerUser = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};

// LOGIN
export const loginUser = async (email, password) => {
    const res = await api.post("/auth/login", {
        email,
        password
    });
    return res.data;
};