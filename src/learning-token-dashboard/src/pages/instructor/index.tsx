import { Loader, Table, Toggle } from "rsuite";
import {
  useLazyGetInstructorQuery,
  useSmartContractCallMutation,
  useUpdateInstructorStatusMutation,
} from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import { useEffect } from "react";
import Pagination from "../../components/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const { Column, HeaderCell, Cell } = Table;
const Instructor = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [getInstructor, { data, isLoading }] = useLazyGetInstructorQuery();
  const [updateInstructorStatus] = useUpdateInstructorStatusMutation();
  const [smartContractCall] = useSmartContractCallMutation();
  const pagination = usePagination();

  useEffect(() => {
    getInstructor({
      page: pagination.page,
      limit: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const toggleStatus = async (rowData: any) => {
    console.log(rowData);
    smartContractCall({
      isAdmin: false,
      isView: false,
      isWrite: true,
      type: auth.user.type,
      id: auth.user.id,
      functionName: "addInstructorToInstitution",
      params: [rowData.publicAddress, Date.now()],
    }).then(() => {
      updateInstructorStatus(rowData);
    });
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
