// import { ref } from '@vue/reactivity';

const BASE_URL = 'http://localhost:5000';

export const useFetch = (
    endpoint, 
    requestMethod,
    bodyData = null,
    token = null,
    param = null
) => {
    return new Promise((resolve, reject) => {
        let url = param ? `${BASE_URL}${endpoint}${param}` : `${BASE_URL}${endpoint}`;
        if(requestMethod === 'POST' && !token){
            fetch(url, {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'origin-list'
                },
                body: JSON.stringify(bodyData) 
            })
            .then(res => {
                if(res.status >= 400){
                    return Promise.reject(res);
                }else{
                    return res.json();
                }
            })
            .then(data => resolve(data))
            .catch(response => {
                response.json()
                .then(err => reject(err));
            });
        }else if(
            (requestMethod === 'POST' && token) || 
            (requestMethod === 'PUT' && token)
        ){
            fetch(url, {
                method: requestMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Access-Control-Allow-Origin': 'origin-list'
                },
                body: JSON.stringify(bodyData) 
            })
            .then(res => {
                if(res.status >= 400){
                    return Promise.reject(res);
                }else{
                    return res.json();
                }
            })
            .then(data => resolve(data))
            .catch(response => {
                response.json()
                .then(err => reject(err));
            });
        }else if(
            (requestMethod === 'GET' && token) || 
            (requestMethod === 'DELETE' && token)
        ){
            fetch(url, {
                method: requestMethod,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Access-Control-Allow-Origin': 'origin-list'
                }
            })
            .then(res => {
                if(res.status >= 400){
                    return Promise.reject(res);
                }else{
                    return res.json();
                }
            })
            .then(data => resolve(data))
            .catch(response => {
                response.json()
                .then(err => reject(err));
            });
        }else{
            fetch(url, {
                method: requestMethod,
                headers: {
                    'Access-Control-Allow-Origin': 'origin-list'
                }
            })
            .then(res => {
                if(res.status >= 400){
                    return Promise.reject(res);
                }else{
                    return res.json();
                }
            })
            .then(data => resolve(data))
            .catch(response => {
                response.json()
                .then(err => reject(err));
            });
        }
    });
}