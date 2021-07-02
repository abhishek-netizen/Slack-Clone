import React,{useRef,useEffect} from 'react'
import styled from "styled-components";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ChatInput from './ChatInput';
import { useSelector } from 'react-redux';
import { selectRoomId } from '../features/appSlice';
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { db } from '../firebase';
import Message from './Message';


function Chat() {
    const chatRef = useRef(null);

    //useSelector is the firebase hooks
    const roomId = useSelector(selectRoomId);
  
    const [roomDetails] = useDocument(
        roomId && db.collection('rooms').doc(roomId)
    )

    const [roomMessages,loading] = useCollection(
        roomId && db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp','asc')
    )


    //for that slick trick : its not working
    useEffect(() => {
        chatRef?.current?.scrollIntoView({
            behavior: 'smooth'
        });
    },[roomId,loading])

 
   
    return (
        <ChatContainer>
            {roomDetails && roomMessages && (
                <>
            <Header>
                {/* header-left */}

                <HeaderLeft>
                    <h4><strong>#{roomDetails?.data().name}</strong></h4>
                    <StarBorderIcon />
                </HeaderLeft>

                {/* header-right */}
                <HeaderRight>
                    <p>
                       <InfoOutlinedIcon />
                    </p>

                </HeaderRight>
                </Header>

                <ChatMessages>
                    {roomMessages?.docs.map((doc) => {
                        const { message, timestamp, user, userImage} = doc.data();
                        return (
                            <Message
                                key={doc.id}
                                message={message}
                                timestamp={timestamp}
                                user={user}
                                userImage={userImage}
                            />
                        );
                    })}
                   {/* below: one hell of a slick trick yoo .. */}
                    <ChatBottom
                        ref={chatRef}
                    />
                    {/* above: one hell of a slick trick yoo .. */}
                </ChatMessages>
                <ChatInput
                    chatRef 
                    channelName={roomDetails?.data().name}
                    channelId = {roomId}
                />
            </>
            )}
          
        </ChatContainer>
    )
}

export default Chat;

const Header = styled.div`
display: flex;
justify-content: space-between;
padding: 20px;
border-bottom: 1px solid lightgray;
`;

const ChatMessages = styled.div`

`;


const HeaderLeft = styled.div`
 display: flex;
 align-items: center;
>h4{
    text-transform: lowercase;
    display: flex;
    margin-right: 10px;
}

>h4 > .MuiSvgIcon-root{
margin-left: 20px;
font-size: 18px;
}
`;

const HeaderRight = styled.div`
> p {
    display: flex;
    align-items: center;
    font-size: 14px;
}

> p > .MuiSvgIcon-root{
    margin-right: 5px !important;
    font-size: 16px;
}
`;

const ChatContainer = styled.div`
flex: 0.7;
flex-grow: 1;
overflow: scroll;
margin-top: 60px;
`;

const ChatBottom = styled.div`

`;
