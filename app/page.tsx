'use client';

import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useTodos } from '../hooks/useTodos';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useThemeStyles } from '../hooks/useThemeStyles';
import TodoColumn from '../components/TodoColumn';
import AddTodoModal from '../components/AddTodoModal';
import ThemeToggle from '../components/ThemeToggle';
import { Todo } from '../types/todo';
import { LocalStorageService } from '../lib/localStorage';
import { BarChart3, Plus, Search } from 'lucide-react';

export default function HomePage() {
  const {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    moveTodo,
    moveCardInColumn,
    batchUpdateTodos,
    getPendingTodos,
    getCompletedTodos,
    getAllTodos,
    getStats,
  } = useTodos();
  
  const themeClasses = useThemeClasses();
  const themeStyles = useThemeStyles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const stats = getStats();

  // 配置拖拽传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要拖拽8px才激活
      },
    })
  );

  // 处理拖拽
  const handleDrop = (item: any, targetType: string) => {
    const { todo } = item;
    const newCompleted = targetType === 'completed';
    
    if (todo.completed !== newCompleted) {
      // 获取目标列表中的任务，计算新的order
      const targetTodos = newCompleted ? getCompletedTodos() : getPendingTodos();
      const newOrder = targetTodos.length > 0 
        ? Math.max(...targetTodos.map(t => t.order)) + 1 
        : 0;
      
      moveTodo(todo.id, newCompleted, newOrder);
    }
  };

  // 处理保存任务
  const handleSaveTodo = (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTodo) {
      updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
    } else {
      addTodo(todoData);
    }
  };

  // 处理编辑
  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // 处理拖拽排序
  const handleReorder = (dragIndex: number, hoverIndex: number, sourceType: string, targetType: string) => {
    if (sourceType === targetType && (sourceType === 'pending' || sourceType === 'completed')) {
      moveCardInColumn(dragIndex, hoverIndex, sourceType as 'pending' | 'completed');
    }
  };

  // dnd-kit 拖拽事件处理
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // 只用于视觉反馈，不执行实际的移动操作
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) {
      return;
    }

    const activeTodo = todos.find(t => t.id === active.id);
    if (!activeTodo) return;

    // 如果拖拽到列容器（跨列拖拽）
    if (over.id === 'pending-droppable' || over.id === 'completed-droppable') {
      const newCompleted = over.id === 'completed-droppable';
      
      if (activeTodo.completed !== newCompleted) {
        // 执行跨列移动
        const targetTodos = newCompleted ? getCompletedTodos() : getPendingTodos();
        const newOrder = targetTodos.length > 0 
          ? Math.max(...targetTodos.map(t => t.order)) + 1 
          : 0;
        
        moveTodo(activeTodo.id, newCompleted, newOrder);
      }
      return;
    }

    // 拖拽到具体任务上
    const overTodo = todos.find(t => t.id === over.id);
    if (!overTodo) return;

    // 如果是同一列内的排序
    if (activeTodo.completed === overTodo.completed) {
      const columnType = activeTodo.completed ? 'completed' : 'pending';
      const columnTodos = todos
        .filter(t => t.completed === activeTodo.completed)
        .sort((a, b) => a.order - b.order);
      
      const oldIndex = columnTodos.findIndex(t => t.id === active.id);
      const newIndex = columnTodos.findIndex(t => t.id === over.id);
      
      if (oldIndex !== newIndex) {
        moveCardInColumn(oldIndex, newIndex, columnType);
      }
    } else {
      // 跨列拖拽到具体任务上
      const newCompleted = overTodo.completed;
      const targetTodos = newCompleted ? getCompletedTodos() : getPendingTodos();
      const overIndex = targetTodos.findIndex(t => t.id === over.id);
      
      // 插入到目标任务的位置
      const newOrder = overIndex;
      
      // 更新目标列表中其他任务的order
      const updatedTargetTodos = targetTodos.map((todo, index) => ({
        ...todo,
        order: index >= overIndex ? index + 1 : index,
      }));
      
      // 更新所有任务
      const newTodos = todos.map(todo => {
        if (todo.id === active.id) {
          return { ...todo, completed: newCompleted, order: newOrder };
        }
        const updated = updatedTargetTodos.find(t => t.id === todo.id);
        return updated || todo;
      });
      
      batchUpdateTodos(newTodos);
    }
  };

  // 过滤任务
  const filterTodos = (todoList: Todo[]) => {
    if (!searchQuery.trim()) return todoList;
    
    const query = searchQuery.toLowerCase();
    return todoList.filter(todo => 
      todo.title.toLowerCase().includes(query) ||
      (todo.description && todo.description.toLowerCase().includes(query)) ||
      (todo.category && todo.category.toLowerCase().includes(query))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="h-screen flex flex-col overflow-hidden w-screen transition-colors duration-300">
        {/* 顶部导航 */}
        <header className="glass-effect z-40 border-b border-white/20 flex-shrink-0 w-full">
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between min-w-0 gap-4">
              {/* 标题和统计 */}
              <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold gradient-text flex-shrink-0">待办清单</h1>
                <div 
                  className="hidden sm:flex items-center gap-4 text-sm"
                  style={themeStyles.text.muted}
                >
                  <div className="flex items-center gap-1">
                    <BarChart3 size={16} />
                    <span>总计: {stats.total}</span>
                  </div>
                  <div style={themeStyles.status.info}>待完成: {stats.pending}</div>
                  <div style={themeStyles.status.success}>已完成: {stats.completed}</div>
                  {stats.overdue > 0 && (
                    <div style={themeStyles.status.error}>逾期: {stats.overdue}</div>
                  )}
                </div>
                <div 
                  className="sm:hidden flex items-center gap-2 text-xs"
                  style={themeStyles.text.muted}
                >
                  <span style={themeStyles.status.info}>{stats.pending}</span>
                  <span>/</span>
                  <span style={themeStyles.status.success}>{stats.completed}</span>
                  {stats.overdue > 0 && (
                    <>
                      <span>/</span>
                      <span style={themeStyles.status.error}>{stats.overdue}</span>
                    </>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* 搜索框 */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 w-32 sm:w-48 lg:w-64 text-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    style={{
                      ...themeStyles.background.input,
                      ...themeStyles.text.primary,
                      ...themeStyles.border.input,
                    }}
                  />
                </div>
                
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm text-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">添加任务</span>
                  <span className="sm:hidden">添加</span>
                </button>
                
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* 主要内容区域 */}
        <main className="flex-1 overflow-hidden px-4 sm:px-6 py-4 sm:py-8">
          <div className="h-full max-w-none mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 h-full overflow-hidden">
            {/* 待完成任务 */}
            <TodoColumn
              title="待完成"
              type="pending"
              todos={filterTodos(getPendingTodos())}
              onDrop={handleDrop}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={handleEdit}
              onAddNew={() => setIsModalOpen(true)}
              onReorder={handleReorder}
            />

            {/* 已完成任务 */}
            <TodoColumn
              title="已完成"
              type="completed"
              todos={filterTodos(getCompletedTodos())}
              onDrop={handleDrop}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={handleEdit}
              onReorder={handleReorder}
            />

            {/* 全部任务 */}
            <TodoColumn
              title="全部任务"
              type="all"
              todos={filterTodos(getAllTodos())}
              onDrop={handleDrop}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={handleEdit}
            />
            </div>
          </div>
        </main>

        {/* 添加/编辑任务模态框 */}
        <AddTodoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTodo}
          editingTodo={editingTodo}
        />

        {/* 底部信息 */}
        <footer className="mt-16 py-8 text-center text-gray-500 text-sm">
          <p>使用 React DnD + DnD Kit 实现拖拽功能 • 数据保存在本地存储</p>
        </footer>
        </div>
      </DndContext>
    </DndProvider>
  );
}
