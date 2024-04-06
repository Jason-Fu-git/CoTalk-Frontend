
function PublicRoom()
{
    // DOM loaded
    const url='ws://'+window.location.host+'/ws/chat/room/';
    const chatSocket=new WebSocket(url);
    
    //客户端收到消息时触发
    chatSocket.onmessage=function(event) {
        const data=JSON.parse(event.data);
        const chat=document.getElementById('chat');
    
        //防止自己发给自己
        if (data.type)
        {
            console.log("Frontend receive: ");
            console.log(event);
            //将新消息添加到后面
            const dateOptions={hour: 'numeric', minute:'numeric', hour12:true};
            const datetime=new Date(data.datetime).toLocaleString('en', dateOptions);
            const name=data.user;
            chat.innerHTML+='<div class="message">'+
                '<strong>'+name+'</strong>'+
                '<span class="date">'+datetime+'</span><br>'+
                data.message+'</div>';
            chat.scrollTop=chat.scrollHeight;
        }
    };
    
    chatSocket.onclose=function(event) {
        console.error('Chat socket closed unexpectedly');
    };
    
    const input=document.getElementById('chat-message-input');
    const submitButton=document.getElementById('chat-message-submit');
    
    submitButton.addEventListener('click', function(event) {
        const message=input.value;
        if (message)
        {
            console.log("Frontend send:");
            console.log(message);
            chatSocket.send(JSON.stringify({'message':message}));
    
            input.value='';
            input.focus();
        }
    });
    
    input.addEventListener('keypress', function(event) {
        if (event.key=='Enter')
        {
            //使用Enter也可以发送
            event.preventDefault();
            submitButton.click();
        }
    });
    
    input.focus();
}

export default PublicRoom;