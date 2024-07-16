import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { deletePost } from '../api/posts.js'

export function DeletePost() {
  const [postId, setId] = useState('')

  // useQueryClient to invalidate all queries starting with 'posts' queryKey
  // works with any query params to the getPosts request
  const queryClient = useQueryClient()
  // define a mutation hook to create a post
  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(postId),
    // TODO: check delete api, invalidate queries not reloading all posts
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.fetchQuery({ queryKey: ['posts'] })
    },
  })

  const handelSubmit = (e) => {
    // prevent default form submission (prevent page refresh)
    e.preventDefault()
    deletePostMutation.mutate()
  }

  return (
    <form onSubmit={handelSubmit}>
      <div>
        <label htmlFor='delete-post'>Delete Post: </label>
        <input
          type='text'
          name='delete-post'
          id='delete-post'
          value={postId}
          onChange={(e) => setId(e.target.value)}
        />
      </div>
      <br />
      <input
        type='submit'
        value={deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
        disabled={!postId || deletePostMutation.isPending}
      />
      {deletePostMutation.isSuccess ? (
        <>
          <br />
          Post deleted successfully!
          <br />
        </>
      ) : null}
    </form>
  )
}
