import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
    gap: 10px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const EditButton = styled.button`
    background-color: green;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    margin: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const EditInput = styled.input`
    margin: 10px 0px;
    background-color: black;
    color: white;
    width: 80%;
    height: 100px;
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 5px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const SaveButton = styled.button`
    background-color: green;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;
const CancelButton = styled.button`
    background-color: gray;
    color: white;
    font-weight: 600;
    border: 0;
    font-size: 12px;
    padding: 5px 10px;
    margin: 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [editedTweet, setEditedTweet] = useState(tweet);
    const [isEditing, setIsEditing] = useState(false);
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("정말 삭제하시겠습니까????")
        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        }
    }
    const onEdit = async () => {
        if (user?.uid !== userId) return;
        try {
            await updateDoc(doc(db, "tweets", id), { tweet: editedTweet });
            setIsEditing(false);
        } catch (e) {
            console.log(e);
        }
    };
    const onCancelEdit = () => {
        setIsEditing(false);
        setEditedTweet(tweet); // 수정 이전의 트윗 내용으로 복구
    };

    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {/* <Payload>{tweet}</Payload>
                {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}
                {user?.uid === userId ? <EditButton onClick={onEdit}>Edit</EditButton> : null} */}
                {isEditing ? (
                    <>
                        <EditInput
                            type="text"
                            value={editedTweet}
                            onChange={(e) => setEditedTweet(e.target.value)}
                        />
                        <SaveButton onClick={onEdit}>Save</SaveButton>
                        <CancelButton onClick={onCancelEdit}>Cancel</CancelButton>
                    </>
                ) : (
                    <>
                        <Payload>{tweet}</Payload>
                        {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null}
                        {user?.uid === userId ? <EditButton onClick={() => setIsEditing(true)}>Edit</EditButton> : null}
                    </>
                )}
            </Column>
            <Column>
                {photo ?
                    <Photo src={photo} />
                    : null}
            </Column>
        </Wrapper>
    )
}