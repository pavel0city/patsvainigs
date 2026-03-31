import type { Comment } from "@/app/lib/posts";
import { getSession } from "@/app/lib/auth";
import { addComment, deleteComment } from "@/app/actions/comments";

export default async function CommentSection({
  postId,
  comments,
}: {
  postId: number;
  comments: Comment[];
}) {
  const session = await getSession();

  return (
    <section className="comments">
      <h2 className="comments-title">
        dirstuve/dročiļņa ({comments.length})
      </h2>

      {session ? (
        <form action={addComment as unknown as (formData: FormData) => void} className="comment-form">
          <input type="hidden" name="postId" value={postId} />
          <textarea
            name="content"
            placeholder="vieta tavam sub-100 iq"
            rows={3}
            required
          />
          <button type="submit">iedirst/circlejerk</button>
        </form>
      ) : (
        <p className="login-prompt">
          <a href="/login">pievienojies krīzē</a> lai iedirst savu nenozīmīgo viedokli
        </p>
      )}

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <div className="comment-header">
              <span className="comment-author">
                {comment.nickname}
                {comment.tag && (
                  <span className="comment-tag"> #{comment.tag}</span>
                )}
              </span>
              <span className="comment-date">
                {new Date(comment.created_at + "Z").toLocaleDateString()}
              </span>
              {session &&
                (session.id === comment.user_id ||
                  session.role === "admin") && (
                  <form action={deleteComment as unknown as (formData: FormData) => void} className="inline-form">
                    <input type="hidden" name="commentId" value={comment.id} />
                    <button type="submit" className="delete-btn">
                      x
                    </button>
                  </form>
                )}
            </div>
            <p className="comment-body">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
