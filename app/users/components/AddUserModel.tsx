"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@/types/users";
import Modal from "@/components/Modal";
import { ToastContainer, toast } from "react-toastify";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (user: User) => void;
}

// Yup schema
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  website: yup.string().url("Invalid URL").required("Website is required"),
});

export default function AddUserModal({
  open,
  onClose,
  onAddUser,
}: AddUserModalProps) {
  const initialValue = {
    name: "",
    email: "",
    phone: "",
    website: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    reset(initialValue);
    onClose();
  };

  const onSubmit = async (data: User) => {
    try {
      await onAddUser(data);
      reset();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <h2 className="text-xl font-bold mb-4">Add New User</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input
          placeholder="Name"
          {...register("name")}
          className="border rounded px-3 py-2"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input
          placeholder="Email"
          {...register("email")}
          className="border rounded px-3 py-2"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input
          placeholder="Phone"
          {...register("phone")}
          className="border rounded px-3 py-2"
        />
        {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

        <input
          placeholder="Website"
          {...register("website")}
          className="border rounded px-3 py-2"
        />
        {errors.website && (
          <p className="text-red-500">{errors.website.message}</p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            Add User
          </button>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </Modal>
  );
}
