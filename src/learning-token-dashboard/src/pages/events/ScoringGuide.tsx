import { Form, Formik, FormikProps } from "formik";
import { useRef, useState, useEffect } from "react";
import { number, object, string } from "yup";
import TextInput from "../../components/TextInput";
import { useParams } from "react-router-dom";
import { useEventContext } from "../../contexts/EventContext";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import axios from "axios";
import { SuccessModal } from "../../components/Modal/SuccessModal";

const initialValues = {
  organizer: "",
  community: "",
  fieldsOfKnowledge: "",
  taxonomyOfSkills: "",
  attendanceToken: 0,
  learnerScoreToken: 0,
  helpTokenAmount: 0,
  instructorScoreToken: 0,
};

const validationSchema = object().shape({
  organizer: string().required("Organizer is required."),
  community: string().required("Community is required."),
  fieldsOfKnowledge: string().required("Fields Of Knowledge is required."),
  taxonomyOfSkills: string().required("Taxonomy Of Skills is required."),
  attendanceToken: number()
      .required("attendanceToken is required.")
      .min(1, "Attendance Token must be at least 1."),
  learnerScoreToken: number()
      .required("learnerScoreToken is required.")
      .min(1, "Attendance Token must be at least 1."),
  helpTokenAmount: number()
      .required("helpTokenAmount is required.")
      .min(1, "Attendance Token must be at least 1."),
  instructorScoreToken: number()
      .required("instructorScoreToken is required.")
      .min(1, "Attendance Token must be at least 1."),
});

const ScoringGuide = () => {
  const { id } = useParams();
  const formikRef = useRef<FormikProps<any>>(null);
  const { eventData } = useEventContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [formEditable, setFormEditable] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  
  useEffect (() => {
    if (eventData.status !== "defineScoringGuide") {
      setFormEditable(false);
    }
  }, [eventData]);

  const handleSubmit = async (values: any) => {
    try {
      console.log(`handleSubmit values: ${values}`);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/event/create-scoring-guide`, {
        preEventId: eventData.id,
        meetingEventId: id,
        fieldOfKnowledge: values.fieldsOfKnowledge,
        taxonomyOfSkill: values.taxonomyOfSkills,
        attendanceToken: Number(values.attendanceToken),
        scoreTokenAmount: Number(values.learnerScoreToken),
        helpTokenAmount: Number(values.helpTokenAmount),
        instructorScoreToken: Number(values.instructorScoreToken),
      });

      if (response.status === 201) {
        setModalMessage(response.data.message);
        setModalVisible(true);
        setFormEditable(false);
      }
    } catch (error) {
      console.error("Error adding scoring guide:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Container className="mt-4">
      <Formik
        initialValues={{
          organizer: eventData?.organizerName || "",
          community: eventData?.community || "",
          fieldsOfKnowledge: eventData?.fieldsOfKnowledge || "",
          taxonomyOfSkills: eventData?.taxonomyOfSkills || "",
          attendanceToken: eventData?.onlineEvent?.scoringGuide?.attendanceToken || 0,
          learnerScoreToken: eventData?.onlineEvent?.scoringGuide?.scoreTokenAmount || 0,
          helpTokenAmount: eventData?.onlineEvent?.scoringGuide?.helpTokenAmount || 0,
          instructorScoreToken: eventData?.onlineEvent?.scoringGuide?.instructorScoreToken || 0,
        }}
        validationSchema={validationSchema}
        innerRef={formikRef}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center mb-5"><strong>Scoring Guide</strong></Card.Title>
                <Card.Subtitle className="mb-3 text-muted text-center"><strong>Metadata</strong></Card.Subtitle>

                <div className="font-medium border-top pt-3 mb-3"><strong>Event ID: {id}</strong></div>

                {eventData && (
                  <div className="border-top pt-3">
                    <div className="font-medium mb-3"><strong>Institution: {eventData.organization}</strong></div>
                    <Row>
                      <Col>
                        <TextInput
                          name="community"
                          type="text"
                          label="Community"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </Col>
                      <Col>
                        <TextInput
                          name="organizer"
                          type="text"
                          label="Organizer"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </Col>
                    </Row>

                    <div className="font-medium mb-3"><strong>Instructors: {eventData.speakersName.join(", ")}</strong></div>

                    <Row>
                      <Col>
                        <TextInput
                          name="fieldsOfKnowledge"
                          type="text"
                          label="Fields of Knowledge"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </Col>
                      <Col>
                        <TextInput
                          name="taxonomyOfSkills"
                          type="text"
                          label="Taxonomy of Skills"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </Col>
                    </Row>
                  </div>
                )}

                <div className="border-top border-bottom my-4">
                  <div className="font-medium text-center mt-2 mb-2">
                    <strong>Token Creation and Distribution</strong>
                  </div>
                </div>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="text-center">Type of Tokens</th>
                      <th className="text-center">Number of Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Attendance Token</td>
                      <td>
                        <TextInput
                          name="attendanceToken"
                          type="number"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">Learner Score Token</td>
                      <td>
                        <TextInput
                          name="learnerScoreToken"
                          type="number"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">Help Token for Learners</td>
                      <td>
                        <TextInput
                          name="helpTokenAmount"
                          type="number"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center">Instructor Score Token</td>
                      <td>
                        <TextInput
                          name="instructorScoreToken"
                          type="number"
                          containerStyle={`w-100`}
                          disabled={!formEditable}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>

              </Card.Body>
            </Card>

            {eventData.status === "defineScoringGuide" && formEditable && (
              <Button
                size="sm"
                className="w-100 mt-3"
                variant="btn btn-outline-primary"
                type="submit"
              >
                Add Scoring Guide
              </Button>
            )}

          </Form>
        )}
      </Formik>

      <SuccessModal show={isModalVisible} message={modalMessage} onClose={closeModal} />  

    </Container>
  );
};

export default ScoringGuide;
