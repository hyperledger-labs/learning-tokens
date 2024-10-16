import { Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { object, string } from "yup";
import TextInput from "../../components/TextInput";
import Button from "../../components/Button";
import { useParams } from "react-router-dom";

const initialValues = {
  organizer: "",
  community: "",
  fieldsOfKnowledge: "",
  taxonomyOfSkills: "",
};

const validationSchema = object().shape({
  organizer: string().required("organizer is required."),
  community: string().required("community is required."),
  fieldsOfKnowledge: string().required("fieldsOfKnowledge is required."),
  taxonomyOfSkills: string().required("taxonomyOfSkills is required."),
});

const ScoringGuide = () => {
  const { id } = useParams();
  const formikRef = useRef<FormikProps<any>>(null);

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formikRef}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="flex flex-col justify-between w-[700px] ">
          <div className="border rounded-md border-gray-700 bg-gray-200">
            <div className="flex flex-col items-center border-gray-700 border-b">
              <h1 className="font-bold">Scoring Guide</h1>
              <h1 className="font-bold">Metadata</h1>
            </div>

            <div className="p-3 font-medium">EventID :{id}</div>

            <div className="p-3 border-gray-700 border-t">
              <h1 className="font-bold">
                Institution : Hyperledger Foundation
              </h1>
              <TextInput
                name="community"
                type="text"
                label="community"
                containerStyle={`w-full`}
              />
              <TextInput
                name="organizer"
                type="text"
                label="organizer"
                containerStyle={`w-full`}
              />

              <h1 className="font-bold">
                Instructors : Invited speakers at presentations
              </h1>

              <TextInput
                name="fieldsOfKnowledge"
                type="text"
                label="fieldsOfKnowledge"
                containerStyle={`w-full`}
              />
              <TextInput
                name="taxonomyOfSkills"
                type="text"
                label="taxonomyOfSkills"
                containerStyle={`w-full`}
              />
            </div>

            <div>
              <div className="border-t border-gray-700">
                <h1 className="text-center font-medium">
                  Token Creation and Distribution
                </h1>
              </div>
              <table className="w-full">
                <tr className="border-b border-gray-700">
                  <td className="text-center font-bold">Type of Tokens</td>
                  <td className="text-center font-bold">Number of Tokens</td>
                  <td className="text-center font-bold">Support Material</td>
                </tr>
                <tr className="">
                  <td className="text-center font-bold py-3">
                    Attendance Token
                  </td>
                  <TextInput
                    name="attendanceToken"
                    type="text"
                    containerStyle={`w-full`}/>
                  <td className="text-center font-bold py-3">
                    Zoom Attendance Report (ID)
                  </td>
                </tr>
                <tr className="">
                  <td className="text-center font-bold py-3">
                    Learner Score Token
                  </td>
                    <TextInput
                      name="learnerScoreToken"
                      type="text"
                      containerStyle={`w-full`}/>  
                  <td className="text-center font-bold py-3">
                    Zoom Poll-Quiz, PostEvent Quiz (ID)
                  </td>
                </tr>
                <tr className="">
                  <td className="text-center font-bold py-3">
                    Help Token for Learners
                  </td>
                  <TextInput
                    name="helpToken"
                    type="text"
                    containerStyle={`w-full`}/>
                  <td className="text-center font-bold py-3">Zoom Poll (ID)</td>
                </tr>
                <tr className="">
                  <td className="text-center font-bold py-3">
                    Instructor Score Token
                  </td>
                  <TextInput
                    name="instructorScoreToken"
                    type="text"
                    containerStyle={`w-full`}/>
                  <td className="text-center font-bold py-3">
                    Zoom Q&A + Chat analytics (ID)
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <Button
            size="small"
            className="w-full mt-3"
            variant="primary"
            type="submit"
          >
            Add Scoring Guide
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ScoringGuide;
