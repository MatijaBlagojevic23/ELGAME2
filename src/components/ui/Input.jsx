export function Input({ value, onChange, placeholder }) {
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 border rounded-lg w-full"
      />
    );
  }
  