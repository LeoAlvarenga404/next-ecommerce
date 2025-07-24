"use client";

import { useParams } from "next/navigation";

export default function CategoryPage() {
  const { id } = useParams();

  return <div>{id}</div>;
}




