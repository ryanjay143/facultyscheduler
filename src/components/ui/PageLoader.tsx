type PageLoaderProps = {
  /** When true render as an absolute full-screen overlay. Default: false (center inside parent card/box) */
  overlay?: boolean;
  /** Optional additional classes applied to the wrapper */
  className?: string;
};

const PageLoader = ({ overlay = false, className = '' }: PageLoaderProps) => {
  const wrapperClass = overlay
    ? `absolute inset-0 flex items-center justify-center z-50 ${className}`
    : `flex items-center justify-center py-12 ${className}`;

  return (
    <div className={wrapperClass}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animation */}
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"
          role="status"
          aria-label="Loading"
        />
        {/* Text below */}
        <p className="text-muted-foreground font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default PageLoader;
