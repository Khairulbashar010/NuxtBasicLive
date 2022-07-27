<template>
    <div>
        <h1>
            Live Streaming<br><small style="font-size: 14pt;">Powered by Agora.io</small>
        </h1>
        <h4>Local video</h4>
        <div id="me"></div>
        <h4>Remote video</h4>
        <div id="remoteContainer" ref="remoteContainer">
        </div>

        <div class="button-group" style="display:flex; gap: 1rem; margin-top: 5rem">
                <button  id="host-join" type="button" class="btn btn-primary" @click="setRole('host')">Join as host</button>
                <div class="btn-group">
                    <button id="audience-join" type="button" @click="setRole" class="btn btn-primary btn-sm">
                        Join as audience
                    </button>
                </div>
                <button id="leave" type="button" class="btn btn-primary btn-sm" @click="leave" disabled>Leave</button>
            </div>
    </div>
</template>

<script>
import * as agora from "~/agora.config.js";

export default {
    data() {
        return {
            remoteContainer: this.$refs.remoteContainer,
            rtc: {
                // For the local audio and video tracks.
                localAudioTrack: null,
                localVideoTrack: null,
                client: null
            },
            options: {
                // Pass your app ID here.
                appid: agora.appid,
                // Set the channel name.
                channel: "test",
                // Set the user role in the channel.
                role: "audience",
                // Use a temp token
                token: agora.token,
                // Uid
                uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            },
            remoteUsers: {},
            clientRoleOptions: {
                // Set latency level to low latency
                level: 1
            }
        }
    },
    methods: {
        createClient(){
             this.rtc.client = AgoraRTC.createClient({
                mode: "live",
                codec: "vp8",
            });

            this.rtc.client.init(this.options.appid, function() {
                console.log("client initialized");
            }, function(err) {
                console.log("client init failed ", err);
            });
        },
        handleError(err){
            console.log("Error: ", err);
        },
        // Add video streams to the container.
        addVideoStream(elementId){
            // Creates a new div for every stream
            let streamDiv = document.createElement("div");
            // Assigns the elementId to the div.
            streamDiv.id = elementId;
            // Takes care of the lateral inversion
            streamDiv.style.transform = "rotateY(180deg)";
            // Adds the div to the container.
            this.remoteContainer.appendChild(streamDiv);
        },
        // Remove the video stream from the container.
        removeVideoStream(elementId) {
            let remoteDiv = document.getElementById(elementId);
            if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
        },
        setRole(role="audience") {
            this.options.role = role;
            console.log(role);
            this.rtc.client.setClientRole(role);
            this.joinChannel();
        },
        joinChannel(){
            // Join a channel
            this.rtc.client.join(this.options.token, this.options.channel, null, (uid)=>{
                // Create a local stream
                if(this.options.role === 'host'){
                    let localStream = AgoraRTC.createStream({
                        streamID: uid,
                        audio: true,
                        video: true,
                        screen: false,
                        microphone: false,
                        camera: false,
                        // The video profile.
                        videoProfile: "480p_4"
                    });
                    // Initlize the local stream.
                    localStream.init(()=>{
                        // Add the local stream to the container.
                        localStream.play("local-stream");
                        // Publish the stream to the channel.
                        this.rtc.client.publish(localStream, (err)=>{
                            console.log(err);
                        });
                    });
                } else {
                    
                }
            }, handleError);
        },
        async startBasicLiveStreaming() {
            this.rtc.client = AgoraRTC.createClient({
                mode: "live",
                codec: "vp8",
            });

            this.rtc.client.init(this.options.appid, function() {
                console.log("client initialized");
            }, function(err) {
                console.log("client init failed ", err);
            });
        }
    },
    mounted() {
        this.startBasicLiveStreaming();
        this.createClient();
        console.log(this.remoteContainer);
    }
}
</script>

<style>
*{
    font-family: sans-serif;
}
h1,h4{
    text-align: center;
}
#me{
    position: relative;
    width: 50%;
    margin: 0 auto;
    display: block;
}
#me video{
    position: relative !important;
}
#remote-container{
    display: flex;
}
#remote-container video{
    height: auto;
    position: relative !important;
}
</style>