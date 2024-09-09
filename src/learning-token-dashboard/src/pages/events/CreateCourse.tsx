import { Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { array, object, string } from "yup";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

const initialValues = {
  courseName: "",
  learnerAddress: [],
};

const validationSchema = object().shape({
  courseName: string().required("Name is required."),
  learnerAddress: array().min(1).required("At least 1 learner should be added"),
});

const CreateCourse = () => {
  const formikRef = useRef<FormikProps<any>>(null);

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  return (
    <div className="w-[800px] mx-auto my-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        innerRef={formikRef}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex flex-col justify-between">
            <TextInput
              name="courseName"
              type="text"
              label="Course Name"
              containerStyle={`w-full`}
              size="small"
            />

            <h1>Learners List</h1>
            <div className="flex flex-col max-h-[200px] overflow-scroll">
              <div className="ml-2 border">
                Khairul Hasan - 0x165464845165sdf16sdf46sd54f654sd1f
              </div>
              <div className="ml-2 border">
                Khairul Hasan - 0x165464845165sdf16sdf46sd54f654sd1f
              </div>
              <div className="ml-2 border">
                Khairul Hasan - 0x165464845165sdf16sdf46sd54f654sd1f
              </div>
              <div className="ml-2 border">
                Khairul Hasan - 0x165464845165sdf16sdf46sd54f654sd1f
              </div>
              <div className="ml-2 border">
                Khairul Hasan - 0x165464845165sdf16sdf46sd54f654sd1f
              </div>
            </div>

            <Button
              size="small"
              className="w-full mt-3"
              variant="primary"
              type="submit"
            >
              Create Course
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCourse;
