import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const likePost = createAsyncThunk("posts/likePost", async (postData) => {
  try { 
    const { postId, userId } = postData
    console.log(postData)
    const response = await axios.put(
      `${process.env.REACT_APP_SERVER_URL}/likePost`,
      { userId, postId }
    );
    const post = response.data.post
    return post
  }
  catch (error) {
    console.log(error)
  }
})

export const savePost = createAsyncThunk(
  "posts/saveUser",
  async (postData) => {
    try {
      const { postMsg, email } = postData;
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/savePost`, {
    postMsg,email,
      });
      const post = response.data.post;
      const msg = response.data.msg;
      return { post, msg };
    } catch (error) {
      const msg = error.response.data.msg;
      console.log(error);
      return ({ msg });
    }
  }
);
export const getPosts = createAsyncThunk("post/getPosts", async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getPosts`);
      const posts = response.data.posts;
      return {posts}

  } catch (error) {
    console.log(error);
  }
});


export const postSlice = createSlice({
  name: "posts", //name of the state
  initialState: {
    status: "idle",
    posts: [],
    comments: [],
    likes: [],
  }, // initial value of the state
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(savePost.pending, (state) => {
        state.status = "pending";
      })
      .addCase(savePost.fulfilled, (state, action) => {
        state.status = "success";
        state.posts.unshift(action.payload.post);
      })
      .addCase(savePost.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(getPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload.posts;
      })
      .addCase(likePost.pending, (state) => {
        state.status = "pending";
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.status = "success";
        const updatedPtIndex = state.posts.indexOf(action.payload._id)
        if (updatedPtIndex !== -1)
        {
          state.posts[updatedPtIndex].likes = action.payload.likes
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = "rejected";
      });

     
  },
});

export default postSlice.reducer;
