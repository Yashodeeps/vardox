import SideMenu from "@/components/custom/Sidemenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* <SideMenu /> */}
      {children}
    </div>
  );
}
