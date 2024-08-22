import axios from 'axios';
import { Product } from '../models/Product';

const API_BASE_URL = 'https://my-json-server.typicode.com/ivanovskiviktor/dbplaceholder';

export const simulateEditProduct = async (productData: any, productId: number): Promise<Product> => {
    try {

        const updatedProductData = {
            ...productData,
            id: productId
        };

        await axios.put<Product>(
            `${API_BASE_URL}/products/${productId}`,
            updatedProductData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            id: productId,
            ...productData,
        };
    } catch (error) {
        throw new Error('Failed to add product');
    }
};
