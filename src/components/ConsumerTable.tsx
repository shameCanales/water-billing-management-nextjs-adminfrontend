"use client";

import { useGetAllConsumers } from "@/hooks/useGetAllConsumers";
import { ReactNode } from "react";

export default function ConsumerTable() {
  const {
    data: consumerList,
    isLoading: loadingConsumers,
    isError: ErrorLoadingConsumer,
    error: consumerListError,
  } = useGetAllConsumers();

  let content: ReactNode = null;

  if (loadingConsumers) {
    content = <p>Loading...</p>;
  }

  if (consumerList) {
    content = (
      <div>
        <ul>
          {consumerList.map((consumer) => (
            <li key={consumer._id}>
              <p>
                {consumer.firstName} {consumer.middleName} {consumer.lastName}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (ErrorLoadingConsumer) {
    return (
      <div className="p-4 text-red-500">Error: {consumerListError.message}</div>
    );
  }
  return (
    <div>
      <h1>Consumer Table</h1>
      {content}
    </div>
  );
}
