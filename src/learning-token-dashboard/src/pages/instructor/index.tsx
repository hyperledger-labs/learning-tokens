import { Loader, Toggle } from "rsuite";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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
      {data?.result?.data.length > 0 ? (
        <>
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
              {data?.result?.data.map((rowData: any) => (
                <TableRow key={rowData.id} className="cursor-pointer">
                  <TableCell className="text-center">{rowData.id}</TableCell>
                  <TableCell className="capitalize">{rowData.name}</TableCell>
                  <TableCell>{rowData.publicAddress}</TableCell>
                  <TableCell>
                    <Toggle
                      checked={rowData.status}
                      onClick={() => toggleStatus(rowData)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            total={data?.result?.pagination.totalCount || 0}
            activePage={pagination.page || 1}
            limit={pagination.limit || 10}
            onChangePage={pagination.handleChangePage}
            onChangeLimit={pagination.handleChangeLimit}
          />
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No instructors found.
        </div>
      )}
    </div>
  );
};

export default Instructor;
