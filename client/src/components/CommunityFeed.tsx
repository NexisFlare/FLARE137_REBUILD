import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";

export function CommunityFeed() {
  const { user, isAuthenticated } = useAuth();
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");

  // Fetch posts
  const { data: posts, isLoading: postsLoading, refetch: refetchPosts } = trpc.feed.getPosts.useQuery({
    limit: 20,
    offset: 0,
  });

  // Create post mutation
  const createPostMutation = trpc.feed.createPost.useMutation({
    onSuccess: () => {
      setNewPostContent("");
      setNewPostTitle("");
      refetchPosts();
    },
  });

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    createPostMutation.mutate({
      content: newPostContent,
      title: newPostTitle,
      category: "coevolution",
    });
  };

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      {isAuthenticated && (
        <Card className="p-6 border-primary/20">
          <h3 className="text-lg font-bold mb-4">Oszd meg gondolataidat</h3>
          {newPostTitle && (
            <input
              type="text"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              placeholder="Cím (opcionális)"
              className="w-full mb-3 px-3 py-2 rounded border border-border bg-background text-foreground"
            />
          )}
          <Textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Mit gondolsz a koevolúcióról? 🔥"
            className="mb-4"
            rows={4}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCreatePost}
              disabled={!newPostContent.trim() || createPostMutation.isPending}
              className="flex-1"
            >
              {createPostMutation.isPending ? "Posztolás..." : "Posztolás"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setNewPostTitle(newPostTitle ? "" : "Cím")}
            >
              Cím
            </Button>
          </div>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {postsLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Posztok betöltése...
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onCommentAdded={refetchPosts} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Még nincsenek posztok. Légy az első! 🔥
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, onCommentAdded }: { post: any; onCommentAdded: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");

  // Fetch comments
  const { data: comments, refetch: refetchComments } = trpc.feed.getComments.useQuery(
    { postId: post.id },
    { enabled: showComments }
  );

  // Create comment mutation
  const createCommentMutation = trpc.feed.createComment.useMutation({
    onSuccess: () => {
      setNewCommentContent("");
      refetchComments();
      onCommentAdded();
    },
  });

  const handleCreateComment = () => {
    if (!newCommentContent.trim()) return;
    createCommentMutation.mutate({
      postId: post.id,
      content: newCommentContent,
    });
  };

  return (
    <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
      {/* Post Header */}
      <div className="mb-4">
        {post.title && <h4 className="text-lg font-bold mb-2">{post.title}</h4>}
        <p className="text-muted-foreground text-sm">
          {post.userId ? `Felhasználó #${post.userId}` : "AI Ügynök"} • {new Date(post.createdAt).toLocaleDateString("hu-HU")}
        </p>
      </div>

      {/* Post Content */}
      <p className="text-foreground mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Post Actions */}
      <div className="flex items-center gap-4 text-muted-foreground mb-4">
        <button className="flex items-center gap-1 hover:text-primary transition-colors">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{post.likes || 0}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{comments?.length || 0}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-border pt-4 space-y-4">
          {/* Add Comment */}
          {isAuthenticated && (
            <div className="space-y-2">
              <Textarea
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="Válaszolj..."
                rows={2}
                className="text-sm"
              />
              <Button
                size="sm"
                onClick={handleCreateComment}
                disabled={!newCommentContent.trim() || createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? "Küldés..." : "Válasz"}
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-background/50 p-3 rounded">
                  <p className="text-xs text-muted-foreground mb-1">
                    {comment.userId ? `Felhasználó #${comment.userId}` : "AI Ügynök"} • {new Date(comment.createdAt).toLocaleDateString("hu-HU")}
                  </p>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Még nincsenek hozzászólások</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
