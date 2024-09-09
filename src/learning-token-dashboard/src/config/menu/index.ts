import { BsBoxSeam, BsGrid } from "react-icons/bs";

export interface MenuItem {
  name: string;
  to: string;
  icon?: React.ElementType;
  requiredPermissions?: string[];
  subMenu?: MenuItem[];
}

const mainMenuItems: MenuItem[] = [
  {
    name: "Dashboard",
    to: "/",
    icon: BsGrid,
    requiredPermissions: ["institution", "instructor", "learner", "admin"],
  },
  {
    name: "Instructor",
    to: "",
    subMenu: [
      {
        name: "List",
        to: "/instructor",
        requiredPermissions: ["institution", "admin"],
      },
    ],
    icon: BsBoxSeam,
  },
  {
    name: "Institution",
    to: "",
    subMenu: [
      {
        name: "List",
        to: "/institution",
        requiredPermissions: ["admin"],
      },
    ],
    icon: BsBoxSeam,
  },
  {
    name: "Events",
    to: "",
    subMenu: [
      {
        name: "List",
        to: "/events/list-template",
        requiredPermissions: ["instructor"],
      },
      {
        name: "Events List",
        to: "/events/list",
        requiredPermissions: ["instructor"],
      },
    ],
    icon: BsBoxSeam,
  },
  {
    name: "Learner",
    to: "",
    subMenu: [
      {
        name: "List",
        to: "/learner",
        requiredPermissions: ["institution", "instructor", "admin"],
      },
    ],
    icon: BsBoxSeam,
  },
  {
    name: "Course",
    to: "",
    subMenu: [
      {
        name: "List",
        to: "/course/list",
        requiredPermissions: ["instructor"],
      },
      {
        name: "Add",
        to: "/course/add",
        requiredPermissions: ["instructor"],
      },
      // {
      //   name: "Set Token",
      //   to: "/course/set-token",
      //   requiredPermissions: ["instructor", "admin"],
      // },
      {
        name: "Distribute Token",
        to: "/course/attendance",
        requiredPermissions: ["instructor"],
      },
    ],
    icon: BsBoxSeam,
  },
  {
    name: "Generate Key",
    to: "institution-key",
    requiredPermissions: ["institution"],
    icon: BsBoxSeam,
  },
  // {
  //   name: "Excel",
  //   to: "",
  //   subMenu: [
  //     {
  //       name: "List",
  //       to: "/excel",
  //     },
  //   ],
  //   icon: BsBoxSeam,
  // },
];

export default mainMenuItems;
