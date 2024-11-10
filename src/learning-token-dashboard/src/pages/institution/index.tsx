import React, { useEffect, useState } from "react";
import { Loader, Table, Toggle } from "rsuite";
import {
  useLazyGetInstitutionQuery,
  useSmartContractCallRegisterActorMutation,
  useUpdateInstitutionStatusMutation,
} from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { LoaderIcon } from "react-hot-toast";
const { Column, HeaderCell, Cell } = Table;
import { RoleEnum } from "../../enums/roles.enum";
import { SmartcontractFunctionsEnum } from "../../enums/smartcontract-functions.enum";

const Institution: React.FC = () => {
  const [statusLoading, setStatusLoading] = useState({
    id: null,
    loading: false,
  });
  const [getInstitution, { data, isLoading }] = useLazyGetInstitutionQuery();
  const [updateInstitutionStatus] = useUpdateInstitutionStatusMutation();
  const [smartContractCallRegisterActor] = useSmartContractCallRegisterActorMutation();
  const pagination = usePagination();

  useEffect(() => {
    getInstitution({
      page: pagination.page,
      limit: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const toggleStatus = async (rowData: any) => {
    setStatusLoading({ id: rowData.id, loading: true });
  
    try {
      // Await the smart contract call
      await smartContractCallRegisterActor({
        role: RoleEnum.ADMIN,
        id: 1, //HD Wallet accountIndex of Admin
        functionName: SmartcontractFunctionsEnum.REGISTER_INSTITUTION,
        params: [
          rowData.name,
          rowData.publicAddress,
          Date.now(),
          rowData.latitude,
          rowData.longitude,
        ],
      });
  
      // Update the institution status
      const updatedInstitution = await updateInstitutionStatus(rowData).unwrap();
      console.log(`Institution updated: ${JSON.stringify(updatedInstitution)}`);
    } catch (error) {
      console.error(`Error updating institution status: ${error}`);
    } finally {
      setStatusLoading({ id: null, loading: false });
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
                  {statusLoading.id === rowData.id && statusLoading.loading ? (
                    <LoaderIcon />
                  ) : (
                    <Toggle
                      checked={rowData.status}
                      onClick={() => toggleStatus(rowData)}
                      disabled={rowData.status}
                    />
                  )}
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
