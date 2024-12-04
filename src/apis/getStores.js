import axios from "axios";

const BaseURL = 'http://localhost:3001'

export const getStores = async (currentPage, query, queryParamsObj) => {
    try {
        const response = await axios.get(BaseURL + '/stores', {
            params: {
                _page: currentPage,
                name_like: query,
                ...queryParamsObj
            },
        })
        if (response) {
            return {
                status: response.status,
                success: true,
                data: response.data || [],
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