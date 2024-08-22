import axios from 'axios';
import { Product } from '../models/Product';

const API_BASE_URL = 'https://my-json-server.typicode.com/ivanovskiviktor/dbplaceholder';

export const simulateDeleteProduct = async (productId: number): Promise<void> => {
    try {
        await axios.delete<Product>(
            `${API_BASE_URL}/products/${productId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        throw new Error('Failed to add product');
    }
};
