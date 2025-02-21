export function Card({ children }) {
    return <div className="border rounded-lg p-4 shadow-md bg-white">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div className="text-sm">{children}</div>;
  }
  