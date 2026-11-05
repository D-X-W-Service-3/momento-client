import { api } from '@/apis/client';

interface VapidPublicKeyResponse {
  publicKey: string;
}

/** 브라우저 PushSubscription.toJSON() 형태 그대로 보낸다. */
export type PushSubscriptionBody = PushSubscriptionJSON;

export const fetchVapidPublicKey = () =>
  api.get<VapidPublicKeyResponse>('/v1/push/vapid-public-key', {
    auth: false,
  });

/** endpoint 기준 upsert. 같은 기기로 다른 유저가 로그인하면 소유자가 바뀐다. */
export const registerPushSubscription = (subscription: PushSubscriptionBody) =>
  api.post<void>('/v1/push/subscriptions', subscription);

/** 이미 없는 구독이어도 서버는 성공으로 응답한다. */
export const deletePushSubscription = (endpoint: string) =>
  api.delete<void>(
    `/v1/push/subscriptions?endpoint=${encodeURIComponent(endpoint)}`,
    { redirectOnUnauthorized: false },
  );
