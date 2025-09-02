"use client";

import { useState, useEffect } from "react";
import { Todo, TodoAction } from "../types/todo";
import { LocalStorageService } from "../lib/localStorage";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // 初始化数据
  useEffect(() => {
    const initialTodos = LocalStorageService.getInitialTodos();
    setTodos(initialTodos);
    setLoading(false);
  }, []);

  // 添加新任务
  const addTodo = (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt">) => {
    const newTodo = LocalStorageService.addTodo({
      ...todoData,
      order:
        Math.max(...todos.filter((t) => !t.completed).map((t) => t.order), -1) +
        1,
    });
    setTodos((prev) => [...prev, newTodo]);
    return newTodo;
  };

  // 更新任务
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const updatedTodo = LocalStorageService.updateTodo(id, updates);
    if (updatedTodo) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
    }
    return updatedTodo;
  };

  // 删除任务
  const deleteTodo = (id: string) => {
    const success = LocalStorageService.deleteTodo(id);
    if (success) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
    return success;
  };

  // 切换任务完成状态
  const toggleTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return null;

    // 如果是标记为完成，将order设置为已完成任务的最大order + 1
    // 如果是标记为未完成，将order设置为未完成任务的最大order + 1
    const newCompleted = !todo.completed;
    const relevantTodos = todos.filter((t) => t.completed === newCompleted);
    const newOrder =
      relevantTodos.length > 0
        ? Math.max(...relevantTodos.map((t) => t.order)) + 1
        : 0;

    return updateTodo(id, {
      completed: newCompleted,
      order: newOrder,
    });
  };

  // 移动任务（拖拽）
  const moveTodo = (id: string, newStatus: boolean, newOrder: number) => {
    return updateTodo(id, {
      completed: newStatus,
      order: newOrder,
    });
  };

  // 重新排序任务
  const reorderTodos = (
    sourceIndex: number,
    destinationIndex: number,
    status?: "pending" | "completed"
  ) => {
    const filteredTodos = status
      ? todos.filter((t) => t.completed === (status === "completed"))
      : todos;

    const reorderedTodos = [...filteredTodos];
    const [removed] = reorderedTodos.splice(sourceIndex, 1);
    reorderedTodos.splice(destinationIndex, 0, removed);

    // 更新order字段
    const updatedTodos = reorderedTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    // 更新状态
    const newTodos = todos.map((todo) => {
      const updated = updatedTodos.find((t) => t.id === todo.id);
      return updated || todo;
    });

    setTodos(newTodos);
    LocalStorageService.reorderTodos(newTodos);
  };

  // 在同一列内移动任务（拖拽排序）
  const moveCardInColumn = (
    dragIndex: number,
    hoverIndex: number,
    columnType: "pending" | "completed"
  ) => {
    const isCompleted = columnType === "completed";
    const columnTodos = todos
      .filter((t) => t.completed === isCompleted)
      .sort((a, b) => a.order - b.order);

    if (dragIndex === hoverIndex) {
      return;
    }

    const newColumnTodos = [...columnTodos];
    const [draggedTodo] = newColumnTodos.splice(dragIndex, 1);
    newColumnTodos.splice(hoverIndex, 0, draggedTodo);

    // 重新分配order
    const updatedTodos = newColumnTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    // 更新整个todos数组
    const newTodos = todos.map((todo) => {
      const updated = updatedTodos.find((t) => t.id === todo.id);
      return updated || todo;
    });

    setTodos(newTodos);
    LocalStorageService.reorderTodos(newTodos);
  };

  // 批量更新任务
  const batchUpdateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
    LocalStorageService.reorderTodos(newTodos);
  };

  // 获取分类的任务
  const getPendingTodos = () => todos.filter((todo) => !todo.completed);
  const getCompletedTodos = () => todos.filter((todo) => todo.completed);
  const getAllTodos = () => todos;

  // 获取统计信息
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(
      (t) => t.dueDate && new Date() > t.dueDate && !t.completed
    ).length;

    return { total, completed, pending, overdue };
  };

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    moveTodo,
    reorderTodos,
    moveCardInColumn,
    batchUpdateTodos,
    getPendingTodos,
    getCompletedTodos,
    getAllTodos,
    getStats,
  };
}
