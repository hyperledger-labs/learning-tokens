import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import usePagination from "../../hooks/usePagination";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { formatDateTime } from "../../utils";
import { Table, Container, Pagination as BootstrapPagination } from "react-bootstrap";
import { useEventContext } from "../../contexts/EventContext";

const Events = () => {
  const navigate = useNavigate();
  const { setEventData } = useEventContext();
  const [tableData, setTableData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const pagination = usePagination();
  const auth = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    const fetchPreeventData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/preevent`, {
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });

        setTableData(response?.data?.result || []);
        setTotalItems(response?.data?.meta?.totalItems || 0);
      } catch (error) {
        console.error("Error fetching preevent data:", error);
      }
    };

    fetchPreeventData();
  }, [pagination.page, pagination.limit]);

  // Custom cell component to format the event date
  const DateCell = ({ eventDate }: { eventDate: string }) => {
    return <span>{formatDateTime(eventDate)}</span>;
  };

  const SpeakersNameCell = ({ speakersName }: { speakersName: string[] }) => {
    return <span>{speakersName.join(", ")}</span>;
  }

  const totalPages = Math.ceil(totalItems / pagination.limit); //For Bootstrap Pagination

  const handleRowclick = (data: any) => {
    setEventData(data); // set the context value

    // Step based on Event Status to navigate to the correct page
    let step = 1;
    switch (data.status) {
      case "defineScoringGuide":
        step = 1;
        break;
      case "reviewWallets":
        step = 2;
        break;
      case "tokenDistribution":
        step = 3;
        break;
      default:
        break
    }
    
    navigate(`/events/${data.meetingEventId}?step=${step}`);
  };

  return (
    <Container>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="text-center" style={{ width: "5%" }}>Event Id</th>
              <th className="text-center" style={{ width: "10%" }}>Event Name</th>
              <th className="text-center" style={{ width: "25%" }}>Description</th>
              <th className="text-center" style={{ width: "12%" }}>Event Date</th>
              <th className="text-center" style={{ width: "10%" }}>Organizer</th>
              <th className="text-center" style={{ width: "20%" }}>Speaker's Name</th>
              <th className="text-center" style={{ width: "10%" }}>Next Step</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((event) => (
              <tr key={event.id} onClick={() => handleRowclick(event)} className="cursor-pointer">
                <td className="text-center">{event.meetingEventId}</td>
                <td className="text-center">{event.eventName}</td>
                <td className="text-center">{event.description}</td>
                <td className="text-center"><DateCell eventDate={event.eventDate} /></td>
                <td className="text-center">{event.organizerName}</td>
                <td className="text-center"><SpeakersNameCell speakersName={event.speakersName} /></td>
                <td className="text-center">{event.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <BootstrapPagination>
          <BootstrapPagination.Prev
            onClick={pagination.handlePrev}
            disabled={pagination.page <= 1 || totalItems === 0}
          />
          <BootstrapPagination.Item active>{pagination.page}</BootstrapPagination.Item>
          <BootstrapPagination.Next
            onClick={pagination.handleNext}
            disabled={pagination.page >= totalPages || totalItems === 0}
          />
        </BootstrapPagination>
      </div>
    </Container>
  );
};

export default Events;