import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useRegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [agree, setAgree] = useState(false);
    const [gender, setGender] = useState("male");
    const navigate = useNavigate();

    const handleRegister = () => {
        console.log("Registering with:", { email, password, dob, gender, agree });
        // try {
        //     const response = await api("/auth/login", {
        //       method: "POST",
        //       body: JSON.stringify({ username, password }),
        //     });
      
        //     // To store token,userName, userRole
        //     localStorage.setItem("token", response.accessToken);
        //     localStorage.setItem("userName", response.username);
        //     localStorage.setItem("userRole", response.urserRole);
            
        //     navigate("/Dashboard");
        //   } catch (err: any) {
        //     alert(err.message);
        //   }
    };

    const handleLogin = () => {
        navigate("/login");
      };

    return {
        email,
        password,
        dob,
        agree,
        gender,
        handleRegister,
        setEmail,
        setPassword,
        setDob,
        setAgree,
        setGender,
        handleLogin
    };
}
