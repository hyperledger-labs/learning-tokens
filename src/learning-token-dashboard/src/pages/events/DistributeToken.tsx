import { Form, Formik, FormikProps } from "formik";
import { useEffect, useRef, useState } from "react";
import { array, number, object, string } from "yup";
import SelectInput from "../../components/SelectInput";
import { Container, Card, Button, FormGroup } from "react-bootstrap";
import { useEventContext } from "../../contexts/EventContext";
import { SuccessModal } from "../../components/Modal/SuccessModal";
import { SmartcontractFunctionsEnum } from "../../enums/smartcontract-functions.enum";
import axios from "axios";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

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
  const auth = useSelector((state: RootState) => state.auth);
  const [learnersList, setLearnersList] = useState([]);
  const [filteredLearnersList, setFilteredLearnersList] = useState([]);
  const [selectedLearners, setSelectedLearners] = useState<Record<number, boolean>>({});
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    const fetchLearnersList = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/learner-list`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });

        const allLearners = response?.data?.result?.data || [];
        setLearnersList(allLearners);

        // Fetch event details
        const eventResponse = await axios.get(`${import.meta.env.VITE_API_URL}/postevent/${eventData?.id}`);
        const eventLearnersEmails = eventResponse.data.map((learner: any) => learner.email);

        // Filter learnersList by the emails fetched from the event
        const filteredLearners = allLearners.filter((learner: any) =>
          eventLearnersEmails.includes(learner.email)
        );

        setFilteredLearnersList(filteredLearners);
      } catch (error) {
        console.error("Error fetching learners list:", error);
      }
    };

    fetchLearnersList();
  }, []);

  useEffect(() => {
    // Update selectedLearners based on allSelected
    const updatedSelected = {};
    filteredLearnersList.forEach(learner => {
      updatedSelected[learner.id] = allSelected;
    });
    setSelectedLearners(updatedSelected);
  }, [allSelected, filteredLearnersList]);

  const handleCheckboxChange = (learnerId: number) => {
    console.log("Checkbox changed for learner:", learnerId);

    setSelectedLearners((prev) => ({
      ...prev,
      [learnerId]: !prev[learnerId],
    }));
  }

  const handleSelectAllChange = () => {
    setAllSelected(!allSelected);
  }

  const handleSubmit = async (values: any) => {
    console.log("Form Submitted with values:", values);

    const hasSelectedLearners = Object.values(selectedLearners).some((selected) => selected);
    let submitSelectedLearnerList = null
    if (hasSelectedLearners) {
      submitSelectedLearnerList = Object.keys(selectedLearners)
        .filter((learner) => selectedLearners[learner])
        .map((learner) => (Number(learner)));
    } else { // If no learners are selected, submit all learners
      submitSelectedLearnerList = filteredLearnersList.map((learner) => learner.id);
    }

    values.learnersList = submitSelectedLearnerList;

    let functionName = "";
    switch (values.token_type) {
      case "attendance_token":
        functionName = SmartcontractFunctionsEnum.BATCH_MINT_ATTENDANCE_TOKEN;
        break;
      case "score_token":
        functionName = SmartcontractFunctionsEnum.BATCH_MINT_SCORE_TOKEN;
        break;
      case "instructorScore_token":
        functionName = SmartcontractFunctionsEnum.BATCH_MINT_INSTRUCTOR_SCORE_TOKEN;
        break;
      default:
        break;
    }

    console.log(`selectedLearnerList: ${values.learnersList}`);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/smartcontract/token-distributions`, {
        functionName: functionName,
        preEventId: eventData.id,
        userIds: values.learnersList,
      }, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

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
    { value: "score_token", label: "Score Token" },
    // { value: "batch_score_token", label: "Batch Score Token" },
    { value: "instructorScore_token", label: "Instructor Score Token" },
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
            {({ values }) => (
              <Form>
                <FormGroup>
                  <h5>Token</h5>
                  <SelectInput
                    containerStyle={"w-100"}
                    size="small"
                    name="token_type"
                    options={tokenType}
                  />
                </FormGroup>

                <FormGroup>
                  <h5>Learners</h5>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      className="ml-2 mr-2"
                      type="checkbox"
                      id="select-all"
                      checked={allSelected}
                      onChange={handleSelectAllChange}
                    />
                    <label htmlFor="select-all">Select All</label>
                    <hr/>
                  </div>
                  {filteredLearnersList.map((learner) => (
                    <div key={learner.id} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        className="ml-2 mr-2"
                        type="checkbox"
                        id={`learner-${learner.id}`}
                        checked={!!selectedLearners[learner.id]}
                        onChange={() => handleCheckboxChange(learner.id)}
                      />
                      <label htmlFor={`learner-${learner.id}`}>
                        {learner.name} - {learner.publicAddress}
                      </label>
                    </div>
                  ))}
                </FormGroup>

                <Button
                  size="sm"
                  className="w-100 mt-3"
                  variant="btn btn-outline-primary"
                  type="submit"
                  onClick={() => handleSubmit(values)}
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