import "../../../node_modules/metismenujs/scss/metismenujs.scss";
import mainMenuItems from "../../config/menu";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import AccordionItem from "../Accordion";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const Sidebar = () => {
  /* accordion toggle */
  const [active, setActive] = useState(0);

  const handleToggle = (index: number) => {
    if (active === index) {
      setActive(0);
    } else {
      setActive(index);
    }
  };

  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="bg-white h-screen fixed z-20 left-0 top-0 bottom-0 w-[250px] border-r flex flex-col items-center">
      <div className="font-bold p-3 text-lg flex items-center justify-center">
        Learning Token
      </div>
      <div className="flex flex-col gap-4 mt-3 w-max">
        {mainMenuItems.map((menu: any, mainIndex: number) => {
          if (
            !menu.subMenu &&
            menu.requiredPermissions.includes(auth.user.type)
          ) {
            return (
              <NavLink
                key={mainIndex}
                to={menu.to}
                className={({ isActive }: any) =>
                  `py-3 px-6 rounded-lg hover:text-white hover:bg-[#013A44] ${
                    isActive ? "bg-[#013A44] text-white" : "text-gray-600"
                  }`
                }
              >
                {menu.name}
              </NavLink>
            );
          } else if (menu.subMenu) {
            const hasMenuPermission = menu.subMenu
              .map((i: any) => i.requiredPermissions)
              .flat();

            const hasSubPermission = [auth.user.type].some((i) =>
              hasMenuPermission.includes(i)
            );

            return (
              hasSubPermission && (
                <AccordionItem
                  active={active}
                  handleToggle={handleToggle}
                  data={{ id: mainIndex, name: menu.name }}
                  key={mainIndex}
                >
                  <div className="ml-8 mt-2">
                    {menu.subMenu.map((item: any, index: number) => {
                      const show = item.requiredPermissions.includes(
                        auth.user.type
                      );
                      return (
                        show && (
                          <div
                            className="flex items-center justify-end my-2"
                            key={index}
                          >
                            <NavLink
                              key={index}
                              to={item.to}
                              className={({ isActive }: any) =>
                                `py-3 px-6 rounded-lg hover:text-white hover:bg-[#013A44] w-full ${
                                  isActive
                                    ? "bg-[#013A44] text-white"
                                    : "text-gray-600"
                                }`
                              }
                            >
                              {item.name}
                            </NavLink>
                          </div>
                        )
                      );
                    })}
                  </div>
                </AccordionItem>
              )
            );
          } else {
            return null;
          }
        })}

        <div></div>
      </div>
    </div>
  );
};

export default Sidebar;
