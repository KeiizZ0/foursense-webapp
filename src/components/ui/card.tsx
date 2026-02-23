interface CardProps {
  title: string;
  content: string | number | undefined;
  description: string;
  color: "red" | "yellow" | "green" | "blue" | "purple";
}

export const Card = ({ title, content, description, color }: CardProps) => {
  const colorMap = {
    red: "text-red-500",
    yellow: "text-yellow-400",
    green: "text-green-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
  };

  return (
    <div className="card bg-base-100 w-fit shadow-sm p-4">
      <div className="flex items-start gap-2.5">
        <h2 className="font-semibold">{title}</h2>
        <span className={`${colorMap[color]}`}>●</span>
      </div>

      <div className="text-3xl font-bold mt-2 text-gray-800">{content}</div>

      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </div>
  );
};
