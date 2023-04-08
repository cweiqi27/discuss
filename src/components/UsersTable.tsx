import {
  IconArrowBigLeftLinesFilled,
  IconArrowBigRightLinesFilled,
  IconCaretDown,
  IconLink,
} from "@tabler/icons-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { trpc } from "utils/trpc";
import Avatar from "./avatar/Avatar";
import Spinner from "./Spinner";

const UsersTable = () => {
  const [page, setPage] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<
    "nameAsc" | "nameDesc" | "status" | "role" | undefined
  >(undefined);

  const {
    data: users,
    isLoading: userLoading,
    isError: userError,
  } = trpc.user.getAllOffset.useQuery({
    currentPage: page,
    take: 5,
    orderBy: orderBy,
  });
  const {
    data: count,
    isLoading: countLoading,
    isError: countError,
  } = trpc.user.getCountAllUsers.useQuery();

  const pagesData = useMemo(() => {
    const pageStart = page * 5 + 1;
    const lastPage = count ? Math.ceil(count / 5) : 1;
    const pageEnd = count && Math.min(page * 5 + 5, count);
    return { pageStart, pageEnd, lastPage };
  }, [count, page]);

  const handleClickOrderBy = (type: "name" | "status" | "role") => {
    if (type === "name")
      orderBy === "nameAsc"
        ? setOrderBy("nameDesc")
        : orderBy === "nameDesc"
        ? setOrderBy(undefined)
        : setOrderBy("nameAsc");

    if (type === "status")
      orderBy === "status" ? setOrderBy(undefined) : setOrderBy("status");

    if (type === "role")
      orderBy === "role" ? setOrderBy(undefined) : setOrderBy("role");
  };

  return (
    <div className="relative w-screen overflow-x-auto shadow-md sm:rounded-lg md:w-full">
      <table className="w-full text-left text-sm text-zinc-400">
        <thead className="bg-zinc-700 text-xs uppercase text-zinc-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Avatar
            </th>
            <th scope="col" className="px-6 py-3">
              <button
                className={`inline-flex items-center gap-2 uppercase ${
                  orderBy === "nameAsc" || orderBy === "nameDesc"
                    ? "font-semibold text-zinc-200"
                    : ""
                }`}
                onClick={() => handleClickOrderBy("name")}
              >
                Name
                <IconCaretDown
                  className={`transition duration-75 ${
                    orderBy === "nameAsc" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </th>
            <th scope="col" className="px-6 py-3">
              <button
                className={`inline-flex items-center gap-2 uppercase ${
                  orderBy === "status" ? "font-semibold text-zinc-200" : ""
                }`}
                onClick={() => handleClickOrderBy("status")}
              >
                Status
                <IconCaretDown
                  className={`transition duration-75 ${
                    orderBy === "status" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </th>
            <th scope="col" className="px-6 py-3">
              <button
                className={`inline-flex items-center gap-2 uppercase ${
                  orderBy === "role" ? "font-semibold text-zinc-200" : ""
                }`}
                onClick={() => handleClickOrderBy("role")}
              >
                Role
                <IconCaretDown
                  className={`transition duration-75 ${
                    orderBy === "role" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Link
            </th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => {
              return (
                <tr
                  className="border-b border-zinc-700 bg-zinc-900"
                  key={user.id}
                >
                  <td className="px-6 py-4">
                    <Avatar
                      src={user.image ?? ""}
                      name={user.name ?? ""}
                      size="sm"
                    />
                  </td>
                  <th
                    scope="row"
                    className={`whitespace-nowrap px-6 py-4 ${
                      orderBy === "nameAsc" || orderBy === "nameDesc"
                        ? "font-medium text-zinc-200"
                        : ""
                    }`}
                  >
                    {user.name}
                  </th>
                  <td
                    className={`px-6 py-4 ${
                      orderBy === "status" ? "font-medium text-zinc-200" : ""
                    }`}
                  >
                    {user.status}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      orderBy === "role" ? "font-medium text-zinc-200" : ""
                    }`}
                  >
                    {user.role}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/users/${user.id}`}
                      className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                    >
                      <IconLink />
                      Link
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {userLoading && (
        <div className="grid h-[24rem] w-full place-items-center">
          <Spinner />
        </div>
      )}

      {/* Bottom Pagination Row */}
      <nav
        className="flex items-center justify-between pt-4"
        aria-label="Table navigation"
      >
        <span className="text-sm font-normal text-zinc-400">
          Showing{" "}
          <span className="font-semibold text-white">
            {pagesData.pageStart} {"-"} {pagesData.pageEnd}
          </span>{" "}
          of <span className="font-semibold text-white">{count}</span>
        </span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="ml-0 block rounded-l-lg border border-zinc-700 bg-zinc-800 px-3 py-2 leading-tight text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-800"
            >
              <span className="sr-only">Previous</span>
              <IconArrowBigLeftLinesFilled />
            </button>
          </li>
          <li>
            <button
              onClick={() => setPage(0)}
              disabled={page === 0}
              className={`border  border-zinc-700  px-3 py-2 leading-tight 
              ${
                page === 0
                  ? "bg-zinc-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              }
              `}
            >
              1
            </button>
          </li>
          {pagesData.lastPage > 1 && (
            <li>
              <button
                onClick={() => setPage(pagesData.lastPage - 1)}
                disabled={page === pagesData.lastPage - 1}
                className={`border  border-zinc-700  px-3 py-2 leading-tight 
                ${
                  page === pagesData.lastPage - 1
                    ? "bg-zinc-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                }
                `}
              >
                {pagesData.lastPage}
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagesData.lastPage - 1}
              className="block rounded-l-lg border border-zinc-700 bg-zinc-800 px-3 py-2 leading-tight text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:bg-zinc-900 disabled:text-zinc-800"
            >
              <span className="sr-only">Next</span>
              <IconArrowBigRightLinesFilled />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UsersTable;
