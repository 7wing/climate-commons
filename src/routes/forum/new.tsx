import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { useForumCategories, useCreateForumTopic } from '@/hooks/useForum'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/forum/new')({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw redirect({ to: '/auth/login', search: { returnUrl: '/forum/new' } })
    }
  },
  component: NewTopicPage,
})

function NewTopicPage() {
  const navigate = useNavigate()
  const { data: categories } = useForumCategories()
  const create = useCreateForumTopic()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await create.mutateAsync({
      title,
      body,
      category_id: categoryId || null,
    })
    navigate({ to: '/forum' })
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-foreground">{COPY.forum.newTopic}</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.forum.topicTitleLabel}</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.forum.bodyLabel}</label>
          <textarea
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.forum.categoryLabel}</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        {create.isError && <p className="text-destructive">{COPY.common.error}</p>}
        <button
          type="submit"
          disabled={create.isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {create.isPending ? COPY.common.loading : COPY.actions.submitButton}
        </button>
      </form>
    </main>
  )
}
