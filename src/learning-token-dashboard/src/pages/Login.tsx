import { Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { object, string } from "yup";
import Button from "../components/Button";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import { useLoginAdminMutation } from "../store/features/admin/adminApi";
import { userLoggedIn } from "../store/features/auth/authSlice";
import { useLoginInstitutionMutation } from "../store/features/institution/institutionApi";
import { useLoginInstructorMutation } from "../store/features/instructor/instructorApi";
import { useLoginLearnerMutation } from "../store/features/learner/learnerApi";

const initialValues = {
  email: "",
  password: "",
  type: "learner",
};

const validationSchema = object().shape({
  email: string()
    .required("Email is required.")
    .email("Please enter a valid email address."),
  password: string()
    .required("Password is required.")
    .min(8, "Password must be 8 characters."),
  type: string()
    .required("Please select a type")
    .oneOf(["admin", "institution", "instructor", "learner"]),
});

const Login = () => {
  const formikRef = useRef<FormikProps<any>>(null);
  const [loginAdmin] = useLoginAdminMutation();
  const [loginInstitution] = useLoginInstitutionMutation();
  const [loginInstructor] = useLoginInstructorMutation();
  const [loginLearner] = useLoginLearnerMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      if (values.type === "admin") {
        loginAdmin({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      } else if (values.type === "institution") {
        loginInstitution({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      } else if (values.type === "instructor") {
        loginInstructor({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      } else {
        loginLearner({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      }
    } catch (e) {}
  };
  return (
    <div className="min-h-screen min-w-[100vw] flex items-center justify-center">
      <div className="rounded border shadow p-5 w-[25vw]">
        <div className="font-bold text-xl text-center my-3">Learning-Token</div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          innerRef={formikRef}
          onSubmit={handleSubmit}
        >
          <Form className="flex flex-col items-center justify-between">
            <TextInput
              name="email"
              type="email"
              label="Email"
              containerStyle={`w-full`}
              size="small"
            />
            <TextInput
              name="password"
              type="password"
              label="Password"
              containerStyle={`w-full`}
              size="small"
            />
            <SelectInput
              containerStyle={"w-full"}
              label="Login As"
              size="small"
              name="type"
              options={[
                { value: "admin", label: "Admin" },
                { value: "institution", label: "Institution" },
                { value: "instructor", label: "Instructor" },
                { value: "learner", label: "Learner" },
              ]}
            />
            <Button
              size="small"
              className="w-full"
              variant="primary"
              type="submit"
            >
              Login
            </Button>
          </Form>
        </Formik>
        <div className="text-xs my-3 text-center">
          <Link to={"/register"}>Not registered? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
