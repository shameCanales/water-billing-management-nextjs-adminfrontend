import SideBar from "@/components/SideBar";
import MenuButton from "@/components/ui/MenuButton";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* <SidebarWrapper />
      <MobileSidebarWrapper /> */}
      <SideBar />
      <div className="flex-1 overflow-y-auto p-4 transition-all duration-300">
        <MenuButton />
        {children}
      </div>
    </div>
  );
}

// we did login check here but removed because we already have it in the middleware/interceptor
