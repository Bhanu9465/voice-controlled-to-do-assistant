import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = () => {
  const { tasks, searchTerm, filter } = useAppContext();
  const today = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(task => {
        if (filter === 'today') {
            return task.dueDate === today;
        }
        return true;
    });

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  if (filteredTasks.length === 0) {
      return (
         <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg border-border">
            <h3 className="text-lg font-semibold">No tasks found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter.</p>
        </div>
      )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Pending Tasks ({pendingTasks.length})</h2>
        {pendingTasks.length > 0 ? (
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg border-border">
            <p className="text-muted-foreground">No pending tasks. Great job!</p>
          </div>
        )}
      </div>
       <div>
        <h2 className="text-xl font-semibold mb-4">Completed Tasks ({completedTasks.length})</h2>
        {completedTasks.length > 0 ? (
          <div className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 border-2 border-dashed rounded-lg border-border">
            <p className="text-muted-foreground">No tasks completed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
