import { useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSidebar } from '@/shared/context/SidebarContext'
import BaseInput from '@/shared/components/BaseInput'
import BaseButton from '@/shared/components/BaseButton'
import BaseSelect from '@/shared/components/BaseSelect'
import UserSelect from '@/features/users/components/UserSelect'
import { postsApi } from '../api'
import { tagsApi } from '@/features/tags/api'

export default function PostForm({ post, defaultUserId }) {
  const queryClient = useQueryClient()
  const { closeSidebar } = useSidebar()

  const isEdit = !!post

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    userId: defaultUserId || '',
    tagIds: [],
    views: 0
  })

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        body: post.body || '',
        userId: post.user?.id || '',
        tagIds: [],
        views: post.views || 0
      })
    }
  }, [post])

  // Fetch tags for select
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagsApi.getTags()
  })

  const tagOptions = useMemo(() => {
    return (
      tagsData?.data?.map((t) => ({ label: t.name, value: t.id })) || []
    )
  }, [tagsData])

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      closeSidebar()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => postsApi.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      closeSidebar()
    }
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleChange(field) {
    return (e) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  function handleTagsChange(e) {
    const selected = Array.from(e.target.selectedOptions, (opt) =>
      Number(opt.value)
    )
    setFormData((prev) => ({ ...prev, tagIds: selected }))
  }

  function handleUserChange(userId) {
    setFormData((prev) => ({ ...prev, userId }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      title: formData.title,
      body: formData.body,
      userId: Number(formData.userId),
      tagIds: formData.tagIds.map(Number),
      views: Number(formData.views)
    }

    if (isEdit && post) {
      updateMutation.mutate({ id: post.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <BaseInput
        id="title"
        label="Title"
        placeholder="Enter post title"
        required
        value={formData.title}
        onChange={handleChange('title')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Body</label>
        <textarea
          value={formData.body}
          onChange={handleChange('body')}
          className="w-full min-h-[150px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors shadow-sm"
          placeholder="Post body content..."
          required
        />
      </div>

      {!defaultUserId && (
        <UserSelect
          id="userId"
          label="Author"
          value={formData.userId}
          onValueChange={handleUserChange}
          defaultSearch={post?.user?.fullName || post?.user?.username}
          required
        />
      )}

      <BaseSelect
        id="tagIds"
        label="Tags"
        options={tagOptions}
        multiple
        value={formData.tagIds}
        onChange={handleTagsChange}
      />

      <BaseInput
        id="views"
        type="number"
        label="Views (Optional)"
        placeholder="0"
        value={formData.views}
        onChange={handleChange('views')}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <BaseButton type="button" variant="outline" onClick={closeSidebar}>
          Cancel
        </BaseButton>
        <BaseButton type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </BaseButton>
      </div>
    </form>
  )
}
