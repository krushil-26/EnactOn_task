import axios from "axios";

const BaseURL = 'http://localhost:3001'

export const getCategories = async () => {
    try {
        const response = await axios.get(BaseURL + '/categories');
        if (response) {
            return {
                status: response.status,
                success: true,
                data: response || [],
                message: response.data.message,
            };
        }
        return {
            status: response.status,
            success: false,
            data: [],
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: error?.response?.status,
            success: false,
            data: [],
            message: error.response.data.message || error.message,
        };
    }
};