import TemplateProvider from './TemplateProvider';

export default async function Edit({
  params,
}: {
  params: { assetId: number };
}) {
  const { assetId } = params;

  return (
    <div className="h-[calc(100vh-96px)]">
      <TemplateProvider assetId={assetId} />
    </div>
  );
}
