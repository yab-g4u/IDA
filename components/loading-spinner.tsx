interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
}

const LoadingSpinner = ({ size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={`animate-spin rounded-full border-2 border-current border-t-transparent ${sizeClasses[size]}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner

