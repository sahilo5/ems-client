import React from "react";
import { Tabs, Tab } from "../../components/Tabs";
import Browse from "../../components/Browse";
import ThreeDotDropdown from "../../components/ThreeDotDropdown";
import Button from "../../components/Button";
import { PlusCircleIcon } from "lucide-react";
import { useUserManagement } from "./UserManagement.hooks";

const EmpoloyeeManagement = () => {
  
  const {
    UserData,
    columnHeaders,
    subMenuOpts
  } = useUserManagement();

  const data = [
  ];

  const columns: { header: string; accessor: keyof typeof data[0] }[] = [
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Status", accessor: "status" },
  ];

  const opts: { label: string; href: string; target?: "_blank" | "_self" | "_parent" | "_top" }[] = [
    { label: "View Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
    { label: "External Link", href: "https://example.com", target: "_blank" },
  ];


  return (
    <div className="space-y-2">
      <Tabs defaultIndex={0}>
        <Tab index={0} label="User Management">
          <Browse
            title="User Management"
            data={data}
            columns={columns}
            footerContent={
              <div className="flex justify-between items-center">
                <span>Total Employees: {data.length}</span>
                <input
                  type="number"
                  value={data.length}
                  className="border px-2 py-1 rounded w-20"
                  readOnly
                />
              </div>
            }
            headerActions={
              <div className="flex items-center gap-2">
                <Button variant="secondary">{<PlusCircleIcon />}</Button>

                <ThreeDotDropdown options={opts} />

              </div>
            }
          />
        </Tab>
        <Tab index={1} label="Departments">
          <div>Departments View</div>
        </Tab>
        <Tab index={2} label="Leaves">
          <div>Leave Request List</div>
        </Tab>
      </Tabs>

    </div>
  );
};

export default EmpoloyeeManagement;
