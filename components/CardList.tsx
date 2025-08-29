"use client";

import { Card } from "semantic-ui-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface CardListProps<T> {
  data: T[];
  itemsPerPage?: number;
}

type CardItem = {
  id?: number | string;
  name: string;
  email: string;
  phone: string;
  website: string;
};

export default function CardList<T extends CardItem>({
  data,
  itemsPerPage = 3,
}: CardListProps<T>) {
  const [cursor, setCursor] = useState(0);

  const currentData = data.slice(cursor, cursor + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentPage = Math.floor(cursor / itemsPerPage) + 1;

  const handleNext = () => {
    setCursor((prev) =>
      Math.min(prev + itemsPerPage, data.length - itemsPerPage)
    );
  };

  const handlePrev = () => {
    setCursor((prev) => Math.max(prev - itemsPerPage, 0));
  };

  return (
    <div>
      <Card.Group itemsPerRow={3} stackable centered>
        {currentData.map((item) => (
          <Card key={item.id}>
            <Card.Content className="flex flex-col items-center">
              <Image
                src="https://www.bootdey.com/img/Content/avatar/avatar7.png"
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full mb-4"
              />
              <Card.Header>
                <Link href={`/users/${item.id}`} className="hover:underline">
                  {item.name}
                </Link>
              </Card.Header>
              <Card.Meta>{item.email}</Card.Meta>
              <Card.Description>
                <p>📞 {item.phone}</p>
                <p>🌐 {item.website}</p>
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>

      {/* Pagination */}
      {data.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={cursor === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Number */}
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={cursor + itemsPerPage >= data.length}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
