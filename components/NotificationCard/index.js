import { store } from "@/app/redux/store";

function FriendRequestNotification({ notification, markAsRead, approve_friend, deleteNotification,index }) {
    return (
        <>
            {notification.is_read === false && (
                <>
                    <span>未读</span>
                    <button 
                        name="markAsRead"
                        className="btn btn-secondary"
                        onClick={() => {markAsRead(notification.notification_id);
                            set_flash(!flash);}}
                    >
                        标记为已读
                    </button>
                </>
            )}
            {notification.is_read === true && (
                <span>已读</span>
            )}
        </>
    );
}

function ApproveFriendNotification({ notification, markAsRead, deleteNotification,index}) {
    return (
        <div key={notification.notification_id}>
            {notification.is_read === false && (
                <>
                    <span>未读</span>
                    <button 
                        name="markAsRead"
                        className="btn btn-secondary"
                        onClick={() => {markAsRead(notification.notification_id);
                        set_flash(!flash);}}
                    >
                        标记为已读
                    </button>
                </>
            )}
            {notification.is_read === true && (
                <span>已读</span>
            )}
        </div>
    );
}

function InvitechatNotification({notification,markAsRead,approve_chat,deleteNotification,index}){
    const [chatname,setchatname] = useState([]);
    useEffect(() => {

    }, []);
    return (
        <div key={notification.notification_id}>
            {notification.is_read === false && (
                <>
                    <span>未读</span>
                    <button 
                        name="markAsRead"
                        className="btn btn-secondary"
                        onClick={() => {markAsRead(notification.notification_id);
                        set_flash(!flash);}}
                    >
                        标记为已读
                    </button>
                </>
            )}
            {notification.is_read === true && (
                <span>已读</span>
            )}
            <button
                name="approve_chat"
                className="btn btn-success"
                onClick={() => {approve_chat(notification.content.chat_id,notification.sender_id);
                    set_flash(!flash);}}
            >
                同意聊天室邀请
            </button>
        </div>
    );
}

function NotificationCard(props) 
{
    return (
        <>
        <div class="card">
            <div class="card-header">
                [{props.index}] : {props.header}
            </div>
            <div class="card-body">
                <h5 class="card-title">{props.message}</h5>
            </div>   
            {   
                !store.getState().auth.friends.includes(props.sender_id) && 
                props.content.status === "make request" &&
                (
                    <button
                        name="approve_friend"
                        className="btn btn-success"
                        onClick={() => {props.approve_friend_hook(props.sender_id);}}
                    >
                        同意
                    </button>
                )
            }
            {
                props.content.status === "make invitation" &&
                (
                    <button
                    name="approve_chat"
                    className="btn btn-success"
                    onClick={() => {props.approve_chat_hook(props.content.chat_id, props.sender_id);}}
                    >
                        同意聊天室邀请
                    </button>
                )
            }
            <button 
                name="delete"
                className="btn btn-primary"
                onClick={() => {props.delete_hook(props.notification_id)}}>
                删除此条通知
            </button>
        </div>
        </>
    )
}

export default NotificationCard;