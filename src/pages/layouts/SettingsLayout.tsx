import React, { useState } from "react";
import { Tabs, Tab } from "../../components/Tabs";
import Loader from "../../components/Loader";
import SystemSettings from "../admin/SystemSettings";

const SettingsLayout = () => {

    const [loading, setLoading] = useState(false);
    return (
        <div className="space-y-2">
            <Tabs defaultIndex={0}>
                {/* --- System Settings --- */}
                <Tab index={0} label="System Settings" >
                    <div className="flex flex-col space-y-4">
                        <SystemSettings />
                        {loading && (
                            <div className="flex items-center justify-center bg-light">
                                <Loader size={48} color="text-primary" />
                            </div>
                        )}
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default SettingsLayout;
