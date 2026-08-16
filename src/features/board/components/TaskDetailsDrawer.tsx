import React, { useState, useEffect } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { TaskPriority, TaskStatus } from '../types';
import { useBoardStore } from '../store/boardStore';
import { TEAM_MEMBERS } from '../utils/taskAdapter';
import { COLUMNS } from '../selectors/boardSelectors';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/features/auth/store/authStore';
import { formatRelativeTime } from '@/utils/date';
import {
  Trash2,
  Send,
  MessageSquare,
} from 'lucide-react';

export interface TaskDetailsDrawerProps {
  taskId: number | null;
  onClose: () => void;
}

const priorityOptions = [
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
];

const statusOptions = COLUMNS.map((col) => ({
  value: col.id,
  label: col.title,
}));

export const TaskDetailsDrawer: React.FC<TaskDetailsDrawerProps> = ({ taskId, onClose }) => {
  const { tasks, updateTask, deleteTask, addComment } = useBoardStore();
  const { user } = useAuthStore();
  const { success } = useToast();

  const task = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setAssignee(task.assignee);
      setDueDate(task.dueDate || '');
      setIsEditingTitle(false);
    }
  }, [task]);

  if (!task) return null;

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== task.title) {
      updateTask(task.id, { title: title.trim() });
      success('Updated', 'Task title updated');
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description });
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setStatus(newStatus);
    updateTask(task.id, { status: newStatus });
    success('Status Updated', `Task moved to ${COLUMNS.find((c) => c.id === newStatus)?.title}`);
  };

  const handlePriorityChange = (newPriority: TaskPriority) => {
    setPriority(newPriority);
    updateTask(task.id, { priority: newPriority });
    success('Priority Updated', `Priority set to ${newPriority}`);
  };

  const handleAssigneeChange = (newAssigneeName: string) => {
    const member = TEAM_MEMBERS.find((m) => m.name === newAssigneeName);
    setAssignee(newAssigneeName);
    updateTask(task.id, {
      assignee: newAssigneeName,
      assigneeAvatar: member?.avatar,
    });
    success('Assignee Updated', `Assigned to ${newAssigneeName}`);
  };

  const handleDueDateChange = (newDate: string) => {
    setDueDate(newDate);
    updateTask(task.id, { dueDate: newDate });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorName = user ? `${user.firstName} ${user.lastName}` : 'Current User';
    const authorAvatar = user?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face';

    addComment(task.id, {
      author: authorName,
      authorAvatar,
      content: commentText.trim(),
    });

    setCommentText('');
    success('Comment Added', 'Your comment has been posted');
  };

  const handleDeleteConfirm = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
    onClose();
    success('Task Deleted', `Task #${task.id} has been permanently deleted.`);
  };

  return (
    <>
      <Drawer
        isOpen={Boolean(taskId)}
        onClose={onClose}
        maxWidth="lg"
        title={`Task #${task.id}`}
        subtitle={
          <span className="flex items-center gap-2">
            <span>Created in Sprint 24</span>
            <span>•</span>
            <span className="capitalize">{task.status}</span>
          </span>
        }
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" aria-hidden="true" />}
            >
              Delete Task
            </Button>
            <Button variant="secondary" size="sm" onClick={onClose}>
              Done Editing
            </Button>
          </div>
        }
      >
        <div className="space-y-6 text-left">
          {/* Editable Title */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Title
            </label>
            {isEditingTitle ? (
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTitleBlur();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                autoFocus
                className="font-semibold text-base"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="p-2 -mx-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer font-bold text-lg text-surface-900 dark:text-surface-50 transition-colors"
                title="Click to edit title"
              >
                {title}
              </div>
            )}
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-800">
            {/* Status */}
            <div>
              <Select
                label="Status"
                id="task-status-select"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                options={statusOptions}
              />
            </div>

            {/* Priority */}
            <div>
              <Select
                label="Priority"
                id="task-priority-select"
                value={priority}
                onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                options={priorityOptions}
              />
            </div>

            {/* Assignee */}
            <div>
              <label
                htmlFor="task-assignee-select"
                className="block text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5"
              >
                Assignee
              </label>
              <select
                id="task-assignee-select"
                value={assignee}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-sm py-2 px-3 focus-ring cursor-pointer text-surface-900 dark:text-surface-100"
              >
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <Input
                label="Due Date"
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="task-desc"
              className="text-xs font-semibold text-surface-500 uppercase tracking-wider block"
            >
              Description
            </label>
            <textarea
              id="task-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              placeholder="Add detailed task requirements, ACs, or specs..."
              className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 p-3 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-y"
            />
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4 border-t border-surface-200 dark:border-surface-800">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-surface-500" aria-hidden="true" />
                Comments & Discussion ({task.comments?.length || 0})
              </h4>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment or feedback..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 px-3.5 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!commentText.trim()}
                leftIcon={<Send className="w-3.5 h-3.5" aria-hidden="true" />}
              >
                Send
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3.5 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {comment.authorAvatar ? (
                          <img
                            src={comment.authorAvatar}
                            alt={comment.author}
                            width="20"
                            height="20"
                            loading="lazy"
                            decoding="async"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-[10px] font-bold flex items-center justify-center">
                            {comment.author.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-surface-900 dark:text-surface-100">
                          {comment.author}
                        </span>
                      </div>
                      <span className="text-[11px] text-surface-400">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-surface-700 dark:text-surface-300 pl-7 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-surface-400 dark:text-surface-500">
                  No comments yet. Be the first to start the discussion!
                </div>
              )}
            </div>
          </div>
        </div>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task?"
        message={`Are you sure you want to permanently delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        isDestructive
      />
    </>
  );
};
