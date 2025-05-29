import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Trash2, Users, Image as ImageIcon, AlertTriangle } from 'lucide-react';

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                */
/* ────────────────────────────────────────────────────────────────────── */
interface DisposalEntry { category: string; amount: number }
interface WeeklyEntry   { date: string;   count: number  }

interface Stats {
  totalUsers: number;
  totalClassifications: number;
  disposalLevels: DisposalEntry[];
  weeklyClassifications: WeeklyEntry[];
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Component                                                            */
/* ────────────────────────────────────────────────────────────────────── */
const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClassifications: 0,
    disposalLevels: [],
    weeklyClassifications: []
  });
  const [loading, setLoading] = useState(true);

  /* ─── Fetch metrics once on mount ─────────────────────────────────── */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        /* 1️⃣  TOTAL USERS — from view "users" (see note below) */
        const { count: totalUsers } = await supabase
          .from('users')                       // <- view alias of auth.users
          .select('*', { count: 'exact', head: true });

        /* 2️⃣  TOTAL CLASSIFICATIONS */
        const { count: totalClassifications } = await supabase
          .from('classification_history')
          .select('*', { count: 'exact', head: true });

        /* 3️⃣  DISPOSAL LEVELS (count rows per top_category) */
        const { data: dispData, error: dispErr } = await supabase
          .from('classification_history')
          .select('top_category, count:top_category')
          // .group('top_category');

        if (dispErr) throw dispErr;

        const disposalLevels: DisposalEntry[] =
          (dispData ?? []).map((row: any) => ({
            category: row.top_category,
            amount: row.count as number
          }));

        /* 4️⃣  WEEKLY CLASSIFICATIONS (past 7 days) */
        const { data: weekRaw, error: weekErr } = await supabase
          .from('classification_history')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (weekErr) throw weekErr;

        // init Mon-Sun map
        const weekMap: Record<string, number> = { Sun:0, Mon:0, Tue:0, Wed:0, Thu:0, Fri:0, Sat:0 };
        (weekRaw ?? []).forEach((r: any) => {
          const day = new Date(r.created_at).toLocaleDateString('en-US', { weekday: 'short' });
          weekMap[day] += 1;
        });

        const weeklyClassifications: WeeklyEntry[] = Object
          .entries(weekMap)
          .map(([date, count]) => ({ date, count }));

        /* ⬇ update state */
        setStats({
          totalUsers: totalUsers ?? 0,
          totalClassifications: totalClassifications ?? 0,
          disposalLevels,
          weeklyClassifications
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  /* ─── Loading placeholder ─────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  /* ─── Render ──────────────────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users"            value={stats.totalUsers}                icon={<Users />}        color="bg-blue-500"   />
        <StatCard title="Total Classifications"  value={stats.totalClassifications}      icon={<ImageIcon />}    color="bg-green-500"  />
        <StatCard title="This Week"              value={stats.weeklyClassifications.reduce((a, c) => a + c.count, 0)}
                                                icon={<AlertTriangle />}                 color="bg-yellow-500" />
        <StatCard title="Disposal Rate"
                  value={`${((stats.totalClassifications / 2000) * 100).toFixed(1)}%`}
                  icon={<Trash2 />} color="bg-purple-500" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly line chart */}
        <ChartCard title="Weekly Classifications">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.weeklyClassifications}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Disposal bar chart */}
        <ChartCard title="Disposal Levels by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.disposalLevels}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

/* ───────────── helpers ───────────── */
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>
    <div className="h-80">{children}</div>
  </div>
);

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; color: string }> = ({
  title, value, icon, color
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center gap-4">
      <div className={`${color} text-white p-3 rounded-lg flex items-center`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
