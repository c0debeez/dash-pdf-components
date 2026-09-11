import React from "react";

export type DashStyle = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface DashBaseProps {
  /** Unique ID to identify this component in Dash callbacks. */
  id?: string;
  /** A unique identifier for the component, used to improve performance by React.js while rendering components. See https://reactjs.org/docs/lists-and-keys.html for more info */
  key?: React.Key;
  /** Update props to trigger callbacks. */
  setProps: (props: Record<string, any>) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  /** Wild card data attributes */
  "data-*"?: string;
  /** Wild card aria attributes */
  "aria-*"?: string;
  /** CSS style */
  style?: DashStyle;
  /** className of the component */
  className?: string;
  /** Tab index */
  tabIndex?: number;
  /** ARIA role applied to the root element. */
  role?: string;
  /** Text direction applied to the root element. */
  dir?: "ltr" | "rtl" | "auto";
  /** Language applied to the root element. */
  lang?: string;
  /** Whether the root element is hidden. */
  hidden?: boolean;
  /** Object that holds the loading state object coming from dash-renderer */
  loading_state?: {
    /** Determines if the component is loading or not */
    is_loading: boolean;
    /** Holds which property is loading */
    prop_name: string;
    /** Holds the name of the component that is loading */
    component_name: string;
  };
}
