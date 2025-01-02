async function createRoom() {
    const name = 'Meeting Room ' + Date.now();
    try {
        const result = await RoomManager.createRoom(name);
        if (result.success) {
            // Use the meeting URL directly
            window.location.href = result.meetingUrl;
            // Or store it for later use
            localStorage.setItem('meetingUrl', result.meetingUrl);
        }
    } catch (error) {
        console.error('Error creating room:', error);
    }
}


async function listRooms() {
    try {
        const result = await RoomManager.listRooms();
        if (result.success) {
            const roomsList = document.getElementById('rooms-list');
            roomsList.innerHTML = result.rooms.map(room => `
                <div class="room-item">
                    <h3>${room.name}</h3>
                    <p>Participants: ${room.participants}</p>
                    <button onclick="joinRoom('${room.room_id}')">Join Room</button>
                </div>
            `).join('');
            
        }
    } catch (error) {
        console.error('Error listing rooms:', error);
    }
}

async function joinRoom(roomId) {
    try {
        const response = await fetch('/api/rooms/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                roomId: roomId,
                userId: 'user_' + Date.now(),
                role: 'host'
            })
        });
        
        const data = await response.json();
        if (data.success) {
            const videoCall = new VideoCall();
            await videoCall.joinRoom(roomId, data.authToken.token);
            
            document.getElementById('call-controls').style.display = 'block';
            document.getElementById('rooms-list').style.display = 'none';
        }
    } catch (error) {
        console.error('Error joining room:', error);
    }
}

