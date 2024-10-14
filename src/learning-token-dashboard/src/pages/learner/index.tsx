import { Table } from "rsuite";

import {
  useLazyGetLearnerListQuery,
} from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import { useEffect } from "react";
import Pagination from "../../components/Pagination";
const { Column, HeaderCell, Cell } = Table;
const Learner = () => {
  const [getLearnerList, { data, isLoading }] = useLazyGetLearnerListQuery();

  const pagination = usePagination();

  useEffect(() => {
    getLearnerList({
      page: pagination.page,
      limit: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

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
    </div>
  );
};

export default Learner;
