import {
  Button,
  Col,
  Container,
  Row,
  Input,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { savePost } from "../Features/PostSlice";
import { useNavigate } from "react-router-dom";

const SharePosts = () => {
  const [postMsg, setpostMsg] = useState("");

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.users); 
  const navigate = useNavigate()
  const handlePost = async () => {
    // Validate that postMsg is not empty
   
    
    if (!postMsg.trim()) {
      alert("Post message is required."); // Display an alert or set an error state
      return; // Exit the function early if validation fails
    }

    const postData = {postMsg, email: user.email,};
    dispatch(savePost(postData)); // Dispatch the savePost thunk from the Posts Slice.
    setpostMsg("");
    navigate("/")
  };


  return (
    <Container>
      <Row>
        <Col>
          <Input
            id="share"
            name="share"
            placeholder="Share your thoughts..."
            type="textarea"
            value={postMsg}
            onChange={(e) => setpostMsg(e.target.value)}
          />
          <Button onClick={handlePost}>PostIT</Button>
        </Col>
      </Row>
     </Container>
  );
};

export default SharePosts;
