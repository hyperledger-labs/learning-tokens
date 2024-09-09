import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { useLazyGetLearnerListQuery } from "../../store/features/admin/adminApi";
import usePagination from "../../hooks/usePagination";
import { useEffect } from "react";
import Pagination from "../../components/Pagination";

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

  const learners = data?.result?.data || [];

  return (
    <div className="py-3">
      {learners.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Public Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {learners.map((learner) => (
              <TableRow key={learner.id} className="cursor-pointer">
                <TableCell className="text-center">{learner.id}</TableCell>
                <TableCell>{learner.name}</TableCell>
                <TableCell>{learner.email}</TableCell>
                <TableCell>{learner.publicAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4 py-4 text-gray-500">
          No learners found.
        </div>
      )}

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
