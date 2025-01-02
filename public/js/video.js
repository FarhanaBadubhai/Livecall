window.VideoCall = class VideoCall {
    constructor() {
        this.hmsStore = new window.HMSReactiveStore();
        this.hmsActions = this.hmsStore.getActions();
        console.log('HMS Store initialized:', this.hmsStore);
    }

    async joinRoom(roomId, token) {
        console.log('Joining room with token:', token);
        try {
            await this.hmsActions.join({
                authToken: token,
                settings: {
                    isAudioMuted: false,
                    isVideoMuted: false
                }
            });
            
            const localVideo = document.getElementById('local-video');
            const localPeer = this.hmsStore.getState(selectLocalPeer);
            if (localPeer?.videoTrack) {
                localVideo.srcObject = localPeer.videoTrack;
                await localVideo.play();
            }
        } catch (error) {
            console.error('HMS Join Error:', error);
            throw error;
        }
    }



    attachVideoElements() {
        const localVideo = document.getElementById('local-video');
        const remoteVideos = document.getElementById('remote-videos');
        
        this.hmsClient.attachVideo(localVideo, true);
        this.hmsClient.attachVideo(remoteVideos, false);
    }

    async toggleAudio() {
        this.isAudioEnabled = !this.isAudioEnabled;
        await this.hmsClient.setLocalAudioEnabled(this.isAudioEnabled);
        const muteButton = document.querySelector('#call-controls button:nth-child(1)');
        muteButton.textContent = this.isAudioEnabled ? 'Mute' : 'Unmute';
    }

    async toggleVideo() {
        this.isVideoEnabled = !this.isVideoEnabled;
        await this.hmsClient.setLocalVideoEnabled(this.isVideoEnabled);
        const videoButton = document.querySelector('#call-controls button:nth-child(2)');
        videoButton.textContent = this.isVideoEnabled ? 'Video Off' : 'Video On';
    }

    async leaveRoom() {
        await this.hmsClient.leave();
        document.getElementById('call-controls').style.display = 'none';
        document.getElementById('rooms-list').style.display = 'block';
        document.getElementById('video-container').classList.remove('active');
    }
}

const videoCall = new VideoCall();

window.toggleAudio = () => videoCall.toggleAudio();
window.toggleVideo = () => videoCall.toggleVideo();
window.leaveRoom = () => videoCall.leaveRoom();
