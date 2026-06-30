import { createBrowserRouter, Navigate } from 'react-router'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { WorkspacePage } from '../pages/Workspace/WorkspacePage'
import { DataCenterPage } from '../pages/DataCenter/DataCenterPage'
import { TasksPage } from '../pages/Tasks/TasksPage'
import { SettingsPage } from '../pages/Settings/SettingsPage'
import { AgentStudioPage } from '../pages/AgentStudio/AgentStudioPage'

export const router = createBrowserRouter([
  { path: '/', element: <DashboardPage /> },
  { path: '/workspace', element: <WorkspacePage /> },
  { path: '/data-center', element: <DataCenterPage /> },
  { path: '/tasks', element: <TasksPage /> },
  { path: '/settings', element: <SettingsPage /> },
  { path: '/agent-studio', element: <AgentStudioPage /> },
  { path: '*', element: <Navigate to="/" replace /> },
])
