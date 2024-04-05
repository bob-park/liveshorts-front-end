import ResourceProvider from "./ResourceProvider";

export default async function Edit({ params }: { params: { assetId: number } }) {
  const { assetId } = params;

  return (
    <div className="h-[calc(100vh-96px)]">
      <ResourceProvider assetId={assetId} />
    </div>
  );
}
