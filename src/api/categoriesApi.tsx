import axios from 'axios';
import { Category } from '../models/Category';


const API_BASE_URL = 'https://my-json-server.typicode.com/ivanovskiviktor/dbplaceholder';

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await axios.get<Category[]>(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        throw error;
    }
};