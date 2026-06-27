import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSidebar } from '@/shared/context/SidebarContext'
import { commentsApi } from '../api'
import BaseInput from '@/shared/components/BaseInput'
import BaseButton from '@/shared/components/BaseButton'
import UserSelect from '@/features/users/components/UserSelect'

export default function CommentForm({ comment, defaultPostId }) {
  const isEditMode = Boolean(comment)
  const queryClient = useQueryClient()
  const { closeSidebar } = useSidebar()

  const [formData, setFormData] = useState({
    postId: comment?.postId ?? defaultPostId ?? '',
    userId: comment?.userId ?? '',
    commenterName: comment?.commenterName ?? '',
    body: comment?.body ?? '',
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const createMutation = useMutation({
    mutationFn: (data) => {
      const { postId, ...req } = data
      return commentsApi.createPostComment(postId, req)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      closeSidebar()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data) => commentsApi.updateComment(comment.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      closeSidebar()
    },
  })

  const isPending = createMutation.isPending || updateMutation.isPending

  function handleSubmit(e) {
    e.preventDefault()
    if (isEditMode) {
      updateMutation.mutate({
        commenterName: formData.commenterName,
        body: formData.body,
      })
    } else {
      createMutation.mutate({
        postId: Number(formData.postId),
        userId: Number(formData.userId),
        commenterName: formData.commenterName,
        body: formData.body,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isEditMode && (
        <div className="space-y-6">
          {!defaultPostId && (
            <BaseInput
              id="postId"
              name="postId"
              label="Post ID"
              type="number"
              value={formData.postId}
              onChange={handleChange}
              placeholder="Enter post ID"
              required
            />
          )}
          <UserSelect
            id="userId"
            label="User (Author)"
            value={formData.userId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, userId: value }))
            }
            defaultSearch={comment?.commenterName}
            required
          />
        </div>
      )}

      <BaseInput
        id="commenterName"
        name="commenterName"
        label="Commenter Name"
        value={formData.commenterName}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm font-medium text-slate-700">
          Comment Body
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Write a comment..."
          required
          className="w-full min-h-[100px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors shadow-sm"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <BaseButton type="button" variant="outline" onClick={closeSidebar}>
          Cancel
        </BaseButton>
        <BaseButton type="submit" disabled={isPending}>
          {isPending
            ? 'Saving...'
            : isEditMode
              ? 'Update Comment'
              : 'Create Comment'}
        </BaseButton>
      </div>
    </form>
  )
}
