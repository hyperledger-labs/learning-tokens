import { FC, useEffect, useRef, useState } from "react";
import { Link, NavLink, matchPath, useLocation } from "react-router-dom";
import ProtectedSidebar from "./ProtectedSidebar";

type Props = {
  className?: string;
  menuItem: any;
};
const SidebarMenuItem: FC<Props> = ({ className, menuItem }) => {
  const menuItemRef = useRef<HTMLLIElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { pathname } = useLocation();

  const classes =
    "mb-1 flex px-5 py-[12px] rounded-[10px] items-center duration-600 hover:bg-[#013A44] hover:text-white focus:text-white focus:bg-[#013A44] hover:no-underline focus:no-underline hover:fill-white leading-none ";

  useEffect(() => {
    if (
      menuItem.subMenu &&
      menuItem.subMenu.filter((item: any) => {
        return (
          pathname?.includes(item.to as string) ||
          (item.additionalChildRoutes?.filter(
            (route: any) =>
              route.includes(pathname as string) || matchPath(route, pathname)
          )?.length as number) > 0
        );
      }).length > 0
    ) {
      setDropdownOpen(true);
    } else if (
      menuItem.subMenu ||
      menuItemRef.current?.classList.contains("mm-active")
    ) {
      setDropdownOpen(false);
      menuItemRef.current?.classList.remove("mm-active");
      if (menuItemRef.current?.firstChild) {
        // @ts-ignore
        menuItemRef.current?.firstChild?.setAttribute("aria-expanded", "false");
      }
    }
  }, [pathname]);

  return (
    <li className={className} ref={menuItemRef}>
      {menuItem.subMenu ? (
        <Link to="#" className={`${classes} has-arrow text-gray-600`}>
          {menuItem.icon && (
            <span className="text-xl mr-3 w-[20px]">
              <menuItem.icon />
            </span>
          )}
          <span className="ml-1 font-medium">{menuItem.name}</span>
        </Link>
      ) : (
        <NavLink
          to={menuItem.to || "#"}
          className={({ isActive }: any) => {            
            return `${classes} ${
              isActive ? "bg-[#013A44] text-white" : "text-gray-600"
            }`;
          }}
        >
          {menuItem.icon && (
            <span className="text-xl mr-3 w-[20px]">
              <menuItem.icon />
            </span>
          )}
          <span className="mx-2 font-medium">{menuItem.name}</span>
        </NavLink>
      )}

      {menuItem.subMenu && (
        <ul className={`ml-8 ${dropdownOpen ? "mm-show" : "mm-collapse"}`}>
          {menuItem.subMenu.map((item: any, index: any) => {
            return (
              <ProtectedSidebar
                item={item}
                permissions={item.requiredPermissions}
                key={index}
              >
                <SidebarMenuItem key={index} menuItem={item} className="mb-1" />
              </ProtectedSidebar>
            );
          })}
        </ul>
      )}
    </li>
  );
};
export default SidebarMenuItem;
