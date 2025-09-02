'use client';

import React from 'react';
import { useDrag } from 'react-dnd';
import { Todo } from '../types/todo';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useThemeStyles } from '../hooks/useThemeStyles';
import { Calendar, Clock, Flag, MoreHorizontal, Trash2, Edit3, Check, X } from 'lucide-react';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  isDragging?: boolean;
  disableInternalDrag?: boolean;
}

const priorityColors = {
  low: 'border-l-green-400 bg-green-50/30',
  medium: 'border-l-yellow-400 bg-yellow-50/30',
  high: 'border-l-red-400 bg-red-50/30',
};

const priorityIcons = {
  low: '🟢',
  medium: '🟡', 
  high: '🔴',
};

export default function TodoCard({ todo, onToggle, onDelete, onEdit, isDragging, disableInternalDrag = false }: TodoCardProps) {
  const themeClasses = useThemeClasses();
  const themeStyles = useThemeStyles();
  const [{ isDragActive }, drag] = useDrag<{ id: string; todo: Todo }, void, { isDragActive: boolean }>({
    type: 'todo',
    item: { id: todo.id, todo },
    collect: (monitor) => ({
      isDragActive: monitor.isDragging(),
    }),
    canDrag: !disableInternalDrag,
  });

  const [showActions, setShowActions] = React.useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isOverdue = todo.dueDate && new Date() > todo.dueDate && !todo.completed;

  return (
    <div
      ref={disableInternalDrag ? undefined : (drag as any)}
      className={`
        task-card p-4 border-l-4 relative group w-full max-w-full overflow-hidden
        min-h-[120px] max-h-[120px] flex flex-col
        ${disableInternalDrag ? '' : 'cursor-move'}
        ${priorityColors[todo.priority]}
        ${isDragActive || isDragging ? 'opacity-50 transform rotate-2 scale-105' : ''}
        ${todo.completed ? 'opacity-75' : ''}
        ${isOverdue ? 'ring-2 ring-red-200' : ''}
        animate-slide-up
      `}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* 完成状态指示器 */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`
            mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center
            transition-all duration-200 flex-shrink-0
            ${todo.completed 
              ? 'bg-primary-500 border-primary-500 text-white' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50'
            }
          `}
        >
          {todo.completed && <Check size={12} />}
        </button>

        <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
          {/* 标题 */}
          <h3 
            className={`
              font-semibold mb-1 leading-tight break-words line-clamp-1
              ${todo.completed ? 'line-through' : ''}
            `}
            style={todo.completed ? themeStyles.text.disabled : themeStyles.text.primary}
          >
            {todo.title}
          </h3>

          {/* 描述 */}
          {todo.description && (
            <p 
              className={`
                text-sm mb-2 leading-relaxed break-words line-clamp-2 flex-1
                ${todo.completed ? 'line-through' : ''}
              `}
              style={todo.completed ? themeStyles.text.disabled : themeStyles.text.muted}
            >
              {todo.description}
            </p>
          )}

          {/* 元数据 */}
          <div 
            className="flex items-center gap-2 text-xs flex-wrap mt-auto"
            style={themeStyles.text.disabled}
          >
            {/* 优先级 */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span>{priorityIcons[todo.priority]}</span>
              <span className="capitalize">{todo.priority}</span>
            </div>

            {/* 分类 */}
            {todo.category && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Flag size={12} />
                <span>{todo.category}</span>
              </div>
            )}

            {/* 截止日期 */}
            {todo.dueDate && (
              <div className={`
                flex items-center gap-1 flex-shrink-0
                ${isOverdue ? 'text-red-500 font-medium' : ''}
              `}>
                <Calendar size={12} />
                <span>{formatDate(todo.dueDate)}</span>
              </div>
            )}

            {/* 创建时间 */}
            <div className="flex items-center gap-1 ml-auto flex-shrink-0">
              <Clock size={12} />
              <span>{formatDate(todo.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className={`
        absolute top-2 right-2 flex items-center gap-1
        transition-opacity duration-200
        ${showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
          title="编辑"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
          title="删除"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* 过期标识 */}
      {isOverdue && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
}
