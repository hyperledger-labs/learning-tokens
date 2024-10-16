import { useNavigate } from "react-router-dom";
import { Table } from "rsuite";
const { Column, HeaderCell, Cell } = Table;
import axios from "axios";
import { useEffect, useState } from "react";

const Events = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const handleRowclick = (data: any) => {
    navigate(`/events/${data.eventId}`);
  };

  useEffect(() => {
    const fetchPreeventData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/preevent`);
        console.log(`response::: ${response}`);
        
        setTableData(response?.data?.result || []);
      } catch (error) {
        console.error("Error fetching preevent data:", error);
      }
    };

    fetchPreeventData();
  }, []);

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
        <HeaderCell>Organizer</HeaderCell>
        <Cell dataKey="organizer" />
      </Column>
      <Column flexGrow={1}>
        <HeaderCell>Speaker's Name</HeaderCell>
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
