import { Routes, Route } from "react-router-dom";
import { BoxContainer } from "./components";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import MainLayout from "./components/MainLayout/MainLayout";
import Plans from "./pages/Plans/Plans";
import Profile from "./pages/Profile/Profile";
import Recipes from "./pages/Recipes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <BoxContainer>Dashboard</BoxContainer>
          </MainLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />
      <Route path="/recipes" element={<MainLayout><Recipes/></MainLayout>} />
      <Route
        path="/plans"
        element={
          <MainLayout>
            <Plans />
          </MainLayout>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<MainLayout>No matches</MainLayout>} />
    </Routes>
  );
};
export default AppRoutes;
