export const useUserManagement = () =>{
    const UserData = [
    ];
  
    const columnHeaders: { header: string; accessor: keyof typeof UserData[0] }[] = [
      { header: "Name", accessor: "name" },
      { header: "Department", accessor: "department" },
      { header: "Status", accessor: "status" },
    ];
  
    const subMenuOpts: { label: string; href: string; target?: "_blank" | "_self" | "_parent" | "_top" }[] = [
      { label: "View Profile", href: "/profile" },
      { label: "Settings", href: "/settings" },
      { label: "External Link", href: "https://example.com", target: "_blank" },
    ];
    return {
        UserData,
        columnHeaders,
        subMenuOpts
    }
}