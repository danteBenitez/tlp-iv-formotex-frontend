import { ReactNode } from "react";

type DashboardPageProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function DashboardPage(props: DashboardPageProps) {
  return (
    <main className="w-full p-8">
      <div className="flex gap-2 flex-col">
        <h2 className="text-5xl font-bold mb-2 font-sans-accent">
          {props.title}
        </h2>
        <p className="p-2 text-xl">{props.description}</p>
      </div>
      <div className="px-4 py-5 flex flex-col">{props.children}</div>
    </main>
  );
}
