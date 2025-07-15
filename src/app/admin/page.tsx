export default function DashboardPage() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="bg-muted aspect-video h-12 w-full rounded-lg"
        />
      ))}
    </>
  );
}
