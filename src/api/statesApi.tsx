import axios from 'axios';
import { State } from '../models/State';


const API_BASE_URL = 'https://my-json-server.typicode.com/ivanovskiviktor/dbplaceholder';

export const fetchStates = async (): Promise<State[]> => {
    try {
        const response = await axios.get<State[]>(`${API_BASE_URL}/states`);
        return response.data;
    } catch (error) {
        throw error;
    }
};