import { createSlice } from "@reduxjs/toolkit";
import api from "../api/client";
import { thunk } from "./thunk";

const emptyList = () => ({ ids: [], hasMore: true, loading: false, loaded: false, error: null });

const lastDate = (state, ids) => {
  const last = state.entities[ids[ids.length - 1]];
  return last ? last.date : undefined;
};

export const fetchFeed = thunk("posts/feed", async ({ more = false } = {}, { getState }) => {
  const { posts } = getState();
  const before = more ? lastDate(posts, posts.feed.ids) : undefined;
  return (await api.get("/posts/feed", { params: { before } })).data;
});

export const fetchUserPosts = thunk("posts/user", async ({ profileId, more = false }, { getState }) => {
  const { posts } = getState();
  const before = more ? lastDate(posts, posts.byUser[profileId]?.ids || []) : undefined;
  return (await api.get(`/posts/user/${profileId}`, { params: { before } })).data;
});

export const fetchPost = thunk("posts/one", async (id) => (await api.get(`/posts/${id}`)).data);

export const createPost = thunk("posts/create", async (body) => (await api.post("/posts", body)).data);

export const deletePost = thunk("posts/delete", async (id) => (await api.delete(`/posts/${id}`)).data);

export const toggleLike = thunk("posts/like", async (id) => (await api.post(`/posts/${id}/like`)).data);

export const addComment = thunk(
  "posts/comment",
  async ({ postId, text }) => (await api.post(`/posts/${postId}/comments`, { text })).data
);

export const deleteComment = thunk(
  "posts/deleteComment",
  async ({ postId, commentId }) => (await api.delete(`/posts/${postId}/comments/${commentId}`)).data
);

const store = (state, post) => {
  state.entities[post._id] = post;
};

const prepend = (list, id) => {
  if (list && !list.ids.includes(id)) list.ids.unshift(id);
};

const flipLike = (post) => {
  if (!post) return;
  post.liked = !post.liked;
  post.likeCount += post.liked ? 1 : -1;
};

const postsSlice = createSlice({
  name: "posts",
  initialState: { entities: {}, feed: emptyList(), byUser: {} },
  reducers: {
    // A friend published something (socket "post:new").
    postReceived(state, { payload }) {
      store(state, payload);
      if (state.feed.loaded) prepend(state.feed, payload._id);
      prepend(state.byUser[payload.author._id], payload._id);
    },
    postsReset(state) {
      state.entities = {};
      state.feed = emptyList();
      state.byUser = {};
    },
  },
  extraReducers: (builder) => {
    const pending = (list) => {
      list.loading = true;
      list.error = null;
    };
    const fulfilled = (state, list, { posts, hasMore }, more) => {
      posts.forEach((p) => store(state, p));
      const ids = posts.map((p) => p._id);
      list.ids = more ? [...list.ids, ...ids.filter((id) => !list.ids.includes(id))] : ids;
      list.hasMore = hasMore;
      list.loading = false;
      list.loaded = true;
    };
    const userList = (state, profileId) => {
      if (!state.byUser[profileId]) state.byUser[profileId] = emptyList();
      return state.byUser[profileId];
    };

    builder
      .addCase(fetchFeed.pending, (state) => pending(state.feed))
      .addCase(fetchFeed.fulfilled, (state, { payload, meta }) =>
        fulfilled(state, state.feed, payload, meta.arg?.more)
      )
      .addCase(fetchFeed.rejected, (state, { payload }) => {
        state.feed.loading = false;
        state.feed.error = payload;
      })
      .addCase(fetchUserPosts.pending, (state, { meta }) => pending(userList(state, meta.arg.profileId)))
      .addCase(fetchUserPosts.fulfilled, (state, { payload, meta }) =>
        fulfilled(state, userList(state, meta.arg.profileId), payload, meta.arg.more)
      )
      .addCase(fetchUserPosts.rejected, (state, { payload, meta }) => {
        const list = userList(state, meta.arg.profileId);
        list.loading = false;
        list.error = payload;
      })
      .addCase(fetchPost.fulfilled, (state, { payload }) => store(state, payload))
      .addCase(createPost.fulfilled, (state, { payload }) => {
        store(state, payload);
        prepend(state.feed, payload._id);
        prepend(state.byUser[payload.author._id], payload._id);
      })
      .addCase(deletePost.fulfilled, (state, { meta }) => {
        const id = meta.arg;
        delete state.entities[id];
        state.feed.ids = state.feed.ids.filter((x) => x !== id);
        Object.values(state.byUser).forEach((list) => {
          list.ids = list.ids.filter((x) => x !== id);
        });
      })
      // Likes are optimistic and roll back on failure.
      .addCase(toggleLike.pending, (state, { meta }) => flipLike(state.entities[meta.arg]))
      .addCase(toggleLike.rejected, (state, { meta }) => flipLike(state.entities[meta.arg]))
      .addCase(toggleLike.fulfilled, (state, { payload }) => store(state, payload))
      .addCase(addComment.fulfilled, (state, { payload }) => store(state, payload))
      .addCase(deleteComment.fulfilled, (state, { payload }) => store(state, payload));
  },
});

export const { postReceived, postsReset } = postsSlice.actions;
export default postsSlice.reducer;
