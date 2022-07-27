<template>
    <div>
        <h2 class="left-align">Agora Video Web SDK Quickstart</h2>
        <div class="row">
            <div>
                <button type="button" id="host-join" ref="host-join" @click="hostJoin">Join as host</button>
                <button type="button" id="audience-join" ref="audience-join" @click="audienceJoin">Join as audience</button>
                <button type="button" id="leave" ref="leave" @click="leave">Leave</button>
            </div>
        </div>
    </div>
</template>

<script>
import * as agora from "~/agora.config.js";

export default {
    data() {
        return {
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
                channel: "test123",
                // Set the user role in the channel.
                role: "audience",
                // Use a temp token
                token: agora.token,
                // Uid
                uid: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            },
            clientRoleOptions: {
                // Set latency level to low latency
                level: 1
            },
        }
    },
    methods: {
        async hostJoin () {
            console.log("Joining as host");
            this.rtc.client.setClientRole("host");
            await this.rtc.client.join(this.options.appid, this.options.channel, this.options.token, this.options.uid);
            // Create an audio track from the audio sampled by a microphone.
            this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Create a video track from the video captured by a camera.
            this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            // Publish the local audio and video tracks to the channel.
            await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
            // Dynamically create a container in the form of a DIV element for playing the remote video track.
            const localPlayerContainer = document.createElement("div");
            // Specify the ID of the DIV container. You can use the `uid` of the remote user.
            localPlayerContainer.id = this.options.uid;
            localPlayerContainer.textContent = "Local user " + this.options.uid;
            localPlayerContainer.style.width = "640px";
            localPlayerContainer.style.height = "480px";
            document.body.append(localPlayerContainer);

            this.rtc.localVideoTrack.play(localPlayerContainer);

            console.log("publish success!");
        },
        async audienceJoin () {
            console.log("Joining as audience");
            this.rtc.client.setClientRole("audience");
            await this.rtc.client.join(this.options.appid, this.options.channel, this.options.token, this.options.uid);
            this.rtc.client.on("user-published", async (user, mediaType) => {
                // Subscribe to a remote user.
                await this.rtc.client.subscribe(user, mediaType);
                console.log("subscribe success");

                // If the subscribed track is video.
                if (mediaType === "video") {
                    // Get `RemoteVideoTrack` in the `user` object.
                    const remoteVideoTrack = user.videoTrack;
                    // Dynamically create a container in the form of a DIV element for playing the remote video track.
                    const remotePlayerContainer = document.createElement("div");
                    // Specify the ID of the DIV container. You can use the `uid` of the remote user.
                    remotePlayerContainer.id = user.uid.toString();
                    remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
                    remotePlayerContainer.style.width = "640px";
                    remotePlayerContainer.style.height = "480px";
                    document.body.append(remotePlayerContainer);

                    // Play the remote video track.
                    // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
                    remoteVideoTrack.play(remotePlayerContainer);
                }

                // If the subscribed track is audio.
                if (mediaType === "audio") {
                    // Get `RemoteAudioTrack` in the `user` object.
                    const remoteAudioTrack = user.audioTrack;
                    // Play the audio track. No need to pass any DOM element.
                    remoteAudioTrack.play();
                }
            });
        },
        async leave () {
            console.log("Leaving channel");
            // Close all the local tracks.
            this.rtc.localAudioTrack.close();
            this.rtc.localVideoTrack.close();
            // Traverse all remote users.
            this.rtc.client.remoteUsers.forEach(user => {
                // Destroy the dynamically created DIV containers.
                const playerContainer = document.getElementById(user.uid);
                playerContainer && playerContainer.remove();
            });

            // Leave the channel.
            await this.rtc.client.leave();
        },
        startBasicLiveStreaming() {
            this.rtc.client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
        }

    },
    mounted() {
        if (process.client) {
            this.startBasicLiveStreaming();
        }
    },
    beforeUnmount() {
        if(process.client) {
            this.leave();
        }
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