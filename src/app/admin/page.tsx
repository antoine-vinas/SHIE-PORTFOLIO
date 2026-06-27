import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllProjects, getHomeContent } from "@/lib/data";

export const revalidate = 0;

export default async function AdminPage() {
  const [projects, homeContent] = await Promise.all([
    getAllProjects(),
    getHomeContent(),
  ]);

  return (
    <AdminDashboard
      initialProjects={projects}
      homeContent={homeContent}
    />
  );
}
