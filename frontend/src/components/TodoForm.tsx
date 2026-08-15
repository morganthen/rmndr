import { useState } from "react";

interface TodoFormProps {
  createTodo: (todo: string) => void;
}

function TodoForm({ createTodo }: TodoFormProps) {
  const [todo, setTodo] = useState<string>("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTodo(todo);
    setTodo("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="new task"
          onChange={(e) => setTodo(e.target.value)}
          value={todo}
        ></input>
        <button type="submit">Add task</button>
      </form>
    </div>
  );
}

export default TodoForm;
