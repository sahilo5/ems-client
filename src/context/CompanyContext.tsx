import React, { createContext, useEffect, useState, useContext } from "react";
import { api } from "../utils/api";
import { AuthContext } from "./AuthContext";

type CompanyContextType = {
    companyName: string;
    loading?: boolean;
    refreshCompanyName: () => Promise<void>;
};

export const CompanyContext = createContext<CompanyContextType>(
    {} as CompanyContextType
);

export const CompanyProvider = ({ children }: { children: React.ReactNode }) => {
    const { token } = useContext(AuthContext);
    const [companyName, setCompanyName] = useState<string>("Set Your Company's Name");
    const [loading, setLoading] = useState(true);

    const fetchCompanyName = async () => {
        if (!token) return;
        setLoading(true);
        try {
          const companyNameResponse = await api(`/user/settings/12`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
      
          let companyNameValue = "Set Your Company's Name";
      
          try {
            const parsed = JSON.parse(companyNameResponse.data.data);
            if (parsed?.value && typeof parsed.value === "string") {
              companyNameValue = parsed.value;
            }
          } catch (e) {
            console.error("Error parsing company name:", e);
          }
      
          setCompanyName(companyNameValue);
        } catch (error) {
          console.error("Failed to fetch company name:", error);
          setCompanyName("Set Your Company's Name");
        } finally {
          setLoading(false);
        }
      };
      

    useEffect(() => {
        if (!token) {
            setCompanyName("Set Your Company's Name");
            setLoading(false);
            return;
        }
        fetchCompanyName();
    }, [token]);

    return (
        <CompanyContext.Provider
            value={{
                companyName,
                loading,
                refreshCompanyName: fetchCompanyName,
            }}
        >
            {children}
        </CompanyContext.Provider>
    );
};
