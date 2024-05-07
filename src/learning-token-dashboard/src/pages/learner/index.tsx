import { Table } from "rsuite";

import {
  useLazyGetLearnerListQuery,
} from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import Pagination from "../../components/Pagination";

Modal.setAppElement("#root");
const { Column, HeaderCell, Cell } = Table;
const Learner = () => {
  const [getLearnerList, { data, isLoading }] = useLazyGetLearnerListQuery();

  const pagination = usePagination();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    getLearnerList({
      page: pagination.page,
      limit: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  if (isLoading) {
    return <>Loading...</>;
  }

  const handleAddInstructor = () => {
    setModalIsOpen(true);
  }

  const handleSendMail = () => {
    console.log(email);
    // Add your logic to send mail here
    setModalIsOpen(false);
  }

  const handleAddEmail = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      setEmails([...emails, email]);
      setEmail('');
    }
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };


  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className="py-3">
      <Table data={data?.result?.data} autoHeight rowClassName={"cursor-pointer"}>
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Email</HeaderCell>
          <Cell dataKey="email" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Public Address</HeaderCell>
          <Cell dataKey="publicAddress" />
        </Column>
      </Table>

      <Pagination
        total={data?.result?.pagination.totalCount || 0}
        activePage={pagination.page || 1}
        limit={pagination.limit || 10}
        onChangePage={pagination.handleChangePage}
        onChangeLimit={pagination.handleChangeLimit}
      />

      <div className="addInstructor" onClick={handleAddInstructor} style={{ color: 'white', marginTop: '100px', borderTop: '1px solid #000', textAlign: 'center', backgroundColor: '#013A44', cursor: 'pointer' }}>Add Learner</div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Invite Learners"
        style={{
          overlay: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          content: {
            width: '300px',
            height: '200px',
            border: '2px solid darkblue',
            position: 'relative',
            overflow: 'auto',
          },
        }}
      >
        <button onClick={() => setModalIsOpen(false)} style={{ position: 'absolute', right: '10px', top: '10px' }}>X</button>
        <div style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '20px' }}>Invite Learners</div>
        <p>Enter their Mails. We will notify them</p>
        <input type="text" placeholder="Use space to add multiple mails" value={email} onChange={e => setEmail(e.target.value)} onKeyUp={handleAddEmail} style={{
          marginTop: '10px',
          width: '100%',
          padding: '5px',
          marginBottom: '10px',
          backgroundColor: 'white',
          color: '#013A44',
        }} />
        {emails.map((email, index) => (
          <div key={index}>
            {email} <button onClick={() => handleRemoveEmail(index)}>X</button>
          </div>
        ))}
        <button onClick={handleSendMail} style={{
          backgroundColor: '#013A44',
          color: 'white',
          padding: '5px',
          marginTop: '10px',
          cursor: 'pointer',
        }}>Send Mail</button>
      </Modal>
    </div>
  );
};

export default Learner;