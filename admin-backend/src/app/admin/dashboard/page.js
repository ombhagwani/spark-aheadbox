"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestQr, setLatestQr] = useState(null);
  const [latestUrl, setLatestUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    instaLink: "",
    googleReviewLink: "",
    whatsappLink: "",
    customLink: "",
    themeColor: "#000000",
  });

  useEffect(() => {
    const token = localStorage.getItem("spark_token");
    if (!token) {
      router.push("/");
      return;
    }
    fetchBusinesses();
  }, [router]);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch("/api/business");
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setLatestQr(data.qrCode);
        setLatestUrl(data.url);
        setFormData({
          name: "",
          instaLink: "",
          googleReviewLink: "",
          whatsappLink: "",
          customLink: "",
          themeColor: "#000000",
        });
        fetchBusinesses();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("spark_token");
    router.push("/");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white"><p>Loading Spark...</p></div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <div className="mb-8 flex items-center justify-between border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold">Spark by AheadBox</h1>
        <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 font-bold transition hover:bg-red-700">Logout</button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="col-span-1 rounded-lg bg-gray-800 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Create New Business</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Business Name" value={formData.name} onChange={handleChange} className="w-full rounded border border-gray-700 bg-gray-900 p-3 text-white focus:border-blue-500 focus:outline-none" required />
            <input type="url" name="instaLink" placeholder="Instagram Link" value={formData.instaLink} onChange={handleChange} className="w-full rounded border border-gray-700 bg-gray-900 p-3 text-white focus:border-blue-500 focus:outline-none" />
            <input type="url" name="googleReviewLink" placeholder="Google Review Link" value={formData.googleReviewLink} onChange={handleChange} className="w-full rounded border border-gray-700 bg-gray-900 p-3 text-white focus:border-blue-500 focus:outline-none" />
            <input type="url" name="whatsappLink" placeholder="WhatsApp Link" value={formData.whatsappLink} onChange={handleChange} className="w-full rounded border border-gray-700 bg-gray-900 p-3 text-white focus:border-blue-500 focus:outline-none" />
            <input type="url" name="customLink" placeholder="Custom Link (Optional)" value={formData.customLink} onChange={handleChange} className="w-full rounded border border-gray-700 bg-gray-900 p-3 text-white focus:border-blue-500 focus:outline-none" />
            
            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-400">Theme Color:</label>
              <input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} className="h-10 w-10 cursor-pointer rounded border border-gray-700 bg-gray-900 p-1" />
            </div>

            <button type="submit" className="w-full rounded bg-blue-600 p-3 font-bold text-white transition hover:bg-blue-700">Generate QR & Save</button>
          </form>

          {latestQr && (
            <div className="mt-6 rounded-lg border border-gray-700 p-4 text-center">
              <h3 className="mb-2 text-lg font-bold text-green-400">Success!</h3>
              <p className="mb-2 text-sm text-gray-400">{latestUrl}</p>
              <img src={latestQr} alt="QR Code" className="mx-auto mb-4 h-48 w-48 rounded" />
              <a href={latestQr} download="spark-qr-code.png" className="block w-full rounded bg-green-600 p-2 font-bold text-white transition hover:bg-green-700">Download QR</a>
            </div>
          )}
        </div>

        <div className="col-span-1 lg:col-span-2 rounded-lg bg-gray-800 p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold">Active Subscriptions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-700 text-xs uppercase text-gray-400">
                <tr>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expiry Date</th>
                  <th className="px-4 py-3">Theme</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((biz) => (
                  <tr key={biz._id} className="border-b border-gray-700 bg-gray-800">
                    <td className="px-4 py-3 font-medium text-white">{biz.name}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-bold ${biz.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                        {biz.isActive ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(biz.expiryDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="h-6 w-6 rounded border border-gray-600" style={{ backgroundColor: biz.themeColor }}></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {businesses.length === 0 && <p className="mt-4 text-center text-gray-500">No businesses created yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}