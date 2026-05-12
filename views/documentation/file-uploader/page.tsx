"use client";

import React from 'react';
import { Box, Body, FileUploader } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function FileUploaderPage() {
  return (
    <ComponentDocPage
      componentName="FileUploader"
      description="File upload component with drag-and-drop support and file type validation"
      importStatement={`import { FileUploader } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          preview: (
            <Box>
              <FileUploader
                onSelect={(files) => console.log(files)}
                accept="image/*"
                label="Upload Image"
              />
            </Box>
          ),
          code: `<FileUploader
  onFileSelect={(files) => handleFiles(files)}
  accept="image/*"
  label="Upload Image"
/>`,
        },
        {
          title: 'Multiple Files',
          preview: (
            <Box>
              <FileUploader
                multiple
                onSelect={(files) => console.log(files)}
                label="Upload Multiple Files"
              />
            </Box>
          ),
          code: `<FileUploader
  multiple
  onFileSelect={(files) => handleFiles(files)}
  label="Upload Multiple Files"
/>`,
        },
        {
          title: 'Practical Example',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="sm">
                <Body weight="medium">Profile Picture</Body>
                <FileUploader
                  onSelect={(files) => console.log(files)}
                  accept="image/png,image/jpeg"
                  label="Choose a profile picture"
                />
                <Body size="xs" color="secondary">PNG or JPEG, max 5MB</Body>
              </Box>
            </Box>
          ),
          code: `<Box display="flex" direction="column" gap="sm">
  <Body weight="medium">Profile Picture</Body>
  <FileUploader
    onFileSelect={handleUpload}
    accept="image/png,image/jpeg"
    label="Choose a profile picture"
  />
  <Body size="xs" color="secondary">PNG or JPEG, max 5MB</Body>
</Box>`,
        },
      ]}
    />
  );
}
