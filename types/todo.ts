export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high";
  category?: string;
  dueDate?: Date;
  order: number;
}

export interface TodoFilter {
  status: "all" | "pending" | "completed";
  priority?: "low" | "medium" | "high";
  category?: string;
}

export type TodoAction =
  | { type: "ADD_TODO"; payload: Omit<Todo, "id" | "createdAt" | "updatedAt"> }
  | { type: "UPDATE_TODO"; payload: { id: string; updates: Partial<Todo> } }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "TOGGLE_TODO"; payload: string }
  | {
      type: "REORDER_TODOS";
      payload: {
        sourceIndex: number;
        destinationIndex: number;
        status?: "pending" | "completed";
      };
    }
  | { type: "SET_TODOS"; payload: Todo[] }
  | {
      type: "MOVE_TODO";
      payload: { id: string; newStatus: boolean; newOrder: number };
    };
