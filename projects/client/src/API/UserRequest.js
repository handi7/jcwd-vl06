import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:2000" });

export const logIn = (formData) =>
  API.post("/users/login", formData)
    // .then((res) => {
    //   return res, console.log(res, formData);
    // })
    .catch((err) => {
      throw new Error(err.response.data.message);
    });

export const verifyUser = (id) =>
  API.patch(`/users/verified/${id}`)
    .then((res) => console.log(res), console.log(id))
    .catch((err) => console.log(err));

export const getUser = () =>
  API.get(`/users`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
