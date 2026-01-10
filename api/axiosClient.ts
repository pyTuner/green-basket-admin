import { Product } from "@/types/products";
import axios from "axios";

const BASE_URL = {
  development: "http://192.168.1.5:5000/api",
  production: "https://green-basket-backend-f9xm.onrender.com/api",
};

const FINAL_BASE_URL = BASE_URL["production"];

// Admin Login API
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

// Get Product List API
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

// Add Product API
export const addProductApi = async (data: Product, token: string) => {
  try {
    const response = await axios.post(`${FINAL_BASE_URL}/product`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const finalResponse = await response.data;
    console.log(finalResponse);
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server error:", error.response.data);
    } else if (error.request) {
      console.log("Network error: request sent but no response");
    } else {
      console.log("Axios error:", error.message);
    }
    return null;
  }
};

// Update Product API
export const updateProductApi = async (
  id: string,
  data: any,
  token: string
) => {
  try {
    const response = await axios.put(`${FINAL_BASE_URL}/product/${id}`, data, {
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

// Get Single Product API
export const getProductApi = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/product/${id}`, {
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

// Delete Single Product API
export const deleteProductApi = async (id: string, token: string) => {
  try {
    const response = await axios.put(
      `${FINAL_BASE_URL}/product/delete/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

// Get Category List API
export const GetCategoryList = async (token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/category`, {
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

// Add Category API
export const addCategoryApi = async (data: Product, token: string) => {
  try {
    const response = await axios.post(`${FINAL_BASE_URL}/category`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const finalResponse = await response.data;
    console.log(finalResponse);
    return finalResponse;
  } catch (error: any) {
    if (error.response) {
      console.log("Server error:", error.response.data);
    } else if (error.request) {
      console.log("Network error: request sent but no response");
    } else {
      console.log("Axios error:", error.message);
    }
    return null;
  }
};

// Update Category API
export const updateCategoryApi = async (
  id: string,
  data: any,
  token: string
) => {
  try {
    const response = await axios.put(`${FINAL_BASE_URL}/category/${id}`, data, {
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

// Get Single Category API
export const getCategoryApi = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/category/${id}`, {
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

// Delete Single Category API
export const deleteCategoryApi = async (id: string, token: string) => {
  try {
    const response = await axios.put(
      `${FINAL_BASE_URL}/category/delete/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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

// Get Unit List API
export const GetUnitList = async (token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/unit`, {
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

// Order Charge Sheet
export const getOrderChargeSheetApi = async (
  token: string,
  slotType: string
) => {
  try {
    const response = await axios.get(
      `${FINAL_BASE_URL}/order/slot/aggregation?slotType=${slotType}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
