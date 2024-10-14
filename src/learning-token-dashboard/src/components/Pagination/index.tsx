import { forwardRef } from "react";
import { Pagination as RsuitePagination } from "rsuite";
import { PaginationGroupProps } from "rsuite/esm/Pagination/PaginationGroup";

interface Props extends PaginationGroupProps {}

const Pagination = forwardRef(({ ...props }: Props) => {
  if (props.total <= 1) return <></>;

  return (
    <div style={{ padding: 20 }}>
      <RsuitePagination
        prev
        next
        first
        last
        ellipsis={false}
        boundaryLinks={false}
        {...props}
        maxButtons={5}
        size="xs"
        layout={["total", "-", "limit", "|", "pager", "skip"]}
        limitOptions={[10, 30, 50]}
      />
    </div>
  );
});

export default Pagination;
