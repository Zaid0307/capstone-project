export default function Button({ name, type, onClick }) {
  return (
    <button onClick={onClick} type={type}>
      {name}
    </button>
  );
}
