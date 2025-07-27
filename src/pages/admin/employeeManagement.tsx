import React, { useContext } from "react";
import { api } from "../../utils/api";
import Button from "../../components/Button";
import { AuthContext } from "../../context/AuthContext";


const handleHealthCheck = async () => {
  const { role, token, username, isAuthenticated } = useContext(AuthContext);
  try {
    let userRole = role;
    let healthPath: string = "";

    if (userRole === "ADMIN"){
      healthPath = "/admin/health";
    }else if(userRole === "EMPLOYEE"){
      healthPath = "/employee/health";
    }else{
      healthPath = "/user/health";
    }

    const response = await api(healthPath, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
    });
    alert(response.text);

  } catch (err: any) {
    
  }
};
const EmpoloyeeManagement = () => <div className="space-y-2">
  <h1 className="text-xl">Empoloyee Management Page</h1>
  <Button variant="secondary" onClick={handleHealthCheck} className="w-full">
    Health Check
  </Button>
</div>;




export default EmpoloyeeManagement;