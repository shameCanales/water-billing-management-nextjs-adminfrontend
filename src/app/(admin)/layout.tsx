import SideBar from "@/components/SideBar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SideBar />
      <div>{children}</div>
    </div>
  );
}

// we did login check here but removed because we already have it in the middleware
