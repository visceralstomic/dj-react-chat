import axios_instance from "./globalAxios";


const login = data => {
    return axios_instance
            .post(`/users/login/`, data)
            .then(response => response.data);
}

const logout = () => {
    return axios_instance
        .get(`/users/logout/`)
        .then(response => response.data);
}

const getUser = () => {
    return axios_instance
            .get('/users/get_user/')
            .then(response => response.data)
}

const getUsers = (query='') => {
    return axios_instance
            .get(`/users/?${query}`)
            .then(response => response.data)
}

const createUser = data => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios_instance
            .post('/users/', data, config)
            .then(response => response.data)
}


export default {
    login,
    logout,
    getUser,
    getUsers, 
    createUser
}