import { Form, Formik, FormikProps } from "formik";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { object, ref, string } from "yup";
import Button from "../components/Button";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import {
  useLoginAdminMutation,
  useRegisterAdminMutation,
} from "../store/features/admin/adminApi";
import { userLoggedIn } from "../store/features/auth/authSlice";
import {
  useLoginInstitutionMutation,
  useRegisterInstitutionMutation,
} from "../store/features/institution/institutionApi";
import {
  useLoginInstructorMutation,
  useRegisterInstructorMutation,
} from "../store/features/instructor/instructorApi";
import {
  useLoginLearnerMutation,
  useRegisterLearnerMutation,
} from "../store/features/learner/learnerApi";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm: "",
  type: "learner",
  latitude: "23.7984463",
  longitude: "90.4031033",
};

const validationSchema = object().shape({
  name: string().required("Name is required."),
  email: string()
    .required("Email is required.")
    .email("Please enter a valid email address."),
  password: string()
    .required("Password is required.")
    .min(8, "Password must be 8 characters."),
  confirm: string()
    .required("Please retype your password.")
    .oneOf([ref("password")], "Passwords does not match"),
  type: string()
    .required("Please select a type")
    .oneOf(["admin", "institution", "instructor", "learner"]),
  latitude: string().when("type", {
    is: "learner" || "institution",
    then: (schema) => schema.required("Latitude is required"),
  }),
  longitude: string().when("type", {
    is: "learner" || "institution",
    then: (schema) => schema.required("Longitude is required"),
  }),
});

const Login = () => {
  const formikRef = useRef<FormikProps<any>>(null);
  const [registerAdmin] = useRegisterAdminMutation();
  const [loginAdmin] = useLoginAdminMutation();
  const [registerInstitution] = useRegisterInstitutionMutation();
  const [loginInstitution] = useLoginInstitutionMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      if (values.type === "admin") {
        registerAdmin({
          name: values.name,
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((result: any) => {
            if (result && result.status === 201) {
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
                });
            }
          });
      } else if (values.type === "institution") {
        console.log({
          name: values.name,
          email: values.email,
          password: values.password,
          latitude: values.latitude,
          longitude: values.longitude,
        });

        registerInstitution({
          name: values.name,
          email: values.email,
          password: values.password,
          latitude: values.latitude,
          longitude: values.longitude,
        })
          .unwrap()
          .then((result: any) => {
            if (result && result.status === 201) {
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
                });
            }
          });
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    //getting location from browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const formik = formikRef.current;
        formik?.setFieldValue("latitude", latitude.toString());
        formik?.setFieldValue("longitude", longitude.toString());
      });
    }
  }, []);

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
          {({ values }) => {
            return (
              <Form className="flex flex-col items-center justify-between">
                <TextInput
                  name="name"
                  type="text"
                  label="Name"
                  containerStyle={`w-full`}
                  size="small"
                />
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
                <TextInput
                  name="confirm"
                  type="password"
                  label="Confirm Password"
                  containerStyle={`w-full`}
                  size="small"
                />
                <SelectInput
                  containerStyle={"w-full"}
                  label="Type"
                  size="small"
                  name="type"
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "institution", label: "Institution" },
                  ]}
                />
                {(values.type === "learner" ||
                  values.type === "institution") && (
                    <TextInput
                      name="latitude"
                      type="text"
                      label="Latitude"
                      containerStyle={`w-full`}
                      size="small"
                    />
                  )}
                {(values.type === "learner" ||
                  values.type === "institution") && (
                    <TextInput
                      name="longitude"
                      type="text"
                      label="Longitude"
                      containerStyle={`w-full`}
                      size="small"
                    />
                  )}

                <Button
                  size="small"
                  className="w-full"
                  variant="primary"
                  type="submit"
                >
                  Register
                </Button>
              </Form>
            );
          }}
        </Formik>
        <div className="text-xs my-3 text-center">
          <Link to={"/login"}>Already registered? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
