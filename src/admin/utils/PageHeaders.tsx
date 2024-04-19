export default function PageHeader({
  title,
  style,
}: {
  title: string;
  style: string;
}) {
  return (
    <div className="text-start">
      <span
        className={`flex ${style.length > 0 ? style : 'text-8xl'}  font-bold text-primary-color`}
      >
        <h1>{title.slice(0, -1)}</h1>
        <h1 className="text-yellow-600">{title.charAt(title.length - 1)}.</h1>
      </span>

      {/* {description.length > 0 ? (
        <p className="ml-2 mt-[1rem] max-w-lg break-words">{description}</p>
      ) : null} */}
    </div>
  );
}
