import axios from './axios.customize';

const createUserApi = (name, email, password) => {
    const URL_API = "/v1/api/register";
    const data = {
        name, email, password
    }

    return axios.post(URL_API, data)
}

const loginApi = (email, password) => {
    const URL_API = "/v1/api/login";
    const data = {
        email, password
    }

    return axios.post(URL_API, data)
}

const getUserApi = () => {
    const URL_API = "/v1/api/user";
    return axios.get(URL_API)
}

const getAccountApi = () => {
    const URL_API = "/v1/api/accounts";
    return axios.get(URL_API);
};

const createAccountApi = (name, balance, isCash) => {
    const URL_API = "/v1/api/accounts";
    const data = { name, balance, isCash };
    return axios.post(URL_API, data);
};

const updateAccountApi = (accountId, name, isCash) => {
    const URL_API = "/v1/api/accounts";
    const data = { accountId, name, isCash };
    return axios.put(URL_API, data);
};

const deleteAccountApi = (accountId) => {
    const URL_API = "/v1/api/accounts";
    const data = { accountId };
    return axios.delete(URL_API, { data });
};

const getCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API);
};

const createCategoriesApi = (name, type) => {
    const URL_API = "/v1/api/categories";
    const data = { name, type };
    return axios.post(URL_API, data);
};

const updateCategoriesApi = (categoryId, name, type) => {
    const URL_API = "/v1/api/categories";
    const data = { categoryId, name, type };
    return axios.put(URL_API, data);
};

const deleteCategoriesApi = (categoryId) => {
    const URL_API = "/v1/api/categories";
    const data = { categoryId };
    return axios.delete(URL_API, { data });
};

const getTransactionsApi = (startDate, endDate) => {
    const URL_API = "/v1/api/transactions";
    return axios.get(URL_API, { params: { startDate, endDate } });
};

const createTransactionsApi = (amount, type, accountId, categoryId, date, description) => {
    const URL_API = "/v1/api/transactions";
    const data = { amount, type, accountId, categoryId, date, description };
    return axios.post(URL_API, data);
};

const updateTransactionsApi = (transactionId, amount, type, accountId, categoryId, date, description) => {
    const URL_API = "/v1/api/transactions";
    const data = { transactionId, amount, type, accountId, categoryId, date, description };
    return axios.put(URL_API, data);
};

const deleteTransactionsApi = (transactionId) => {
    const URL_API = "/v1/api/transactions";
    const data = { transactionId };
    return axios.delete(URL_API, { data });
};

const getBudgetsApi = () => {
    const URL_API = "/v1/api/budgets";
    return axios.get(URL_API);
};

const createBudgetsApi = (categoryId, amount, startDate, endDate) => {
    const URL_API = "/v1/api/budgets";
    const data = { categoryId, amount, startDate, endDate };
    return axios.post(URL_API, data);
};

const updateBudgetsApi = (budgetId, amount) => {
    const URL_API = "/v1/api/budgets";
    const data = { budgetId, amount };
    return axios.put(URL_API, data);
};

const deleteBudgetsApi = (budgetId) => {
    const URL_API = "/v1/api/budgets";
    const data = { budgetId };
    return axios.delete(URL_API, { data });
};

const getNotificationsApi = () => {
    const URL_API = "/v1/api/notifications";
    return axios.get(URL_API);
};

const markNotificationAsReadApi = (notificationId) => {
    const URL_API = `/v1/api/notifications/${notificationId}/read`;
    return axios.put(URL_API);
};

const deleteNotificationApi = (notificationId) => {
    const URL_API = `/v1/api/notifications/${notificationId}`;
    return axios.delete(URL_API);
};

const getReportsBarChartApi = (startDate, endDate) => {
    const URL_API = "/v1/api/reports/bar";
    return axios.get(URL_API, { params: { startDate, endDate } });
};

const getReportsPieChartApi = (startDate, endDate) => {
    const URL_API = "/v1/api/reports/pie";
    return axios.get(URL_API, { params: { startDate, endDate } });
};

export {
    createUserApi, 
    loginApi, 
    getUserApi, 
    getAccountApi, 
    createAccountApi, 
    updateAccountApi, 
    deleteAccountApi,
    getCategoriesApi,
    createCategoriesApi,
    updateCategoriesApi,
    deleteCategoriesApi,
    getTransactionsApi,
    createTransactionsApi,
    updateTransactionsApi,
    deleteTransactionsApi,
    getBudgetsApi,
    createBudgetsApi,
    updateBudgetsApi,
    deleteBudgetsApi,
    getNotificationsApi,
    markNotificationAsReadApi,
    deleteNotificationApi,
    getReportsBarChartApi,
    getReportsPieChartApi
}