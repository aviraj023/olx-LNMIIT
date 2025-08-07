
// const BASE_URL = import.meta.env.BASE_URL;

// const itemApi={

//     ADD_ITEM_API:BASE_URL+"/item/addItem",
//     UPDATE_ITEM_API:BASE_URL+"/item/updateItem",
//     UPDATE_STATUS_API:BASE_URL+"/item/updateStatus",
//     DELETE_ITEM_API:BASE_URL+"/item/deleteItem",
//     GET_ALL_ITEMS_API:BASE_URL+"/item/getAllItems",
//     GET_ITEMS_DETAILS_API: BASE_URL+"/item/getItemDetails",
//     INCREMENT_VIEWS: BASE_URL+"/item/incrementViews",
//     GET_OWNERs_ITEMS:BASE_URL+"/item/getOwnersItems",

// };


// const categoryApi = {
//     GET_CATEGORIES_API:BASE_URL+"/item/getCategories",
//     CREATE_CATEGORY:BASE_URL+"/item/createCategory"

// };

// // Build the route
// // const searchApi={

// // }

// const authApi = {
//     SIGNUP_API: BASE_URL + "/auth/signup",
//     LOGIN_API: BASE_URL + "/auth/login",
//     VERIFY_OTP:BASE_URL+"/auth/verifyOtp",
//     CREATE_NEW_TOKEN_API:BASE_URL+"/auth/createNewToken",

//     GET_USER_DATA:BASE_URL+"/profile/getUserData",
// }


// export {itemApi,categoryApi,authApi};

import axios from "axios"
const axiosInstance=axios.create({
    baseURL:"http://localhost:5000/api/v1",
    withCredentials:true
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
    (response)=>response,

    async (error)=>{
        const originalRequest = error.config;
        if(error.response && error.response.status===404 && !originalRequest._retry)
        {
            originalRequest._retry=true;

            if(!isRefreshing)
            {
                isRefreshing=true;

                try{

                    await axios.post("http://localhost:5000/api/v1/auth/createNewToken",
                        {},
                        {
                            withCredentials:true
                        }
                    );

                    isRefreshing=false;

                    return axiosInstance(originalRequest);
                }
                catch(refreshError)
                {
                    isRefreshing=false;
                    console.log("Refresh Token failed");

                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
)

export default axiosInstance;






 