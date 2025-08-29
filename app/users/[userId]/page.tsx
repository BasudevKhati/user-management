"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios"; // axios instance with baseURL
import { Card, Icon, Loader, Message } from "semantic-ui-react";
import Image from "next/image";
import React from "react";

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: Address;
  company: Company;
}

interface UserDetailPageProps {
  params: Promise<{ userId: string }>;
}

export default function UserDetailPage(props: UserDetailPageProps) {
  const { userId } = React.use(props.params);
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await api.get<User>(`/users/${userId}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader active inline="centered" />;
  if (isError)
    return (
      <Message error>
        {(error as Error).message || "Something went wrong"}
      </Message>
    );

  return (
    <div className="p-6">
      <button onClick={() => router.push("/")} className="mb-4">
        <Icon name="chevron left" size="large" />
      </button>

      {data && (
        <Card fluid>
          <Card.Content>
            <Image
              src="https://www.bootdey.com/img/Content/avatar/avatar7.png"
              alt="Avatar"
              width={80}
              height={80}
              className="rounded-full mb-4"
            />
            <Card.Header>{data.name}</Card.Header>
            <Card.Meta>{data.email}</Card.Meta>
            <Card.Description>
              <p>📞 Phone: {data.phone}</p>
              <p>🌐 Website: {data.website}</p>
              <p>
                🏠 Address: {data.address.street}, {data.address.suite},{" "}
                {data.address.city}, {data.address.zipcode}
              </p>
              <p>
                🏢 Company: {data.company.name} — {data.company.catchPhrase} (
                {data.company.bs})
              </p>
            </Card.Description>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
