import axios from 'axios';
import { Product } from '../models/Product';

const API_BASE_URL = 'https://my-json-server.typicode.com/ivanovskiviktor/dbplaceholder';

export const fetchProduct = async (categoryId: number): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_BASE_URL}/products?categoryId=${categoryId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};