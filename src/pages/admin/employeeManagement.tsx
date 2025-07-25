import React from "react";
import { api } from "../../utils/api";
import Button from "../../components/Button";


   const handleHealthCheck = async () => {
    try {
        const response = await api("/admin/health", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json", // Optional, but often needed
            },
           });
           console.log(response);

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