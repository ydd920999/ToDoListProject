'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '../types/todo';
import TodoCard from './TodoCard';

interface SortableTodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export default function SortableTodoCard({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: SortableTodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? 'z-50' : ''}
    >
      <TodoCard
        todo={todo}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        isDragging={isDragging}
        disableInternalDrag={true}
      />
    </div>
  );
}
