import { Injectable } from '@nestjs/common';
// @ts-ignore
import Pusher from 'pusher'; // এখানে * as Pusher এর বদলে শুধু Pusher লিখো

@Injectable()
export class PusherService {
  private pusher: any;

  constructor() {
    this.pusher = new Pusher({
      appId: "2154413",
      key: "f6ea48692172c968bea9",
      secret: "3555fb25211b1f959dfa",
      cluster: "ap2",
      useTLS: true,
    });
  }

  async trigger(channel: string, event: string, data: any) {
    try {
      await this.pusher.trigger(channel, event, data);
      console.log(`🚀 Pusher: Event Sent - ${event} on ${channel}`);
    } catch (error: any) {
      console.error('❌ Pusher Trigger Error:', error.message);
    }
  }
}