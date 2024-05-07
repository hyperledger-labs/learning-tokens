import { Loader, Table, Toggle } from "rsuite";
import {
  useLazyGetInstructorQuery,
  useUpdateInstructorStatusMutation,
} from "../../store/features/admin/adminApi";
import { initWeb3 } from "../../utils";
import usePagination from "../../hooks/usePagination";
import { useEffect } from "react";
import Pagination from "../../components/Pagination";
const { Column, HeaderCell, Cell } = Table;
const Instructor = () => {
  const [getInstructor, { data, isLoading }] = useLazyGetInstructorQuery();
  const [updateInstructorStatus] = useUpdateInstructorStatusMutation();

  const pagination = usePagination();

  useEffect(() => {
    getInstructor({
      page: pagination.page,
      limit: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const toggleStatus = async (rowData: any) => {
    const contract = await initWeb3();
    const tx = await contract!.addInstructorToInstitution(
      rowData.publicAddress,
      Date.now()
    );
    if (tx) {
      await updateInstructorStatus(rowData);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="py-3">
      <Table
        data={data?.result?.data}
        autoHeight
        rowClassName={"cursor-pointer"}
      >
        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Id</HeaderCell>
          <Cell dataKey="id" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" className="capitalize" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Public Address</HeaderCell>
          <Cell dataKey="publicAddress" />
        </Column>

        <Column flexGrow={1}>
          <HeaderCell>Status</HeaderCell>
          <Cell>
            {(rowData: any) => {
              return (
                <>
                  <Toggle
                    checked={rowData.status}
                    onClick={() => toggleStatus(rowData)}
                  />
                </>
              );
            }}
          </Cell>
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

export default Instructor;
