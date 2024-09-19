import { Navigate, Outlet } from "react-router-dom";
import Loading from "../components/Loading";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import ChatBar from "@/components/ChatBar";

const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useCurrentUser();

  return (
    <div className="flex gap-7 p-5 transition-all ease-linear">
      {isLoading ? (
        <Loading />
      ) : !isAuthenticated ? (
        <Navigate to="/sign-in" />
      ) : (
        <>
          <ChatBar />
          <Outlet />
        </>
      )}
    </div>
  );
};

export default ProtectedRoute;
