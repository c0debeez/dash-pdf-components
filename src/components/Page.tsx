import React from "react";
import PageView from "fragments/Page";
import type { PageProps } from "props/Page";

/** Renders one PDF page. Place it inside Document. */
const Page = (props: PageProps) => <PageView {...props} />;

export default Page;
