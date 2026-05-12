"use client";

import React from 'react';
import {
  Box,
  H1,
  H2,
  H3,
  H4,
  H5,
  Body,
} from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function HeadingsPage() {
  return (
    <ComponentDocPage
      componentName="Headings"
      description="Five heading levels for content hierarchy"
      importStatement={`import { H1, H2, H3, H4, H5 } from '../../../design/index'`}
      sections={[
        {
          title: 'All Heading Levels',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1"
            >
              <Box>
                <H1>Heading 1</H1>
                <Body size="xs" color="secondary">H1 - Main page titles</Body>
              </Box>
              <Box>
                <H2>Heading 2</H2>
                <Body size="xs" color="secondary">H2 - Section titles</Body>
              </Box>
              <Box>
                <H3>Heading 3</H3>
                <Body size="xs" color="secondary">H3 - Subsection titles</Body>
              </Box>
              <Box>
                <H4>Heading 4</H4>
                <Body size="xs" color="secondary">H4 - Minor headings</Body>
              </Box>
              <Box>
                <H5>Heading 5</H5>
                <Body size="xs" color="secondary">H5 - Small headings</Body>
              </Box>
            </Box>
          ),
          code: `<H1>Heading 1</H1>
<H2>Heading 2</H2>
<H3>Heading 3</H3>
<H4>Heading 4</H4>
<H5>Heading 5</H5>`,
        },
      ]}
    />
  );
}
