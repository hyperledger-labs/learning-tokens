import { Form, Formik, FormikProps } from "formik";
import { useRef, useState } from "react";
import { array, number, object, string } from "yup";
import SelectInput from "../../components/SelectInput";
import { Container, Card, Button, FormGroup } from "react-bootstrap";
import { useEventContext } from "../../contexts/EventContext";
import { SuccessModal } from "../../components/Modal/SuccessModal";
import { SmartcontractFunctionsEnum } from "../../enums/smartcontract-functions.enum";
import axios from "axios";

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
  const { eventData } = useEventContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (values: any) => {
    console.log("Form Submitted with values:", values);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/smartcontract/token-distributions`, {
        functionName: SmartcontractFunctionsEnum.BATCH_MINT_ATTENDANCE_TOKEN,
        preEventId: eventData.id,
      });

      console.log(`eventData: ${eventData}`);

      if (response.status === 201) {
        setModalMessage(response.data.message);
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
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
    <Container className="my-4">
      <Card className="p-4" style={{ width: '600px', margin: 'auto' }}>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formikRef}
            onSubmit={handleSubmit}
          >
            {({handleSubmit}) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <h5>Token</h5>
                  <SelectInput
                    containerStyle={"w-100"}
                    size="small"
                    name="token_type"
                    options={tokenType}
                  />
                </FormGroup>
                <Button
                  size="sm"
                  className="w-100 mt-3"
                  variant="btn btn-outline-primary"
                  type="submit"
                >
                  Distribute
                </Button>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      <SuccessModal show={isModalVisible} message={modalMessage} onClose={closeModal} />

    </Container>
  );
};

export default DistributeToken;
