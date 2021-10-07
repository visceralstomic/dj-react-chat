import UserImage from "./userImage";


const formatDate = date => {
    return new Intl.DateTimeFormat(
                'en-US',
                {
                  dateStyle: 'short',
                  timeStyle: 'short'
                }).format(new Date(date))
  }

const ChatMessage = props => {
    const {author, text, user, date} = props;
    return (
        <div className={`chat-message ${author.id === user.uid ? 'sender' : ''}`}>
            
            <UserImage 
                photo={author.photo && process.env.NODE_ENV === 'development' ? "http://localhost:8000" + author.photo : author.photo} 
            />
            <div className="message-text">
                <div className="info-username">{author.username}</div>
                {text}
                <div className="info-date">
                    {formatDate(date)}
                </div>
            </div>
            
        </div>
    )
}

export default ChatMessage;