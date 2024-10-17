import { Form, Formik, FormikProps } from "formik";
import { useRef } from "react";
import { object, string } from "yup";
import TextInput from "../../components/TextInput";
import { useParams } from "react-router-dom";
import { useEventContext } from "../../contexts/EventContext";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";

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
  const { eventData } = useEventContext();

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  console.log(`eventData: `, eventData);


  return (
    <Container className="mt-4">
      <Formik
        initialValues={initialValues}
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
                        />
                      </Col>
                      <Col>
                        <TextInput
                          name="organizer"
                          type="text"
                          label="Organizer"
                          containerStyle={`w-100`}
                          value={eventData.organizerName}
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
                        />
                      </Col>
                      <Col>
                        <TextInput
                          name="taxonomyOfSkills"
                          type="text"
                          label="Taxonomy of Skills"
                          containerStyle={`w-100`}
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
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>

              </Card.Body>
            </Card>

            <Button
              size="small"
              className="w-100 mt-3"
              variant="btn btn-outline-primary"
              type="submit"
            >
              Add Scoring Guide
            </Button>

          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ScoringGuide;
