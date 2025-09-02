'use client';

import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Todo } from '../types/todo';
import TodoCard from './TodoCard';

interface DraggableTodoCardProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onMoveCard: (dragIndex: number, hoverIndex: number) => void;
  columnType: 'all' | 'pending' | 'completed';
}

interface DragItem {
  id: string;
  index: number;
  type: string;
  todo: Todo;
  columnType: string;
}

export default function DraggableTodoCard({
  todo,
  index,
  onToggle,
  onDelete,
  onEdit,
  onMoveCard,
  columnType,
}: DraggableTodoCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'todo',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragColumnType = item.columnType;

      // 如果拖拽的卡片就是当前卡片，不做任何操作
      if (dragIndex === hoverIndex && dragColumnType === columnType) {
        return;
      }

      // 如果是跨列拖拽，不在这里处理排序
      if (dragColumnType !== columnType) {
        return;
      }

      // 获取悬停区域的矩形边界
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      if (!hoverBoundingRect) return;

      // 获取中点
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // 获取鼠标位置
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // 获取相对于悬停区域顶部的鼠标位置
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 只有当鼠标越过一半时才执行移动
      // 向下拖拽时，只有当鼠标超过50%时才触发
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // 向上拖拽时，只有当鼠标低于50%时才触发
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // 执行移动
      onMoveCard(dragIndex, hoverIndex);

      // 注意：这里我们修改monitor item的index
      // 通常最好避免这样做，但这对于性能来说是必要的
      // 因为我们要避免昂贵的index查找
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: 'todo',
    item: () => {
      return { 
        id: todo.id, 
        index, 
        type: 'todo',
        todo,
        columnType 
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  
  // 连接拖拽和放置引用
  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      style={{ opacity }} 
      data-handler-id={handlerId}
      className={isDragging ? 'cursor-grabbing' : 'cursor-grab'}
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
