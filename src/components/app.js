import React, { useEffect } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import Switcher from "../layouts/Switcher/Switcher";
import RightSidebar from "../layouts/RightSidebar/RightSidebar";
import * as Switcherdata from "../data/Switcher/Switcherdata";
import { Outlet } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";

export default function App() {
  const sideBarAccess = sessionStorage.getItem("sideBarAccess");

  // useEffect(() => {
  //   const appContent = document.querySelector('.app-content');

  //   if (sideBarAccess === '501') {
  //     appContent.style.marginLeft = '270px';
  //     // appContent.style.marginRight = '270px';
  //   } else {
  //     appContent.style.marginLeft = '0';
  //     appContent.style.marginRight = '0';
  //   }
  // }, [sideBarAccess]);

  return (
    <div className="horizontalMenucontainer">
      <TabToTop />
      <div className="page">
        <div className="page-main">
          <Header />
          {<Sidebar />}
          <div className="main-content app-content">
          <div className="side-app">
            <div className="main-container container-fluid"
              onClick={() => {
                Switcherdata.responsiveSidebarclose();
                Switcherdata.Horizontalmenudefultclose();
              }}
            >
              <Outlet />
            </div>
            </div>
          </div>
        </div>
        <RightSidebar />
        <Switcher />
        <Footer />
      </div>
    </div>
  );
}
