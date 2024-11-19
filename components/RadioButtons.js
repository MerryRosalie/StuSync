const RadioButtons = ({ options, selectedValue, onValueChange }) => {
  return (
    <div className="p-4">
      {options.map((option) => (
        <button
          key={option}
          className="flex flex-row items-center mb-4 w-full text-left"
          onClick={() => onValueChange(option)}
          type="button"
        >
          <div className="h-6 w-6 rounded-full border-2 border-gray-400 mr-3 flex items-center justify-center">
            {selectedValue === option && (
              <div className="h-4 w-4 rounded-full bg-blue-500" />
            )}
          </div>
          <span className="text-base">{option}</span>
        </button>
      ))}
    </div>
  );
};
