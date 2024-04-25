import ResourceProvider from "./_component/ResourceProvider";

export default async function Edit({ params }: { params: { assetId: number; shortformId: string } }) {
  const { assetId, shortformId } = params;

  return (
    <div className="h-[calc(100vh-96px)]">
      <ResourceProvider assetId={assetId} shortformId={shortformId} />
    </div>
  );
}
