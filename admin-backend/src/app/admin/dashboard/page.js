"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("spark_token");
    if (!token) {
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <h1 className="text-4xl font-bold">Spark by AheadBox</h1>
      <p className="mt-4 text-gray-400">Welcome to your admin dashboard.</p>
    </div>
  );
}