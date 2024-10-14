import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface Props {
  children: React.ReactNode;
  permissions?: string[];
  item?: any;
}
const ProtectedSidebar: FC<Props> = ({ children, permissions = [], item }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const hasRequiredPermissions = [user.type].some((i: any) =>
    permissions.includes(i)
  );

  if (item && item.subMenu) {
    const subPermissions = item.subMenu
      .map((i: any) => i.requiredPermissions)
      .flat();

    const hasSubPermissions = [user.type].some((i) =>
      subPermissions.includes(i)
    );

    if (user.type === "admin" || hasSubPermissions) {
      return <>{children}</>;
    } else {
      return null;
    }
  } else if (user.type === "admin" || hasRequiredPermissions) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default ProtectedSidebar;
