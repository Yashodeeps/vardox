export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* <SideMenu /> */}
      {children}
    </div>
  );
}
