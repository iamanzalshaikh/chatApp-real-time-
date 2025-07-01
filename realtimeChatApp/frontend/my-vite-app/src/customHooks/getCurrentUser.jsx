import axios from "axios"
import { useEffect } from "react"
import { serverUrl } from "../main"
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../redux/userSlice"

const getCurrentUser=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser=async ()=>{
            try {
                let result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
                if (result.data.image) {
  result.data.image = `${serverUrl}/uploads/${result.data.image}`;
}
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        fetchUser()
    },[])
}

export default getCurrentUser











// import { setUserData } from "../redux/userSlice";

// const useFetchCurrentUser = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/user/current", {
//           withCredentials: true,
//         });
//         dispatch(setUserData(res.data)); // ✅ Redux mein user save kiya
//       } catch (error) {
//         console.error("❌ Error fetching current user:", error.message);
//       }
//     };

//     fetchUser(); // 👈 Function call karo
//   }, []); // ✅ Sirf 1 baar chale (jab component load ho)

// };

// export default useFetchCurrentUser;
