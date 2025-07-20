"use client";

import { useParams } from "next/navigation";

export default function PageWithId() {
  const { id } = useParams();
  return <div>{id}</div>;
}
