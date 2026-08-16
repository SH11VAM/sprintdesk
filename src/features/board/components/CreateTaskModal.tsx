import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TaskStatus, TaskPriority } from '../types';
import { useBoardStore } from '../store/boardStore';
import { TEAM_MEMBERS } from '../utils/taskAdapter';
import { COLUMNS } from '../selectors/boardSelectors';
import { useToast } from '@/hooks/useToast';
import { Plus } from 'lucide-react';

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: TaskStatus;
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

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultStatus = 'backlog',
}) => {
  const { addTask } = useBoardStore();
  const { success } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignee, setAssignee] = useState(TEAM_MEMBERS[0].name);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [tagsInput, setTagsInput] = useState('Frontend, Feature');
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync default status when prop changes
  React.useEffect(() => {
    if (defaultStatus) {
      setStatus(defaultStatus);
    }
  }, [defaultStatus, isOpen]);

  const validate = () => {
    const errs: { title?: string } = {};
    if (!title.trim()) {
      errs.title = 'Task title is required';
    } else if (title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const selectedMember = TEAM_MEMBERS.find((m) => m.name === assignee);
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assignee,
        assigneeAvatar: selectedMember?.avatar,
        dueDate,
        tags,
      });

      success('Task Created', `Added #${created.id} "${created.title}" to ${status}`);

      // Reset form
      setTitle('');
      setDescription('');
      setTagsInput('Frontend');
      setErrors({});
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Sprint Task"
      description="Add a task to the current sprint backlog or active column."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Task Title"
          id="create-task-title"
          placeholder="e.g. Implement OAuth2 token refresh interceptor"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({});
          }}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Column / Status"
            id="create-task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={statusOptions}
          />

          <Select
            label="Priority Level"
            id="create-task-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={priorityOptions}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="create-task-assignee"
              className="block text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider mb-1.5"
            >
              Assignee
            </label>
            <select
              id="create-task-assignee"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 text-sm py-2 px-3 focus-ring cursor-pointer text-surface-900 dark:text-surface-100"
            >
              {TEAM_MEMBERS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date"
            id="create-task-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <Input
          label="Tags (comma separated)"
          id="create-task-tags"
          placeholder="e.g. Frontend, Auth, Security"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          helperText="Separate tags with commas"
        />

        <div className="space-y-1.5">
          <label
            htmlFor="create-task-desc"
            className="block text-xs font-semibold text-surface-700 dark:text-surface-300 uppercase tracking-wider"
          >
            Description & Acceptance Criteria
          </label>
          <textarea
            id="create-task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of what needs to be done..."
            className="w-full rounded-xl border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 p-3 text-sm text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
          <Button variant="outline" size="md" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" aria-hidden="true" />}
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
