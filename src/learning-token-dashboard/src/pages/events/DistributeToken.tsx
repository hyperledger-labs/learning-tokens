import { Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { array, number, object, string } from "yup";
import Button from "../../components/Button";
import SelectInput from "../../components/SelectInput";

const initialValues = {
  token_type: "attendance_token",
  attendance: null,
};

const validationSchema = object().shape({
  token_type: string().required("Please select an institution"),
  attendance: array()
    .of(
      object().shape({
        courseId: number(),
        amount: number(),
        learnerId: number(),
        fieldOfKnowledge: string(),
        skillName: string(),
      })
    )
    .required("At least 1 attendance should be added"),
});
const DistributeToken = () => {
  const formikRef = useRef<FormikProps<any>>(null);

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  const tokenType = [
    { value: "attendance_token", label: "Attendance Token" },
    // { value: "batch_attendance_token", label: "Batch Attendance Token" },
    // { value: "helping_token", label: "Helping Token" },
    // { value: "batch_helping_token", label: "Batch Helping Token" },
    // { value: "score_token", label: "Score Token" },
    // { value: "batch_score_token", label: "Batch Score Token" },
    // { value: "instructorScore_token", label: "Instructor Score Token" },
    // {
    //   value: "batch_instructorScore_token",
    //   label: "Batch Instructor Score Token",
    // },
  ];

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
            <SelectInput
              containerStyle={"w-full"}
              label="Token"
              size="small"
              name="token_type"
              options={tokenType}
            />
            <Button
              size="small"
              className="w-full mt-3"
              variant="primary"
              type="submit"
            >
              Distribute
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default DistributeToken;
