import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
//import "./scpl_v3_jacket_appl";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./main/common/common";
import { DeveloperMaster } from "./main/su/SUF00014/SUF00014_1";
import IpBlockInformation from "./main/su/SUF00028/SUF00028_1";
import {JsonComposer} from "./main/common/JsonComposer";







//import {LocationTree} from "./main/common/CMF00000_03";
const JsonViewer = React.lazy(()=> import("./main/common/JsonViewer"));
const JsonEditorViewer = React.lazy(()=> import("./main/common/JsonEditorViewer"));
//const JsonComposer = React.lazy(()=> import("./main/common/JsonComposer"));
//const MyComponent = lazy(() => import('./MyComponent'))
//const InstallationProfile = React.lazy(() =>import("./main/su/SUF00027/SUF00027_1"));
const Switcherlayout = React.lazy(()=>import("./components/switcherlayout"));

//App
const App = React.lazy(() => import("./components/app"));
const Custompages = React.lazy(() => import("./components/custompages"));


//Dashboard

const ModuleHome = React.lazy(()=> import("./main/common/CMF00000_05"));

//Common
const Login = React.lazy(()=>import("./main/common/CMF00000_01"));
const LocationTree = React.lazy(()=> import("./main/common/CMF00000_03"));
const LocationList = React.lazy(()=> import("./main/common/CMF00000_04"));
const ChangePassword = React.lazy(()=> import("./main/common/CMF00000_02"));

//SU
const GetAllRecords = React.lazy(() => import("./src/main/admin/GetAllData/GetAllData"));
const ModuleGroup = React.lazy(() => import("./main/su/SUF00001/SUF00001_01"));
const ModGpMulForm = React.lazy(() => import("./main/su/SUF00001/SUF00001_03"));

const RoleDefination = React.lazy(() => import("./main/su/SUF00002/SUF00002_01"));
const RoleDefMulForm = React.lazy(() => import("./main/su/SUF00002/SUF00002_03"));

const LocationType = React.lazy(() => import("./main/su/SUF00004/SUF00004_01"));
const LocTypMulForm = React.lazy(() => import("./main/su/SUF00004/SUF00004_03"));

const FinancialYearMaster= React.lazy(() => import("./main/su/SUF00012/SUF00012_01"));
const FinYrMulForm = React.lazy(() => import("./main/su/SUF00012/SUF00012_03"));

const CurrencyMaster= React.lazy(() => import("./main/su/SUF00016/SUF00016_01"));
const CurMstMulForm = React.lazy(() => import("./main/su/SUF00016/SUF00016_03"));

const StateMaster= React.lazy(() => import("./main/su/SUF00025/SUF00025_01"));
const StateMstMulForm = React.lazy(() => import("./main/su/SUF00025/SUF00025_03"));

const SecretQuestionSetting= React.lazy(() => import("./main/su/SUF00026/SUF00026_01"));
const SecQustSetMulForm = React.lazy(() => import("./main/su/SUF00026/SUF00026_03"));

const ApiMaster= React.lazy(() => import("./main/su/SUF00115/SUF00115_01"));




//custom Pages
//const Login = React.lazy(()=>import("./components/CustomPages/Login/Login"));
const Register = React.lazy(()=>import("./components/CustomPages/Register/Register"));
const ForgotPassword = React.lazy(()=>import("./components/CustomPages/ForgotPassword/ForgotPassword"));
const LockScreen = React.lazy(()=>import("./components/CustomPages/LockScreen/LockScreen"));

//Errorpages
const Errorpage400 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/400/400"));
const Errorpage401 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/401/401"));
const Errorpage403 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/403/403"));
const Errorpage500 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/500/500"));
const Errorpage503 = React.lazy(()=>import("./components/ErrorPages/ErrorPages/503/503"));

export const Private = ({ children}) => {
  const flg = isAuthenticated();
      
  return flg ? children : <Navigate to={`${process.env.PUBLIC_URL}/`} />;
    
}

const Loaderimg = () => {
  return (
    <div id="global-loader">
      <img
        src={require("./assets/images/loader.svg").default}
        className="loader-img"
        alt="Loader"
      />
    </div>
  );
};
const Root = () => {
  return (
    <Fragment>
      <BrowserRouter>
      <React.Suspense fallback={Loaderimg()}>
        <Routes>
        
          <Route
            path={`${process.env.PUBLIC_URL}/`}
            element={<App />}
          >
             <Route
              path={`${process.env.PUBLIC_URL}/CMF00000_03`}
              element={<Private><LocationTree /></Private>}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/CMF00000_04`}
              element={<Private><LocationList /></Private>}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/jsonviewer`}
              element={<JsonViewer />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/jsoneditorviewer`}
              element={<JsonEditorViewer />}
            />
             <Route
              path={`${process.env.PUBLIC_URL}/jsoncomposer`}
              element={<JsonComposer />}
            />
             <Route
              path={`${process.env.PUBLIC_URL}/CMF00000_02`}
              element={<Private><ChangePassword /></Private>}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/CMF00000_05`}
              element={<ModuleHome />}
            />
           

              <Route
                  path={`${process.env.PUBLIC_URL}/GetAllData`}
                  element={<GetAllRecords />}
                />
              <Route
                  path={`${process.env.PUBLIC_URL}/SUF00001_01`}
                  element={<ModuleGroup />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00001_03`}
                  element={<ModGpMulForm />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00002_01`}
                  element={<RoleDefination />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00002_03`}
                  element={<RoleDefMulForm />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00004_01`}
                  element={<LocationType />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00004_03`}
                  element={<LocTypMulForm />}
                />
                 <Route
                  path={`${process.env.PUBLIC_URL}/SUF00012_01`}
                  element={<FinancialYearMaster />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00012_03`}
                  element={<FinYrMulForm />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00016_01`}
                  element={<CurrencyMaster />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00016_03`}
                  element={<CurMstMulForm />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00025_01`}
                  element={<StateMaster />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00025_03`}
                  element={<StateMstMulForm />}
                />
                 <Route
                  path={`${process.env.PUBLIC_URL}/SUF00026_01`}
                  element={<SecretQuestionSetting />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00026_03`}
                  element={<SecQustSetMulForm />}
                />
                <Route
                  path={`${process.env.PUBLIC_URL}/SUF00115_01`}
                  element={<ApiMaster />}
                />
              <Route
                path={`${process.env.PUBLIC_URL}/SUF00014_1`}
                element={<DeveloperMaster/>}
              />

               <Route
                path={`${process.env.PUBLIC_URL}/SUF00028_1`}
                element={<IpBlockInformation />}
              />
          
           
          </Route>
          
          <Route
            path={`${process.env.PUBLIC_URL}/`}
            element={<Custompages />}
          >
           
             <Route index element={<Login />} />
            <Route
              path={`${process.env.PUBLIC_URL}/CMF00000/login`}
              element={<Login />}
            />
           
           
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/register`}
              element={<Register />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/forgotPassword`}
              element={<ForgotPassword />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/lockScreen`}
              element={<LockScreen />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage401`}
              element={<Errorpage401 />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage403`}
              element={<Errorpage403 />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage500`}
              element={<Errorpage500 />}
            />
            <Route
              path={`${process.env.PUBLIC_URL}/custompages/errorpages/errorpage503`}
              element={<Errorpage503 />}
            />
            <Route path="*" element={<Errorpage400 />} />
          </Route>
        </Routes>
        </React.Suspense>
      </BrowserRouter>
    </Fragment>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
