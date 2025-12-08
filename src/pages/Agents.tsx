import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AIAgentsView } from "@/components/ai-agents/AIAgentsView";

const Agents = () => {
  return (
    <DashboardLayout>
      <AIAgentsView />
    </DashboardLayout>
  );
};

export default Agents;
