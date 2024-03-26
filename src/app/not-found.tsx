import Layout from './(default)/layout';

export default function NotFound() {
  return (
    <Layout>
      <div className="flex w-full h-[calc(100lvh-10rem)] justify-center items-center">
        <div className="card w-72  bg-base-100 shadow-xl p-4 justify-center items-center">
          <div className="flex flex-row justify-center items-center gap-5 text-lg">
            <div className="font-bold p-2 bg-indigo-800 text-white rounded-lg inline">
              <span>404</span>
            </div>
            <h2 className="font-bold ">Page Not Found</h2>
          </div>
        </div>
      </div>
    </Layout>
  );
}
