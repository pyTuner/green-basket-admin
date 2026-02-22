import { Product } from "@/types/products";
import axios, { AxiosError } from 'axios';
import { Directory, File, Paths } from 'expo-file-system';
import { Alert } from 'react-native';

const BASE_URL = {
  development: "http://192.168.29.210:5000/api",
  production: "https://green-basket-backend-f9xm.onrender.com/api",
};

const FINAL_BASE_URL = BASE_URL["production"];

// Admin Login API
export const LoginApiAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${FINAL_BASE_URL}/auth/admin/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
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

// Get Product List API
export const GetProductList = async (token: string, catType = "ALL") => {
  try {
    const response = await axios.get(
      `${FINAL_BASE_URL}/product?catType=${catType}`,
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

// Add Unit API
export const addUnitApi = async (data: Product, token: string) => {
  try {
    const response = await axios.post(`${FINAL_BASE_URL}/unit`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const finalResponse = await response.data;
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

// Update Unit API
export const updateUnitApi = async (id: string, data: any, token: string) => {
  try {
    const response = await axios.put(`${FINAL_BASE_URL}/unit/${id}`, data, {
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

// Get Single Unit API
export const getUnitApi = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/unit/${id}`, {
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

// Delete Single Unit API
export const deleteUnitApi = async (id: string, token: string) => {
  try {
    const response = await axios.put(
      `${FINAL_BASE_URL}/unit/delete/${id}`,
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

// Get User/Staff/Admin Details
export const getDetailsAPI = async (token: string) => {
  try {
    const response = await axios.get(`${FINAL_BASE_URL}/auth/user/details`, {
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

// Update User Details Admin
export const updateAdminDetailsAPI = async (payload: any, token: string) => {
  try {
    const response = await axios.put(
      `${FINAL_BASE_URL}/auth/update/admin`,
      payload,
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

// Get User with Orders
export const getUserWithOrders = async (slotType: string, token: string) => {
  try {
    const response = await axios.get(
      `${FINAL_BASE_URL}/auth/orders?slotType=${slotType}`,
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

// Update order status after delivered
export const updateOrderDetails = async (payload: any, token: string) => {
  try {
    const response = await axios.put(
      `${FINAL_BASE_URL}/auth/order-status/update`,
      payload,
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

// Download the chart sheet
interface DownloadOptions {
  slotType: string;
  token: string;
  showAlert?: boolean;
  fileName?: string;
}

interface DownloadResponse {
  success: boolean;
  fileUri?: string;
  error?: any;
  message?: string;
}

export const downloadChargeSheet = async ({
  slotType,
  token,
  showAlert = true,
  fileName: customFileName,
}: DownloadOptions): Promise<DownloadResponse> => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${FINAL_BASE_URL}/order/slot/download`,
      params: { slotType },
      headers: { 
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    if (response.status === 403) throw new Error('Admin access required');
    if (response.status === 404) throw new Error('No data found for the selected slot');
    if (response.status >= 400) throw new Error(`Server error: ${response.status}`);

    if (!response.data?.body?.data) {
      throw new Error('Invalid response from server');
    }
    const { fileName: serverFileName, data: base64Data } = response.data.body;
    const fileName = customFileName || serverFileName || `charge-sheet-${slotType}-${Date.now()}.pdf`;
    const pdfsDir = new Directory(Paths.document, 'pdfs');
    if (!pdfsDir.exists) {
      pdfsDir.create();
    }
    const file = new File(pdfsDir, fileName);
    if (file.exists) {
      file.delete();
    }
    file.create();
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    file.write(byteArray);

    if (showAlert) {
      Alert.alert(
        'Success',
        'PDF downloaded successfully!',
        [{ text: 'OK' }]
      );
    }
    console.log(file);
    return { 
      success: true, 
      fileUri: file.uri,
      message: 'PDF downloaded successfully'
    };

  } catch (error: any) {
    return handleDownloadError(error, showAlert);
  }
};

const handleDownloadError = (error: any, showAlert: boolean): DownloadResponse => {
  let errorMessage = 'Failed to download PDF';

  console.error('❌ Download error:', {
    message: error.message,
    code: error.code,
    status: error.response?.status,
  });

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    
    if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again';
    } else if (axiosError.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check your connection and server';
    } else if (axiosError.response?.status === 403) {
      errorMessage = 'You do not have permission to download this file';
    } else if (axiosError.response?.status === 404) {
      errorMessage = 'No data found for the selected slot';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  if (showAlert) {
    Alert.alert('Download Failed', errorMessage, [{ text: 'OK' }]);
  }

  return { success: false, error, message: errorMessage };
};