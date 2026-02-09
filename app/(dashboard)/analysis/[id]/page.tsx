import AnalysisView from "@/components/AnalysisView";

export default function Page({ params }: { params: { id: string } }) {
  return <AnalysisView id={params.id} />;
}
