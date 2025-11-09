import { Outlet } from "react-router";
import CommonLayout from "./components/layout/CommonLayout";
// import { generateRoutes } from "./utils/generateRoute";
// import { adminSidebarItems } from "./router/adminSidebarItems";

function App() {
  // console.log(generateRoutes(adminSidebarItems));
  return (
    <>
      <CommonLayout>
        <Outlet />
      </CommonLayout>
    </>
  );
}

export default App;
