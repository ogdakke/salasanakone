
type Props = {error: any, resetErrorBoundary: any}
export const ErrorComponent = ({error, resetErrorBoundary}: Props) => {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.
    window.localStorage.clear()
    resetErrorBoundary()

    return (
      <div role="alert">
        <p>Jotain meni vikaan:</p>
        <pre style={{ color: "red" }}>{error.message}</pre>
      </div>
    );
  }