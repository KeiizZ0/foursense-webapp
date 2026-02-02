'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Circle, Trash2, Plus, Loader } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { checkTodoWithAI } from '@/lib/api'

interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

export default function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodoTitle, setNewTodoTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isCheckingAI, setIsCheckingAI] = useState(false)

  useEffect(() => {
    const storedTodos = localStorage.getItem('studentTodos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    } else {
      // Set default todos if none exist
      const defaultTodos: Todo[] = [
        {
          id: '1',
          title: 'Kerjakan Matematika Halaman 10-15',
          description: 'Selesaikan soal integral di halaman 10-15',
          completed: false,
          dueDate: '2025-11-20',
          priority: 'high',
        },
        {
          id: '2',
          title: 'Baca Bab 5 Sejarah',
          description: 'Baca dan catat poin penting dari Bab 5',
          completed: true,
          dueDate: '2025-11-18',
          priority: 'medium',
        },
        {
          id: '3',
          title: 'Tugas Sains: Laporan Eksperimen',
          description: 'Buat laporan lengkap dengan gambar dan kesimpulan',
          completed: false,
          dueDate: '2025-11-22',
          priority: 'high',
        },
        {
          id: '4',
          title: 'Bahasa Inggris: Essay Writing',
          description: 'Tulis essay tentang "My Dreams"',
          completed: false,
          dueDate: '2025-11-21',
          priority: 'medium',
        },
      ]
      setTodos(defaultTodos)
      localStorage.setItem('studentTodos', JSON.stringify(defaultTodos))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('studentTodos', JSON.stringify(todos))
  }, [todos])

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const addTodo = async () => {
    if (!newTodoTitle.trim()) return

    setIsCheckingAI(true)
    try {
      // Check todo with AI
      const isValid = await checkTodoWithAI(newTodoTitle)

      if (isValid) {
        const newTodo: Todo = {
          id: Math.random().toString(36).substr(2, 9),
          title: newTodoTitle,
          description: '',
          completed: false,
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium',
        }
        setTodos([...todos, newTodo])
        setNewTodoTitle('')
        setShowForm(false)
      } else {
        console.warn('[v0] Todo tidak valid menurut AI check')
        // Optionally show error, tapi tidak popup
      }
    } catch (error) {
      console.error('[v0] Error adding todo:', error)
    } finally {
      setIsCheckingAI(false)
    }
  }

  const completedCount = todos.filter(t => t.completed).length
  const incompleteCount = todos.filter(t => !t.completed).length
  const incompleteTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <p className="text-slate-600">Kelola tugas Anda dan selesaikan sebelum absensi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tugas Tertunda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{incompleteCount}</div>
            <p className="text-xs text-slate-600">segera selesaikan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tugas Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-slate-600">dari {todos.length} total</p>
          </CardContent>
        </Card>
      </div>

      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Tugas Baru
        </Button>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan judul tugas..."
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isCheckingAI && addTodo()}
                disabled={isCheckingAI}
              />
              <Button 
                onClick={addTodo} 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isCheckingAI}
              >
                {isCheckingAI ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Validasi...
                  </>
                ) : (
                  'Tambah'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={isCheckingAI}
              >
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Tertunda ({incompleteCount})</TabsTrigger>
          <TabsTrigger value="completed">Selesai ({completedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {incompleteTodos.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                Semua tugas sudah selesai! Anda bisa melakukan absensi sekarang.
              </CardContent>
            </Card>
          ) : (
            incompleteTodos.map(todo => (
              <Card key={todo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      <Circle className="h-6 w-6 text-slate-400 hover:text-blue-600" />
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{todo.title}</h3>
                      {todo.description && (
                        <p className="text-sm text-slate-600 mt-1">{todo.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(todo.priority)}`}>
                          {todo.priority === 'high' ? 'Urgent' : todo.priority === 'medium' ? 'Normal' : 'Rendah'}
                        </span>
                        <span className="text-xs text-slate-600">
                          Deadline: {new Date(todo.dueDate).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedTodos.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-slate-600">
                Belum ada tugas yang selesai
              </CardContent>
            </Card>
          ) : (
            completedTodos.map(todo => (
              <Card key={todo.id} className="opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </button>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg line-through text-slate-500">{todo.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-green-600 font-medium">Selesai</span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex-shrink-0 p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
