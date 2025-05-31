"use client";
import authReducer, { AuthState } from "@/auth/slices/authSlide";
import recoveryPassReducer, {
  RecoveryPassState,
} from "@/auth/slices/recoveryPassSlice";
import dashboardReducer, {
  DashboardState,
} from "@/dashboard/slices/dashboardSlice";
import createScenarioReducer, {
  CreateScenarioState,
} from "@/scenarios/slices/createScenarioSlice";
import metricsReducer, { MetricsState } from "@/scenarios/slices/metricsSlice";
import runHistoryReducer, {
  RunHistoryState,
} from "@/scenarios/slices/runHistoriesSlice";
import scenarioGroupsReducer, {
  ScenarioGroupState,
} from "@/scenarios/slices/scenarioGroupsSlice";
import scenariosReducer, {
  ScenariosState,
} from "@/scenarios/slices/scenariosSlice";
import { appApi } from "@/shared/store/api/appApi";
import {
  Action,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(): Promise<null> {
      return Promise.resolve(null);
    },
    setItem(value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(): Promise<void> {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export type RootState = {
  [appApi.reducerPath]: ReturnType<typeof appApi.reducer>;
  auth: AuthState;
  recoveryPass: RecoveryPassState;
  dashboard: DashboardState;
  scenarios: ScenariosState;
  scenarioGroups: ScenarioGroupState;
  createScenario: CreateScenarioState;
  metrics: MetricsState;
  runHistories: RunHistoryState;
};

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["auth"],
  blacklist: [
    "recoveryPass",
    "dashboard",
    "createScenario",
    "runHistories",
    "scenarioGroups",
  ],
};

const appReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  auth: authReducer,
  recoveryPass: recoveryPassReducer,
  dashboard: dashboardReducer,
  scenarios: scenariosReducer,
  scenarioGroups: scenarioGroupsReducer,
  createScenario: createScenarioReducer,
  metrics: metricsReducer,
  runHistories: runHistoryReducer,
});

const rootReducer: Reducer<RootState, Action> = (state, action) => {
  // if (action.type === "anomaly/resetFilters") {
  //   state = undefined;
  // }
  return appReducer(state, action);
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(appApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
