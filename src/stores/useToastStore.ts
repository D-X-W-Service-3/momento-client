import { create } from 'zustand';

interface ToastState {
  message: string;
  /** 같은 문구를 연달아 띄워도 다시 나타나는 애니메이션이 돌도록 매번 바뀌는 키 */
  id: number;
  show: (message: string, duration?: number) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | undefined;

/** 전역 토스트. 화면 어디서든 useToastStore.getState().show('문구') 로 띄운다. */
export const useToastStore = create<ToastState>((set) => ({
  message: '',
  id: 0,
  show: (message, duration = 2500) => {
    clearTimeout(timer);
    set((state) => ({ message, id: state.id + 1 }));
    timer = setTimeout(() => set({ message: '' }), duration);
  },
  hide: () => {
    clearTimeout(timer);
    set({ message: '' });
  },
}));

export const showToast = (message: string, duration?: number) =>
  useToastStore.getState().show(message, duration);
