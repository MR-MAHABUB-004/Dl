const ProgressBar = ({ progress }) => {
  return (
    <div className="mt-8 w-full max-w-xs">
      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      {progress < 100 ? (
        <p className="text-center text-sm">{progress}%</p>
      ) : (
        <p className="my-4 text-center text-sm text-green-500">
          Download Complete 🎉
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
