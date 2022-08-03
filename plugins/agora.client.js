import Vue from "vue";
import AgoraRTC from "agora-rtc-sdk-ng"

export default ({app}, inject) => {
    inject("AgoraRTC", AgoraRTC)
}