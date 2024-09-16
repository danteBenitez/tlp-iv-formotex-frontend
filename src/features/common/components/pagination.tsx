import {
  Pagination as LibPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router-dom";

const PER_PAGE = 10;

export function Pagination(props: { total: number }) {
  const [params, setParams] = useSearchParams();

  const page = parseInt(params.get("page") ?? "1");

  const incrementPage = () => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", (page + 1).toString());
    setParams(newParams);
  };

  const decrementPage = () => {
    const newParams = new URLSearchParams(params);
    newParams.set("page", (page - 1).toString());
    setParams(newParams);
  };
  console.log({ total: props.total });
  console.log({ page, calc: (page + 1) * PER_PAGE });

  return (
    <LibPagination>
      <PaginationContent>
        {page - 1 >= 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => decrementPage()} />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink className="bg-primary text-primary-foreground">
            {page}
          </PaginationLink>
        </PaginationItem>
        {props.total - page * PER_PAGE > 0 && (
          <PaginationItem>
            <PaginationNext onClick={() => incrementPage()} />
          </PaginationItem>
        )}
      </PaginationContent>
    </LibPagination>
  );
}
