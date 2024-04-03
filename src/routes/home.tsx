import styled from "styled-components";
import PostTweetFrom from "../components/post-tweet-form";

const Wrapper = styled.div``;

export default function Home() {
    return (
        <Wrapper>
          <PostTweetFrom />
        </Wrapper>
    );
}