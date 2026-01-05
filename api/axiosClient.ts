import axios from "axios";

const BASE_URL = {
  development: "http://192.168.1.5:5000/api",
  production: "https://green-basket-backend-f9xm.onrender.com/api",
};

const FINAL_BASE_URL = BASE_URL["production"];

export const LoginApiAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${FINAL_BASE_URL}/auth/admin/login`, {
      email,
      password,
    });
    const finalResponse = await response.data;
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
      return error.request;
    } else {
      console.log("Axios error:", error.message);
      return error.message;
    }
  }
};

export const GetProductList = async (token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/product`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const finalResponse = await response.data;
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
      return error.request;
    } else {
      console.log("Axios error:", error.message);
      return error.message;
    }
  }
};

export const addProductApi = async (data: any, token: string) => {
  try {
    console.log("API HIT POST PRODUCT");
    const response = await axios.post(`${BASE_URL}/product`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    const finalResponse = await response.data;
    console.log(finalResponse);
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
      return error.request;
    } else {
      console.log("Axios error:", error.message);
      return error.message;
    }
  }
};

export const updateProductApi = async (
  id: string,
  data: any,
  token: string
) => {
  try {
    const response = await axios.put(`${BASE_URL}/product/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const finalResponse = await response.data;
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
      return error.request;
    } else {
      console.log("Axios error:", error.message);
      return error.message;
    }
  }
};

export const getProductApi = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const finalResponse = await response.data;
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
      return error.request;
    } else {
      console.log("Axios error:", error.message);
      return error.message;
    }
  }
};

export const deleteProductApi = async (id: string, token: string) => {
  try {
    const response = await axios.put(`${BASE_URL}/product/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const finalResponse = await response.data;
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server responded with error:", error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.log("No response received from server");
      return error.request;
    } else {
      console.log("Axios error:", error.message);
      return error.message;
    }
  }
};
