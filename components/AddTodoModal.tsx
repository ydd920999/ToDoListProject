'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import { Todo } from '../types/todo';

const { TextArea } = Input;
const { Option } = Select;

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTodo?: Todo | null;
}

// 预定义的分类选项
const categoryOptions = ['工作', '学习', '生活', '健康', '娱乐', '购物', '其他'];

export default function AddTodoModal({ isOpen, onClose, onSave, editingTodo }: AddTodoModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      if (editingTodo) {
        // 编辑模式：回显数据
        form.setFieldsValue({
          title: editingTodo.title,
          description: editingTodo.description || '',
          priority: editingTodo.priority,
          category: editingTodo.category || '工作',
          dueDate: editingTodo.dueDate ? dayjs(editingTodo.dueDate) : null,
        });
      } else {
        // 新建模式：设置默认值
        form.setFieldsValue({
          title: '',
          description: '',
          priority: 'low', // 默认低优先级
          category: '工作', // 默认工作分类
          dueDate: null,
        });
      }
    }
  }, [editingTodo, isOpen, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const newTodo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'> = {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        completed: editingTodo?.completed || false,
        priority: values.priority,
        category: values.category,
        dueDate: values.dueDate ? values.dueDate.toDate() : undefined,
        order: editingTodo?.order || Date.now(),
      };

      onSave(newTodo);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={editingTodo ? '编辑任务' : '添加新任务'}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnClose={true}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="title"
          label="任务标题"
          rules={[{ required: true, message: '请输入任务标题' }]}
        >
          <Input placeholder="输入任务标题..." />
        </Form.Item>

        <Form.Item
          name="description"
          label="任务描述"
        >
          <TextArea 
            rows={3} 
            placeholder="输入任务描述..." 
            showCount
            maxLength={200}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="priority"
            label="优先级"
          >
            <Select placeholder="选择优先级">
              <Option value="low">低优先级</Option>
              <Option value="medium">中优先级</Option>
              <Option value="high">高优先级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
          >
            <Select placeholder="选择分类">
              {categoryOptions.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="dueDate"
          label="截止日期"
        >
          <DatePicker 
            className="w-full"
            placeholder="选择截止日期"
            disabledDate={(current) => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item className="mb-0 pt-4">
          <div className="flex gap-3">
            <Button 
              onClick={handleClose} 
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              className="flex-1"
            >
              {editingTodo ? '更新任务' : '添加任务'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
