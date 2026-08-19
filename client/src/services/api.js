import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(
            `${serverUrl}/api/user/currentuser`,
            {
                withCredentials: true,
            }
        );

        // console.log(result.data);
        dispatch(setUserData(result.data))
        return result.data;
    } catch (error) {
        console.error("Get Current User Error:", error);
    }
};

export const generateNotes = async (payload)=>{
    try{
        const result = await axios.post(serverUrl+ "/api/notes/generate-notes",payload,
            {withCredentials: true});
            console.log("Generated Notes Response:", result.data);
            console.log("Generated Notes:", result.data.data);
        return result.data;
    }catch(error){
        console.error("Generate Notes Error:", error);
    }

}