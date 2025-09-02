import { Todo } from "../types/todo";

const STORAGE_KEY = "todos";

export class LocalStorageService {
  static getTodos(): Todo[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const todos = JSON.parse(stored);
      // 转换日期字符串回Date对象
      return todos.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
      return [];
    }
  }

  static saveTodos(todos: Todo[]): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todos to localStorage:", error);
    }
  }

  static addTodo(todo: Omit<Todo, "id" | "createdAt" | "updatedAt">): Todo {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      priority: todo.priority || "low", // 默认低优先级
      category: todo.category || "工作", // 默认工作分类
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const todos = this.getTodos();
    todos.push(newTodo);
    this.saveTodos(todos);

    return newTodo;
  }

  static updateTodo(id: string, updates: Partial<Todo>): Todo | null {
    const todos = this.getTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) return null;

    const updatedTodo = {
      ...todos[index],
      ...updates,
      updatedAt: new Date(),
    };

    todos[index] = updatedTodo;
    this.saveTodos(todos);

    return updatedTodo;
  }

  static deleteTodo(id: string): boolean {
    const todos = this.getTodos();
    const filteredTodos = todos.filter((todo) => todo.id !== id);

    if (filteredTodos.length === todos.length) return false;

    this.saveTodos(filteredTodos);
    return true;
  }

  static toggleTodo(id: string): Todo | null {
    const todos = this.getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) return null;

    return this.updateTodo(id, { completed: !todo.completed });
  }

  static reorderTodos(todos: Todo[]): void {
    this.saveTodos(todos);
  }

  // 获取初始示例数据
  static getInitialTodos(): Todo[] {
    const existingTodos = this.getTodos();
    if (existingTodos.length > 0) return existingTodos;

    const sampleTodos: Todo[] = [
      {
        id: "1",
        title: "这是你的第一个待办哦",
        description: "请继续创建你的待办清单吧～",
        completed: false,
        priority: "high",
        category: "工作",
        createdAt: new Date(),
        updatedAt: new Date(),
        order: 0,
      },
    ];

    this.saveTodos(sampleTodos);
    return sampleTodos;
  }
}
