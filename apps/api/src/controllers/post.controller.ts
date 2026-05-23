import {
  createPostService,
  getWorkspacePostsService,
  getPostByIdService,
  deletePostService,
} from "../services/post.service";

/**
 * CREATE POST
 */
export const createPost = async (req: any, res: any) => {
  try {
    const result = await createPostService(req.user.userId, req.body);

    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

/**
 * GET WORKSPACE POSTS
 */
export const getWorkspacePosts = async (req: any, res: any) => {
  try {
    const posts = await getWorkspacePostsService(
      req.user.userId,
      req.params.workspaceId
    );

    return res.json(posts);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch posts",
    });
  }
};

/**
 * GET SINGLE POST
 */
export const getPostById = async (req: any, res: any) => {
  try {
    const post = await getPostByIdService(req.user.userId, req.params.id);

    return res.json(post);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to fetch post",
    });
  }
};

/**
 * DELETE POST
 */
export const deletePost = async (req: any, res: any) => {
  try {
    await deletePostService(req.user.userId, req.params.id);

    return res.json({
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Failed to delete post",
    });
  }
};
