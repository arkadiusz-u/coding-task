interface LoaderProps {
  text?: string;
}

export const Loader = ({ text = 'Loading...' }: LoaderProps) => (
  <div className="loading">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
); 