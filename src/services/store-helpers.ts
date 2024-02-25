// outsource dependencies
import { useSelector, type TypedUseSelectorHook } from 'react-redux';

// local dependencies
import { makeStore } from '@/services/store.ts';

// Infer the `RootState` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
