import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/browse');

  return <main className="">home</main>;
}
