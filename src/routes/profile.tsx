import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;

const AvatarImg = styled.img`
    width: 100%;
`;

const AvatarInput = styled.input`
    display: none;
`;

const Name = styled.span`
    font-size: 22px;
`;

const Tweets = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const NameInput = styled.input`
    background-color: black;
    border: 2px solid white;
    border-radius: 20px;
    color: white;
    text-align: center;
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ChangeName = styled.div`
    svg {
        width: 30px;
    }`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(user?.displayName ?? "Anonymous");
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length) {
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, {
                photoURL: avatarUrl,
            });
        }
    };
    const fetchTweets = async () => {
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        const snapshot = await getDocs(tweetQuery);
        const tweets = snapshot.docs.map((doc) => {
            const { tweet, createdAt, userId, username, photo } = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id,
            };
        });
        setTweets(tweets);
    };
    useEffect(() => {
        fetchTweets();
    }, []);
    const onChangeName = async () => {
        if (!user) return;
        setEditMode((prev) => !prev);
        if (!editMode) return;
        try {
            await updateProfile(user, {
                displayName: name,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setEditMode(false);
        }
    };
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setName(event.target.value);
    return <Wrapper>
        <AvatarUpload htmlFor="avatar">
            {avatar ? <AvatarImg src={avatar} /> : <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>}
        </AvatarUpload>
        <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
        {editMode ? (
            <NameInput onChange={onNameChange} type="text" value={name} />
        ) : (
            <Name>{name ?? "Anonymous"}</Name>
        )}
        <ChangeName onClick={onChangeName}>
            {editMode ? <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg> : <svg fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>}
        </ChangeName>
        <Tweets>
            {tweets.map(tweet => <Tweet key={tweet.id} {...tweet} />)}
        </Tweets>
    </Wrapper>;
}