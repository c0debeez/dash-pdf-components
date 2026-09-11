import React from "react";
import ThumbnailView from "fragments/Thumbnail";
import type { ThumbnailProps } from "props/Thumbnail";

/** Renders a PDF page thumbnail without text or annotation layers. Place it inside Document. */
const Thumbnail = (props: ThumbnailProps) => <ThumbnailView {...props} />;

export default Thumbnail;
