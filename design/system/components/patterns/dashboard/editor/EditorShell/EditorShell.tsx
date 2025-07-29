import React, { ReactNode } from 'react';
import { Button } from '../../../../primitives/Button';
import { IconButton } from '../../../../primitives/IconButton';
import { Icon } from '../../../../primitives/Icon';
import { ArrowLeftIcon } from 'lucide-react';

export interface EditorShellProps {
  /* Content */
  children: ReactNode;
  sidebarContent?: ReactNode;
  
  /* Topbar */
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  
  /* Save state */
  hasChanges?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  onPublish?: () => void;
  saveDisabled?: boolean;
  publishDisabled?: boolean;
  
  /* Sidebar */
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  
  /* Additional topbar actions */
  topbarActions?: ReactNode;
  
  /* CSS */
  className?: string;
}

export const EditorShell: React.FC<EditorShellProps> = ({
  children,
  sidebarContent,
  title = "Editor",
  onBack,
  showBackButton = true,
  hasChanges = false,
  isSaving = false,
  onSave,
  onPublish,
  saveDisabled = false,
  publishDisabled = false,
  sidebarOpen = true,
  onToggleSidebar,
  topbarActions,
  className = ""
}) => {
  // Status indicator logic
  const getStatusContent = () => {
    if (isSaving) {
      return {
        className: "editor-shell__status--saving",
        text: "Saving...",
        icon: "loader"
      };
    }
    
    if (hasChanges) {
      return {
        className: "editor-shell__status--changes",
        text: "Unsaved changes",
        icon: "circle"
      };
    }
    
    return {
      className: "editor-shell__status--saved",
      text: "All changes saved",
      icon: "check"
    };
  };
  
  const status = getStatusContent();
  
  return (
    <div className={`editor-shell ${className}`}>
      {/* Topbar */}
      <div className="editor-shell__topbar">
        <div className="editor-shell__topbar-left">
          {showBackButton && onBack && (
            <IconButton
              icon={<Icon><ArrowLeftIcon/></Icon>}
              variant="ghost"
              size="sm"
              onClick={onBack}
              aria-label="Go back"
            />
          )}
          
          {onToggleSidebar && (
            <IconButton
              icon="sidebar"
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
              className={`md:hidden`}
            />
          )}
          
          <h1 className="editor-shell__title">{title}</h1>
        </div>
        
        <div className="editor-shell__topbar-center">
          <div className={`editor-shell__status ${status.className}`}>
            
            <span>{status.text}</span>
          </div>
        </div>
        
        <div className="editor-shell__topbar-right">
          {topbarActions}
          
          {onSave && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSave}
              disabled={saveDisabled || isSaving || !hasChanges}
            >
              Save
            </Button>
          )}
          
          {onPublish && (
            <Button
              variant="primary"
              size="sm"
              onClick={onPublish}
              disabled={publishDisabled || isSaving}
            >
              Publish
            </Button>
          )}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="editor-shell__content">
        {/* Sidebar */}
        {sidebarContent && (
          <aside 
            className={`editor-shell__sidebar ${
              sidebarOpen ? 'editor-shell__sidebar--open' : ''
            }`}
          >
            <div className="editor-shell__sidebar-content">
              {sidebarContent}
            </div>
          </aside>
        )}
        
        {/* Main Content */}
        <main className="editor-shell__main">
          <div className="editor-shell__main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};