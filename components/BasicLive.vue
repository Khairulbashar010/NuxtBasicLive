<template>
    <div>
        <div class="container-fluid banner">
            <p class="banner-text">Basic Live</p>
            <a style="color: rgb(255, 255, 255);fill: rgb(255, 255, 255);fill-rule: evenodd; position: absolute; right: 10px; top: 4px;"
            class="Header-link " href="https://github.com/AgoraIO/API-Examples-Web/tree/main/Demo">
            <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
            </a>
        </div>

        <div id="success-alert" class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Congratulations!</strong><span> You can invite others to watch your live by click </span><a id="success-alert-link" href="" target="_blank">here</a>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        
        <div class="container">
            <form id="join-form" name="join-form" @submit.prevent="handleSubmit">
            <div class="row join-info-group">
                <div class="col-sm">
                    <p class="join-info-text">AppID</p>
                    <input id="appid" type="text" placeholder="enter appid" v-model="options.appid" required>
                    <p class="tips">If you don`t know what is your appid, checkout <a href="https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#a-nameappidauapp-idu">this</a></p>
                </div>
                <div class="col-sm">
                    <p class="join-info-text">Token(optional)</p>
                    <input id="token" type="text" placeholder="enter token" v-model="options.token">
                    <p class="tips">If you don`t know what is your token, checkout <a href="https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#a-namekeyadynamic-key">this</a></p>
                </div>
                <div class="col-sm">
                    <p class="join-info-text">Channel</p>
                    <input id="channel" type="text" placeholder="enter channel name" v-model="options.channel" required>
                    <p class="tips">If you don`t know what is your channel, checkout <a href="https://docs.agora.io/en/Agora%20Platform/terms?platform=All%20Platforms#channel">this</a></p>
                </div>
                <div class="col-sm">
                    <p class="join-info-text">User ID(optional)</p>
                    <input id="uid" type="text" onkeyup="this.value=this.value.replace(/[^0-9]/g,'')"  v-model="options.uid" onafterpaste="this.value=this.value.replace(/[^0-9]/g,'')" placeholder="Enter the user ID">
                </div>
            </div>

            <div class="button-group">
                <button id="host-join" type="submit" @click.prevent="setHost" class="btn btn-primary btn-sm">Join as host</button>
                <div class="btn-group">
                    <button id="audience-join" type="submit" class="btn btn-primary btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Join as audience
                    </button>
                </div>
                <button id="leave" type="button" class="btn btn-primary btn-sm" @click.prevent="leave" disabled>Leave</button>
            </div>
            </form>
            <!-- Single button -->
            <div class="row video-group">
            <div class="col">
                <p id="local-player-name" class="player-name"></p>
                <div id="local-player" class="player"></div>
            </div>
            <div class="w-100"></div>
            <div class="col">
                <div id="remote-playerlist"></div>
            </div>
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
                localTracks: {
                    videoTrack: null,
                    audioTrack: null
                },
                localStream: null,
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
                uid: Math.floor(Math.random() * 16) + 5,
            },
            remoteUsers: {},
            clientRoleOptions: {
                // Set latency level to low latency
                level: 1
            }
        }
    },
    methods: {
        setHost() {
            this.options.role = 'host';
        },
        async handleSubmit(){
            console.log("Submitted")
            document.getElementById("host-join").disabled = true;
            document.getElementById("audience-join").disabled = true;
            try {
                await join();
                if (this.options.role === "host") {
                    document.getElementById("success-alert-link").href = `index.html?appid=${this.options.appid}&channel=${this.options.channel}&token=${this.options.token}`
                    if (options.token) {
                        document.getElementById("success-alert-with-token").style.display = "block";
                    } else {
                        document.getElementById("success-alert-link").href = `index.html?appid=${this.options.appid}&channel=${this.options.channel}&token=${this.options.token}`
                        document.getElementById("success-alert").style.display = "block";
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                document.getElementById("leave").disabled = false;
            }
        },
        async  join() {
            // create Agora client

            if (this.options.role === "audience") {
                this.rtc.client.setClientRole(this.options.role, {level: 1});
                // add event listener to play remote tracks when remote user publishs.
                this.rtc.client.on("user-published", handleUserPublished);
                this.rtc.client.on("user-unpublished", handleUserUnpublished);
            }
            else{
                this.rtc.client.setClientRole(this.options.role);
            }

            // join the channel
            this.options.uid = await this.rtc.client.join(this.options.appid, this.options.channel, this.options.token || null, this.options.uid || null);

            if (this.options.role === "host") {
                // create local audio and video tracks
                this.rtc.localTracks.audioTrack = await this.$AgoraRTC.createMicrophoneAudioTrack();
                this.rtc.localTracks.videoTrack = await this.$AgoraRTC.createCameraVideoTrack();
                // play local video track
                this.rtc.localTracks.videoTrack.play("local-player");
                document.getElementById("local-player-name").innerText(`localTrack(${this.options.uid})`);
                // publish local tracks to channel
                await this.rtc.client.publish(Object.values(this.rtc.localTracks));
                console.log("publish success");
            }
        },
        async leave() {
            for (trackName in this.rtc.localTracks) {
                var track = this.rtc.localTracks[trackName];
                if (track) {
                    track.stop();
                    track.close();
                    this.rtc.localTracks[trackName] = undefined;
                }
            }

            // remove remote users and player views
            this.remoteUsers = {};
            document.getElementById("remote-playerlist").innerText = "";

            // leave the channel
            await this.rtc.client.leave();
            document.getElementById("local-player-name").innerText = "";
            document.getElementById("host-join").disabled = false;
            document.getElementById("audience-join").disabled = false;
            document.getElementById("leave").disabled = false;
            console.log("client leaves channel success");
        },
        async subscribe(user, mediaType) {
            const uid = user.uid;
            // subscribe to a remote user
            await this.rtc.client.subscribe(user, mediaType);
            console.log("subscribe success");
            if (mediaType === 'video') {
                const player = ref(`
                <div id="player-wrapper-${uid}">
                    <p class="player-name">remoteUser(${uid})</p>
                    <div id="player-${uid}" class="player"></div>
                </div>
                `);
                document.getElementById("remote-playerlist").appendChild(player);
                user.videoTrack.play(`player-${uid}`, {fit:"contain"});
            }
            if (mediaType === 'audio') {
                user.audioTrack.play();
            }
        },
        handleUserPublished(user, mediaType) {
            //print in the console log for debugging 
            console.log('"user-published" event for remote users is triggered.');
            const id = user.uid;
            this.remoteUsers[id] = user;
            this.subscribe(user, mediaType);
        },

        handleUserUnpublished(user, mediaType) {
            //print in the console log for debugging 
            console.log('"user-unpublished" event for remote users is triggered.');
            if (mediaType === 'video') {
                const id = user.uid;
                delete this.remoteUsers[id];
                document.getElementById(`player-wrapper-${id}`).remove();
            }
        }

    },
    mounted() {
        if(process.client){
            this.rtc.client = this.$AgoraRTC.createClient({
                mode: "live",
                codec: "vp8",
            });
        }
    }
}
</script>

<style>
.banner {
  padding: 0;
  background-color: #52575c;
  color: white;
}

.banner-text {
  padding: 8px 20px;
  margin: 0;
}


#join-form {
  margin-top: 10px;
}

.tips {
  font-size: 12px;
  margin-bottom: 2px;
  color: gray;
}

.join-info-text {
  margin-bottom: 2px;
}

input {
  width: 100%;
  margin-bottom: 2px;
}

.player {
  width: 480px;
  height: 320px;
}

.player-name {
  margin: 8px 0;
}

#success-alert, #success-alert-with-token {
  display: none;
}

@media (max-width: 640px) {
  .player {
    width: 320px;
    height: 240px;
  }
}
</style>