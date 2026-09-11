import React from "react";
import OutlineView from "fragments/Outline";
import type { OutlineProps } from "props/Outline";

/** Renders a PDF table of contents. Place it inside Document. */
const Outline = (props: OutlineProps) => <OutlineView {...props} />;

export default Outline;
