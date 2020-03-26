import { authHeader } from "../utils";
import axios from "axios";
import Vue from "vue";
export const userService = {
  login,
  logout,
  getAll
};

function login(username, password) {
  const requestOptions = {
    headers: { "Content-Type": "application/json" }
  };
  return axios
    .post(
      `${Vue.Constants.API_ROOT_URL}/data/accounts/signin.json`,
      JSON.stringify({ username: username, password: password }),
      requestOptions
    )
    .then(handleResponse)
    .then(user => {
      // login successful if there's a jwt token in the response
      if (user.jwtToken) {
        // store user details and jwt token in local storage to keep user logged in between page refreshe
        localStorage.setItem("user", JSON.stringify(user));
      }
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function getAll() {
  const requestOptions = {
    method: "GET",
    headers: authHeader()
  };
  return fetch(`${cVue.Constants.API_ROOT_URL}/users`, requestOptions).then(
    handleResponse
  );
}

function handleResponse(response) {
  if (typeof response.data !== "undefined") {
    const data = response.data;
    if (typeof data.error !== "undefined") {
      const error = data.error;
      return Promise.reject(error);
    }
    return data;
  } else {
    return response.text().then(text => {
      const data = text && JSON.parse(text);
      if (!response.ok) {
        if (response.status === 401) {
          // auto logout if 401 response returned from api
          logout();
          location.reload(true);
        }
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }
      return data;
    });
  }
}
