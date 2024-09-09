import React, { useEffect, useState } from "react";
import { Loader, Toggle } from "rsuite";
import {
  useLazyGetInstitutionQuery,
  useSmartContractCallRegisterActorMutation,
  useUpdateInstitutionStatusMutation,
} from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { LoaderIcon } from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const Institution: React.FC = () => {
  const [statusLoading, setStatusLoading] = useState({
    id: null,
    loading: false,
  });
  const [getInstitution, { data, isLoading }] = useLazyGetInstitutionQuery();
  const [updateInstitutionStatus] = useUpdateInstitutionStatusMutation();
  const [smartContractCallRegisterActor] =
    useSmartContractCallRegisterActorMutation();
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
        isAdmin: true,
        role: RoleEnum.ADMIN,
        id: 0, //HD Wallet accountIndex of Admin - default to 0
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
      const updatedInstitution = await updateInstitutionStatus(
        rowData
      ).unwrap();
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Public Address</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.result?.data && data.result.data.length > 0 ? (
            data.result.data.map((rowData: any) => (
              <TableRow key={rowData.id} className="cursor-pointer">
                <TableCell className="text-center">{rowData.id}</TableCell>
                <TableCell>{rowData.name}</TableCell>
                <TableCell>{rowData.publicAddress}</TableCell>
                <TableCell>
                  {statusLoading.id === rowData.id && statusLoading.loading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rowData.status}
                        onClick={() => toggleStatus(rowData)}
                        disabled={rowData.status}
                      />
                      {rowData.status ? "Active" : "Inactive"}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No institutions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
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
