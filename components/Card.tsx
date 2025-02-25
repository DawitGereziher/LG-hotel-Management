const Card = ({ title, value }: { title: string; value: string }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };
  export function CardContent({ className, children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
export function card({ className, children }) {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}


  export default Card;
  