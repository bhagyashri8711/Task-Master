import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, CheckCircle2, Flame, Award } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

export const PomodoroTimer = () => {
  const { tasks, updateTask } = useTasks();

  const MODE_TIMES = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  const [mode, setMode] = useState('work'); // 'work' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(MODE_TIMES.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'work') {
        setCompletedSessions(prev => prev + 1);
        // If a task is selected, log +0.4 hours (approx 25 mins) to actual hours
        if (selectedTaskId) {
          const targetTask = tasks.find(t => t.id === selectedTaskId);
          if (targetTask) {
            updateTask(selectedTaskId, {
              actualHours: Math.round(((targetTask.actualHours || 0) + 0.42) * 10) / 10
            });
          }
        }
        setMode('shortBreak');
        setTimeLeft(MODE_TIMES.shortBreak);
      } else {
        setMode('work');
        setTimeLeft(MODE_TIMES.work);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, selectedTaskId, tasks, updateTask]);

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPct = ((MODE_TIMES[mode] - timeLeft) / MODE_TIMES[mode]) * 100;

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 text-indigo-400">
          <TimerIcon className="w-6 h-6 animate-pulse" />
          <h2 className="text-xl font-extrabold text-white">Focus Pomodoro Timer</h2>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 max-w-xs mx-auto">
          {[
            { id: 'work', label: 'Work (25m)' },
            { id: 'shortBreak', label: 'Short Break' },
            { id: 'longBreak', label: 'Long Break' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => switchMode(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Big Circular Display */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-indigo-500 transition-all duration-1000 ease-linear"
              strokeWidth="10"
              strokeDasharray="691"
              strokeDashoffset={691 - (691 * progressPct) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tighter text-white font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-indigo-400 capitalize mt-2">
              {mode === 'work' ? '🔥 Focus Time' : '☕ Break Time'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="gradient-btn px-8 py-3.5 rounded-2xl text-base font-extrabold flex items-center gap-2 shadow-xl shadow-indigo-600/40"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>
        </div>

        {/* Task Selection */}
        <div className="pt-4 border-t border-slate-800 text-left">
          <label className="block text-xs font-semibold text-slate-400 mb-2">
            Attach to Active Task (Auto-tracks time):
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">None (Standalone session)</option>
            {tasks.filter(t => t.status !== 'Completed').map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.priority})
              </option>
            ))}
          </select>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-amber-400">
          <Flame className="w-4 h-4" />
          <span>{completedSessions} Pomodoro Sessions Completed Today</span>
        </div>
      </div>
    </div>
  );
};
