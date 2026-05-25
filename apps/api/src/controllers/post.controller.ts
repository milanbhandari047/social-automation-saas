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
    const result = await createPostService(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
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
      req.user.id,
      req.params.workspaceId
    );

    return res.json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET SINGLE POST
 */
export const getPostById = async (req: any, res: any) => {
  try {
    const post = await getPostByIdService(req.user.id, req.params.id);

    return res.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE POST
 */
export const deletePost = async (req: any, res: any) => {
  try {
    await deletePostService(req.user.id, req.params.id);

    return res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
