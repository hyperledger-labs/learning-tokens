import React, { useEffect } from "react";
import { Loader, Table, Toggle } from "rsuite";
import {
  useLazyGetInstitutionQuery,
  useSmartContractCallMutation,
  useUpdateInstitutionStatusMutation,
} from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
const { Column, HeaderCell, Cell } = Table;

const Institution: React.FC = () => {
  const [getInstitution, { data, isLoading }] = useLazyGetInstitutionQuery();
  const [updateInstitutionStatus] = useUpdateInstitutionStatusMutation();
  const [smartContractCall] = useSmartContractCallMutation();
  const pagination = usePagination();

  useEffect(() => {
    getInstitution({
      page: pagination.page,
      limit: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const toggleStatus = async (rowData: any) => {
    smartContractCall({
      isAdmin: true,
      isView: true,
      functionName: "registerInstitution",
      params: [
        rowData.name,
        rowData.publicAddress,
        Date.now(),
        rowData.latitude,
        rowData.longitude,
      ],
    }).then(() => {
      updateInstitutionStatus(rowData);
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
          <Cell dataKey="name" />
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
                    disabled={rowData.status}
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

export default Institution;
