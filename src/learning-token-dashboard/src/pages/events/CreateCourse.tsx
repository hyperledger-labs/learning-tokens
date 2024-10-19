import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { array, object, string } from "yup";
import TextInput from "../../components/TextInput";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import usePagination from "../../hooks/usePagination";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import axios from "axios";
import { SuccessModal } from "../../components/Modal/SuccessModal";
import { useEventContext } from "../../contexts/EventContext";

const initialValues = {
  courseName: "",
  learnersList: [],
};

const validationSchema = object().shape({
  courseName: string().required("Course Name is required."),
  learnersList: array().min(1).required("At least 1 learner should be added"),
});

const CreateCourse = () => {
  const formikRef = useRef<any>(null);
  const [totalItems, setTotalItems] = useState(0);
  const pagination = usePagination();
  const auth = useSelector((state: RootState) => state.auth);
  const [learnersList, setLearnersList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formEditable, setFormEditable] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const { eventData } = useEventContext();

  useEffect(() => {
    if (eventData.status === "submitPostEventData") {
      setFormEditable(true);
    }
  }, [eventData]);

  useEffect(() => {
    const fetchLearnersList = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/learner-list`, {
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });

        setLearnersList(response?.data?.result?.data || []);
        setTotalItems(response?.data?.result?.pagination?.totalCount || 0);
      } catch (error) {
        console.error("Error fetching learners list:", error);
      }
    };

    fetchLearnersList();
  }, [pagination.page, pagination.limit, auth.accessToken]);

  const handleSubmit = async (values: any) => {
    console.log("Form Submitted with values:", values);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/smartcontract/create-course`, {
        courseName: values.courseName,
        preEventId: eventData.id,
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      console.log(`response: ${response.data}`);

      if (response.status === 201) {
        setModalMessage(response.data.message);
        setModalVisible(true);
        setFormEditable(false);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Container className="my-5">
      <Card>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formikRef}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form>
                <Row className="mb-3">
                  <Col>
                    <h4>Course Name</h4>
                    <TextInput
                      name="courseName"
                      type="text"
                      containerStyle={`w-full`}
                      size="small"
                      disabled={!formEditable}
                    />
                  </Col>
                </Row>

                <h4>Learners List</h4>
                <Row className="mb-3">
                  {learnersList.map((learner: any) => (
                    <Col key={learner.id} className="mb-2">
                      <div className="border p-2 text-center">
                        {learner.name} - {learner.publicAddress}
                      </div>
                    </Col>
                  ))}
                </Row>

                <Button
                  size="sm"
                  className="mt-3"
                  variant="btn btn-outline-primary"
                  type="submit"
                  disabled={!formEditable}
                  onClick={() => handleSubmit(values)}
                >
                  Create Course
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

export default CreateCourse;