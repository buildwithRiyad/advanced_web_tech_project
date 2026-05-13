// backend/src/pusher.service.ts
import { Injectable } from '@nestjs/common';
// import * as Pusher from 'pusher'; <-- এটি পরিবর্তন করুন
const Pusher = require('pusher'); // এটি ব্যবহার করে দেখুন

@Injectable()
export class PusherService {
  private pusher: any; // Type 'any' দিন যাতে এরর না দেখায়

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
    await this.pusher.trigger(channel, event, data);
  }
}