import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoggedOut } from "../../store/features/auth/authSlice";
import { RootState } from "../../store";

const Topbar = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(userLoggedOut());
    toast.success("Logged Out");
    navigate("/login");
  };
  return (
    <div className="fixed top-0 right-0 w-[calc(100%-15vw)] bg-white border-b shadow-md shadow-slate-100 px-5 py-[10px] flex z-[20] h-[7vh] items-center justify-end">
      <div className="flex items-center gap-3">
        <div className="font-bold">Hello, {auth.user.name}</div>
        <div>|</div>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Topbar;
