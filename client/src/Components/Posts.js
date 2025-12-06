import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getPosts, likePost } from "../Features/PostSlice"

import moment from 'moment'
import { useNavigate } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa6";

const Posts = () => {
  const { posts } = useSelector((state) => state.posts);
  const { user, isLogin } = useSelector(state => state.users)
  const dispatch = useDispatch()

  useEffect(() => {
      if (isLogin) {
        dispatch(getPosts());
    }
   }, []);

 async function handlePost(postId) {
    const userId = user._id;
    const postData = { userId, postId };
    await dispatch(likePost(postData));
    dispatch(getPosts());
  }
  return (
    <div className="postsContainer">
      <table className="table table-striped">
        <thead></thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id}>
              {/* Ensure to add a unique key for each row */}
              <td>{post.email}</td>
              <td>
                <p>{moment(post.createdAt).fromNow()}</p>
                {post.postMsg}
                <p className="likes">
                  <a href="#" onClick={()=> handlePost(post._id)}>           
                    <FaThumbsUp />
                  </a>
                  ({post.likes.count})
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div> /* End of posts */
  );
};

export default Posts;
