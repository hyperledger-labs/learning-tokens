import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "../pages";

import Login from "../pages/Login";

import Register from "../pages/Register";
import Course from "../pages/course";
import Attendance from "../pages/course/Attendance";
import CourseNew from "../pages/course/CourseNew";
import SetToken from "../pages/course/SetToken";
import Institution from "../pages/institution";
import Instructor from "../pages/instructor";
import MasterLayout from "../pages/layouts/MasterLayout";
import Learner from "../pages/learner";
import GenerateKey from "../pages/institution/GenerateKey";
import Events from "../pages/events/Events";
import EventsAdd from "../pages/events/EventsAdd";
import { EventProvider } from "../contexts/EventContext";

const AllRoutes = () => {
  return (
    <EventProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MasterLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/course/list" element={<Course />} />
            <Route path="instructor" element={<Instructor />} />
            <Route path="institution" element={<Institution />} />
            <Route path="institution-key" element={<GenerateKey />} />
            <Route path="learner" element={<Learner />} />
            <Route path="course/add" element={<CourseNew />} />
            <Route path="course/set-token" element={<SetToken />} />
            <Route path="course/attendance" element={<Attendance />} />
            <Route path="events/list" element={<Events />} />
            <Route path="events/:id" element={<EventsAdd />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EventProvider>
  );
};

export default AllRoutes;
