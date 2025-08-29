"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import DataTable, { Column } from "@/components/Table";
import { Loader, Message } from "semantic-ui-react";
import { useState, useEffect } from "react";
import { User } from "@/types/users";
import CardList from "@/components/CardList";
import SearchInput from "@/components/SearchInput";
import AddUserModal from "./users/components/AddUserModel";
import { ToastContainer, toast } from "react-toastify";

async function fetchUsers(): Promise<User[]> {
  const res = await api.get<User[]>("/users");
  return res.data;
}

export default function HomePage() {
  const { data, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const filteredData = users?.filter((user) => {
    const match =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  const [view, setView] = useState<"table" | "card">(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("layout");
      return stored === "card" || stored === "table" ? stored : "table";
    }
    return "table";
  });

  const handleAddUser = async (user: User) => {
    const newUser = { ...user, id: Date.now() };
    setUsers((prev) => [...prev, newUser]);
    toast.success("User added successfully!");
  };

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  useEffect(() => {
    const stored = localStorage.getItem("layout");
    if (stored === "card" || stored === "table") {
      setView(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("layout", view);
  }, [view]);

  const columns: Column<User>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "website", header: "Website" },
  ];

  //Loader and error message while fetching API
  if (isLoading) return <Loader active inline="centered" />;
  if (isError) return <Message error>{(error as Error).message}</Message>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>

      {/* Toggle Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded ${
            view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("table")}
        >
          Table View
        </button>
        <button
          className={`px-3 py-1 rounded ${
            view === "card" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setView("card")}
        >
          Card View
        </button>
      </div>

      <div className="flex justify-between items-center w-full">
        <div className="mb-4 w-[200px]">
          <SearchInput onSearch={(value) => setSearchTerm(value)} />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition duration-200"
        >
          + Add User
        </button>
      </div>
      {data &&
        (view === "table" ? (
          <DataTable data={filteredData ?? []} columns={columns} />
        ) : (
          <CardList data={filteredData ?? []} itemsPerPage={3} />
        ))}

      <AddUserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUser={handleAddUser}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
