import { Bug } from "@/types/bug";
export interface RecentBugsSectionProps {
  bugs: Bug[];
  onBugClick: (bug: Bug) => void;
}
