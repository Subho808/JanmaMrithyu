import React, { useEffect } from "react";
import Header from "../layouts/Header/Header";
import Sidebar from "../layouts/SideBar/SideBar";
import Footer from "../layouts/Footer/Footer";
import Switcher from "../layouts/Switcher/Switcher";
import RightSidebar from "../layouts/RightSidebar/RightSidebar";
import * as Switcherdata from "../data/Switcher/Switcherdata";
import { Outlet } from "react-router-dom";
import TabToTop from "../layouts/TabToTop/TabToTop";
import { Helmet } from "react-helmet";
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
     <Helmet>
        <title>birth death certificate</title>
        <meta name="description" content="west bengal birth certificate download" />
        <meta name="keywords" content=" janma praman patra, west bengal birth certificate, mrityu praman patra" />
      </Helmet>
      <TabToTop />
      <div className="page">
        <div className="page-main">
        
        <h4 style={{visibility: "hidden"}}>janma certificate</h4>
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
