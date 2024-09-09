import { useNavigate } from "react-router-dom";
import { Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;

const tableData = [
  {
    eventId: "EV113-2015",
    eventName: "Event 1",
    description: "Discussion with mock data",
    eventDate: "12-08-2024",
    organizer: "Hyperledger",
    speakerName: "Dipu",
    status: "incomplete scoring guide",
  },
  {
    eventId: "EV225-2024",
    eventName: "Event 2",
    description: "Augmented Reality",
    eventDate: "26-04-2024",
    organizer: "Hyperledger",
    speakerName: "Piash",
    status: "incomplete create course",
  },
];
const Events = () => {
  const navigate = useNavigate();
  const handleRowclick = (data: any) => {
    navigate(`/events/${data.eventId}`);
  };
  return (
    <Table
      data={tableData}
      autoHeight
      rowClassName={"cursor-pointer"}
      onRowClick={handleRowclick}
    >
      <Column flexGrow={1} align="center" fixed>
        <HeaderCell>Event Id</HeaderCell>
        <Cell dataKey="eventId" />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Event Name</HeaderCell>
        <Cell dataKey="eventName" />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Description</HeaderCell>
        <Cell dataKey="description" />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Event Date</HeaderCell>
        <Cell dataKey="eventDate" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>organizer</HeaderCell>
        <Cell dataKey="organizer" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Speaker Name</HeaderCell>
        <Cell dataKey="speakerName" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Status</HeaderCell>
        <Cell dataKey="status" />
      </Column>
    </Table>
  );
};

export default Events;
