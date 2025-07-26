export function Loading() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-1 sm:px-2 lg:px-2 py-8">
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
        <p className="text-gray-600 text-lg font-medium">Carregando...</p>
      </div>
    </div>
  );
}
