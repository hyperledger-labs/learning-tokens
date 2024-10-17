import "../../../node_modules/metismenujs/scss/metismenujs.scss";
import mainMenuItems, { MenuItem } from "../../config/menu";
import { NavLink } from "react-router-dom";
import { useState, useMemo } from "react";
import AccordionItem from "../Accordion";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FiChevronRight } from "react-icons/fi";

const Sidebar = () => {
  const [active, setActive] = useState(0);
  const auth = useSelector((state: RootState) => state.auth);

  const handleToggle = (index: number) => {
    setActive(active === index ? 0 : index);
  };

  const filteredMenuItems = useMemo(() => {
    return mainMenuItems.filter((menu: MenuItem) => {
      if (!menu.subMenu) {
        return menu.requiredPermissions?.includes(auth.user.type || "");
      }
      const hasSubPermission = menu.subMenu.some((item) =>
        item!.requiredPermissions!.includes(auth.user.type)
      );
      return hasSubPermission;
    });
  }, [auth.user.type]);

  return (
    <div className="bg-gradient-to-b from-[#013A44] to-[#025E6E] h-screen fixed z-20 left-0 top-0 bottom-0 w-[280px] shadow-lg flex flex-col w-[15em]">
      <div className="font-bold p-6 text-2xl h-fit flex items-center justify-center text-white border-b border-[#ffffff33]">
        {/* <img src="/path-to-your-logo.svg" alt="Logo" className="h-8 mr-3" /> */}
        Learning Token
      </div>
      <div className="flex flex-col gap-2 mt-6 w-full overflow-y-auto custom-scrollbar">
        {filteredMenuItems.map((menu: MenuItem, mainIndex: number) => (
          <SidebarMenuItem
            key={mainIndex}
            menu={menu}
            mainIndex={mainIndex}
            active={active}
            handleToggle={handleToggle}
            userType={auth.user.type}
          />
        ))}
      </div>
    </div>
  );
};

const SidebarMenuItem = ({
  menu,
  mainIndex,
  active,
  handleToggle,
  userType,
}) => {
  if (!menu.subMenu) {
    return (
      <NavLink
        to={menu.to}
        className={({ isActive }) =>
          `py-3 px-6 rounded-md hover:bg-[#ffffff22] transition-all duration-200 flex items-center ${
            isActive
              ? "bg-[#ffffff33] text-white font-semibold"
              : "text-gray-200"
          }`
        }
      >
        {menu.icon && <menu.icon className="mr-3 text-xl" />}
        {menu.name}
      </NavLink>
    );
  }

  return (
    <AccordionItem
      active={active}
      handleToggle={handleToggle}
      data={{ id: mainIndex, name: menu.name }}
      className="border-b border-[#ffffff22] last:border-b-0"
    >
      <div className="ml-6 mt-2 mb-4">
        {menu.subMenu
          .filter((item) => item.requiredPermissions.includes(userType))
          .map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `py-2 px-4 rounded-md hover:bg-[#ffffff22] transition-all duration-200 flex items-center my-1 ${
                  isActive
                    ? "bg-[#ffffff33] text-white font-semibold"
                    : "text-gray-300"
                }`
              }
            >
              <FiChevronRight className="mr-2 text-sm" />
              {item.name}
            </NavLink>
          ))}
      </div>
    </AccordionItem>
  );
};

export default Sidebar;
