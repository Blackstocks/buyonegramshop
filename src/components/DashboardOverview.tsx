import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { BarChart3, Package, Users, ShoppingCart } from "lucide-react";

export default function DashboardOverview() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: ordersData } = await supabase.from("orders").select("*");
        const totalRevenue = ordersData.reduce(
          (sum, order) => sum + order.price * order.quantity,
          0
        );
        const { data: usersData } = await supabase.from("profiles").select("*");
        const { data: productsData } = await supabase.from("products").select("*");

        setStats([
          { label: "Total Revenue", value: `₹${totalRevenue}`, icon: BarChart3 },
          { label: "Total Users", value: usersData.length || 0, icon: Users },
          { label: "Products", value: productsData.length || 0, icon: Package },
          { label: "Orders", value: ordersData.length || 0, icon: ShoppingCart },
        ]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Overview</h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white rounded-lg shadow">
            <div className="text-gray-500">{stat.label}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
