import { BsBoxSeam, BsGrid } from "react-icons/bs";

const mainMenuItems = [
  {
    name: "Dashboard",
    to: "/",
    icon: BsGrid,
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
