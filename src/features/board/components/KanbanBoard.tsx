import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBoardStore } from '../store/boardStore';
import { Task, TaskStatus } from '../types';
import { COLUMNS, selectTasksByStatus } from '../selectors/boardSelectors';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

export interface KanbanBoardProps {
  onTaskClick: (task: Task) => void;
  onQuickAddTask: (status: TaskStatus) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onTaskClick, onQuickAddTask }) => {
  const { tasks, filters, moveTask, reorderTaskInColumn } = useBoardStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to start drag to allow standard clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Moving over another task in a different column
    if (isOverTask) {
      const activeTaskItem = tasks.find((t) => t.id === activeId);
      const overTaskItem = tasks.find((t) => t.id === overId);

      if (activeTaskItem && overTaskItem && activeTaskItem.status !== overTaskItem.status) {
        // Move task to the over task's status at its index
        const overIndex = tasks
          .filter((t) => t.status === overTaskItem.status)
          .findIndex((t) => t.id === overId);
        moveTask(Number(activeId), overTaskItem.status, overIndex);
      }
    }

    // Moving over an empty column
    if (isOverColumn) {
      const activeTaskItem = tasks.find((t) => t.id === activeId);
      const targetStatus = over.data.current?.status as TaskStatus;

      if (activeTaskItem && targetStatus && activeTaskItem.status !== targetStatus) {
        moveTask(Number(activeId), targetStatus);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = Number(active.id);
    const overId = over.id;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Dropped over a column directly
    if (over.data.current?.type === 'Column') {
      const targetStatus = over.data.current.status as TaskStatus;
      if (activeTaskItem.status !== targetStatus) {
        moveTask(activeId, targetStatus);
      }
      return;
    }

    // Dropped over another task
    if (over.data.current?.type === 'Task') {
      const overTaskId = Number(overId);
      const overTaskItem = tasks.find((t) => t.id === overTaskId);
      if (!overTaskItem) return;

      if (activeTaskItem.status === overTaskItem.status) {
        // Same column reordering
        const columnTasks = tasks
          .filter((t) => t.status === activeTaskItem.status)
          .sort((a, b) => a.order - b.order);

        const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
        const newIndex = columnTasks.findIndex((t) => t.id === overTaskId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          reorderTaskInColumn(activeId, oldIndex, newIndex);
        }
      } else {
        // Different column drop
        const targetColumnTasks = tasks
          .filter((t) => t.status === overTaskItem.status)
          .sort((a, b) => a.order - b.order);

        const newIndex = targetColumnTasks.findIndex((t) => t.id === overTaskId);
        moveTask(activeId, overTaskItem.status, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x">
        {COLUMNS.map((column) => {
          const columnTasks = selectTasksByStatus(tasks, column.id, filters);

          return (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              color={column.color}
              description={column.description}
              tasks={columnTasks}
              onTaskClick={onTaskClick}
              onQuickAddTask={onQuickAddTask}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
};
