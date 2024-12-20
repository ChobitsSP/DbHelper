import Rx, { Subject, ReplaySubject } from "rxjs";
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from "vue";

interface EventItem {
  n: string;
  v: any;
}

const sub = new Subject<EventItem>();

export function emit<T = any>(n: string, v: T) {
  sub.next({ n, v });
}

export function useRx() {
  const isActive = ref(true);

  onActivated(() => isActive.value = true);
  onDeactivated(() => isActive.value = false);

  const observables: Rx.Subscription[] = [];

  const $mounted = new ReplaySubject();
  onMounted(() => {
    $mounted.next(null);
  });

  function add(sub: Rx.Subscription) {
    observables.push(sub);
  }

  function on<T = any>(name: string, func?: (data?: T) => void) {
    const source = sub.asObservable()
      .filter(() => isActive.value)
      .filter(t => t.n === name)
      .map(t => t.v as T);
    if (func == null) return source;
    observables.push(source.subscribe(func));
    return source;
  }

  function MyEmit<T = any>(n: string, v?: T) {
    emit(n, v);
  }

  onUnmounted(() => {
    // console.log('解除订阅');
    observables.forEach((t) => {
      t.unsubscribe();
      // t.complete();
    });
  });

  return {
    add,
    on,
    emit: MyEmit,
    onMounted(hook: () => any) {
      add($mounted.subscribe(hook));
    },
  };
}

export function useRxInstance<T>() {
  let obj: T;

  const sub = new ReplaySubject<T>(1);

  function SetInstance(obj: T) {
    sub.next(obj);
  }

  async function GetInstance() {
    if (obj != null) return obj;
    return new Promise<T>(resolve => {
      sub.subscribe(resolve);
    });
  }

  return {
    SetInstance,
    GetInstance,
  }
}