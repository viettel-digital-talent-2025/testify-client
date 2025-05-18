export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-full min-h-screen items-center justify-center"
      style={{
        background: "url('/auth-bg.svg') no-repeat center center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 z-0 bg-black/35" />
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
