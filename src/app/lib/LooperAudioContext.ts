export class LooperAudioContext {
    private static _instance: any = null;

    public static getInstance(): AudioContext {
        if (LooperAudioContext._instance === null) {
            LooperAudioContext._instance = new AudioContext();
        }
        return LooperAudioContext._instance;
    }

    constructor() {
        if (LooperAudioContext._instance) {
            throw new Error("must use the getInstance.");
        }
        LooperAudioContext._instance = this;
    }

}
