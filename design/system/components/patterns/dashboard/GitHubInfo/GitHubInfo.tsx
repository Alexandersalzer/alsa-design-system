import React from 'react';
import { Card, CardContent } from '../../../primitives/Card';
import { Label, Body } from '../../../primitives/Typography';
import { Button } from '../../../primitives/Button';
import { Tag } from '../../../primitives/Tag';
import { IconButton } from '../../../primitives/IconButton';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export interface GitHubInfoProps {
  repoId?: string;
  repoName?: string;
  repoUrl?: string;
  onCopyUrl?: () => void;
}

export const GitHubInfo: React.FC<GitHubInfoProps> = ({
  repoId,
  repoName,
  repoUrl,
  onCopyUrl
}) => {
  const hasRepo = Boolean(repoId && repoName && repoUrl);

  return (
    <div>
      <Label weight="semibold" className="mb-2">GitHub Repository</Label>
      {hasRepo ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div>
                <Body size="sm">{repoName}</Body>
                <div className="flex items-center gap-2 mt-1">
                  <Tag variant="info" size="small">ID: {repoId}</Tag>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                icon={<DocumentDuplicateIcon className="h-4 w-4" />}
                onClick={onCopyUrl}
                variant="ghost"
                size="sm"
                aria-label="Kopiera repo URL"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(repoUrl, '_blank')}
              >
                Öppna repo
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Body size="sm" color="secondary">Inget GitHub-repo konfigurerat</Body>
      )}
    </div>
  );
}; 