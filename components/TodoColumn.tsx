'use client';

import React from 'react';
import { useDrop } from 'react-dnd';
import { useDroppable } from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Todo } from '../types/todo';
import TodoCard from './TodoCard';
import DraggableTodoCard from './DraggableTodoCard';
import SortableTodoCard from './SortableTodoCard';
import { Plus, CheckCircle, Circle, List } from 'lucide-react';

interface DragItem {
  id: string;
  index: number;
  type: string;
  todo: Todo;
  columnType: string;
}

interface TodoColumnProps {
  title: string;
  todos: Todo[];
  type: 'all' | 'pending' | 'completed';
  onDrop: (item: DragItem, targetType: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onAddNew?: () => void;
  onReorder?: (dragIndex: number, dropIndex: number, sourceType: string, targetType: string) => void;
  icon?: React.ReactNode;
}

const typeConfig = {
  all: {
    icon: <List size={20} />,
    bgGradient: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-200',
    emptyMessage: '暂无任务',
  },
  pending: {
    icon: <Circle size={20} />,
    bgGradient: 'from-blue-500 to-blue-600',
    borderColor: 'border-blue-200',
    emptyMessage: '暂无待完成任务',
  },
  completed: {
    icon: <CheckCircle size={20} />,
    bgGradient: 'from-green-500 to-green-600',
    borderColor: 'border-green-200',
    emptyMessage: '暂无已完成任务',
  },
};

export default function TodoColumn({
  title,
  todos,
  type,
  onDrop,
  onToggle,
  onDelete,
  onEdit,
  onAddNew,
  onReorder,
}: TodoColumnProps) {
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: 'todo',
    drop: (item: DragItem) => onDrop(item, type),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  // dnd-kit 的 droppable 用于跨列拖拽
  const droppableId = type === 'pending' ? 'pending-droppable' : 
                     type === 'completed' ? 'completed-droppable' : 
                     'all-droppable';
  const { setNodeRef: setDroppableRef, isOver: isOverDndKit } = useDroppable({
    id: droppableId,
    disabled: type === 'all', // 全部列表不支持跨列拖拽
  });

  const config = typeConfig[type];
  const isActive = isOver && canDrop;
  const isActiveDndKit = isOverDndKit && type !== 'all';

  return (
    <div className="flex flex-col h-full min-h-0 min-w-0 w-full max-w-full overflow-hidden">
      {/* 列标题 */}
      <div className={`
        flex items-center justify-between p-4 rounded-t-xl
        bg-gradient-to-r ${config.bgGradient} text-white
        shadow-sm
      `}>
        <div className="flex items-center gap-3">
          {config.icon}
          <h2 className="font-semibold text-lg">{title}</h2>
          <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
            {todos.length}
          </span>
        </div>
        
        {type === 'pending' && onAddNew && (
          <button
            onClick={onAddNew}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="添加新任务"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      {/* 任务列表 */}
      <div
        ref={(node) => {
          drop(node);
          if (type !== 'all') setDroppableRef(node);
        }}
        className={`
          flex-1 rounded-b-xl bg-white/50 backdrop-blur-sm
          border-2 border-t-0 ${config.borderColor}
          ${isActive || isActiveDndKit ? 'border-primary-400 bg-primary-50/30' : ''}
          transition-all duration-200 overflow-hidden flex flex-col relative
        `}
      >
        <div className={`
          flex-1 overflow-y-auto overflow-x-hidden p-4 
          ${todos.length === 0 ? 'flex items-center justify-center' : ''}
        `}>
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-4xl mb-4 opacity-50">
                {type === 'pending' && '📝'}
                {type === 'completed' && '✅'}
                {type === 'all' && '📋'}
              </div>
              <p className="text-center text-sm">{config.emptyMessage}</p>
              {type === 'pending' && onAddNew && (
                <button
                  onClick={onAddNew}
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  创建第一个任务
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {type === 'all' ? (
                // 全部任务列不支持排序，只显示
                todos
                  .sort((a, b) => a.order - b.order)
                  .map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))
              ) : (
                // 待完成和已完成任务支持排序
                <SortableContext 
                  items={todos.map(todo => todo.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {todos
                    .sort((a, b) => a.order - b.order)
                    .map((todo) => (
                      <SortableTodoCard
                        key={todo.id}
                        todo={todo}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onEdit={onEdit}
                      />
                    ))}
                </SortableContext>
              )}
            </div>
          )}
        </div>

        {/* 拖拽提示 */}
        {(isActive || isActiveDndKit) && (
          <div className="absolute inset-4 border-2 border-dashed border-primary-400 rounded-lg bg-primary-50/30 flex items-center justify-center">
            <p className="text-primary-600 font-medium">释放以放置任务</p>
          </div>
        )}
      </div>
    </div>
  );
}
