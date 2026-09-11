import { DashBaseProps } from "props/shared/dash";

interface DashWindow extends Window {
  dash_component_api?: {
    useDashContext: () => { useLoading: () => boolean };
  };
}

export const getLoadingState = (
  loadingState?: DashBaseProps["loading_state"],
): boolean => {
  const api = (window as DashWindow).dash_component_api;
  return api
    ? api.useDashContext().useLoading()
    : (loadingState?.is_loading ?? false);
};
