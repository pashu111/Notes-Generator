import axios from "axios";
import { API_URL } from "../config";
import { clearUserData, setAuthLoading, setUserData } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
    dispatch(setAuthLoading(true));
    try {
        const result = await axios.get(
            `${API_URL}/api/user/currentuser`,
            {
                withCredentials: true,
            }
        );

        dispatch(setUserData(result.data))
        return result.data;
    } catch (error) {
        if (error?.response?.status === 401) {
            dispatch(clearUserData());
        } else {
            dispatch(setAuthLoading(false));
        }
        console.error("Get Current User Error:", error);
        return null;
    }
};

export const generateNotes = async (payload)=>{
    try{
        const result = await axios.post(API_URL + "/api/notes/generate-notes",payload,
            {withCredentials: true});
            console.log("Generated Notes Response:", result.data);
            console.log("Generated Notes:", result.data.data);
        return result.data;
    }catch(error){
        console.error("Generate Notes Error:", error);
    }

}