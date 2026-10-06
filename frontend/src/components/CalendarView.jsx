import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const CalendarView = () => {
  const { tasks, openCreateModal, categories } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const daysArray = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(day);
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="glass-panel p-6 rounded-3xl space-y-6">
      {/* Header Month Nav */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <CalendarIcon size={20} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={prevMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((day, idx) => {
          if (!day) {
            return <div key={idx} className="h-28 bg-slate-900/20 rounded-2xl border border-slate-800/40"></div>;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayTasks = tasks.filter(t => t.dueDate === dateStr);
          const isToday = dateStr === todayStr;

          return (
            <div
              key={idx}
              className={`h-28 p-2 rounded-2xl border flex flex-col justify-between transition-all hover:border-indigo-500/40 ${
                isToday
                  ? 'bg-indigo-950/30 border-indigo-500/50 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                  isToday ? 'bg-indigo-600 text-white' : 'text-slate-300'
                }`}>
                  {day}
                </span>
                <button
                  onClick={openCreateModal}
                  className="opacity-0 hover:opacity-100 p-1 text-slate-400 hover:text-indigo-400 transition-opacity"
                  title="Add task on this date"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* Task badges */}
              <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5">
                {dayTasks.map(t => {
                  const cat = categories.find(c => c.id === t.categoryId);
                  return (
                    <div
                      key={t.id}
                      className="px-2 py-1 rounded-md text-[10px] font-semibold truncate border flex items-center gap-1"
                      style={{
                        backgroundColor: cat ? `${cat.color}20` : '#6366f120',
                        borderColor: cat ? `${cat.color}40` : '#6366f140',
                        color: t.status === 'Completed' ? '#94a3b8' : (cat?.color || '#818cf8')
                      }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Completed' ? 'bg-slate-500 line-through' : ''}`} style={{ backgroundColor: cat?.color }}></span>
                      <span className={t.status === 'Completed' ? 'line-through text-slate-500' : ''}>{t.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
