// ===============================================
// src/design-system/components/patterns/editor/content-editing/PageTree/PageTree.tsx
// PAGE TREE COMPONENT - UPDATED FOR NEW API STRUCTURE
// ===============================================

import React, { useState } from 'react';
import { Label, Body } from '../../../../../primitives/Typography';
import Icon from '../../../../../primitives/Icon';
import './PageTree.css';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import {
  TvIcon,
  StarIcon,
  Square2StackIcon,
  H1Icon,
  RectangleGroupIcon,
  DocumentIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'; // or /outline depending on style


// ===== PAGE TREE TYPES =====
export interface PageTreeProps {
  pages: any[];
  selectedBlock?: any;
  selectedContainer?: any;
  selectedBackground?: any;
  selectedPage?: any;
  onPageClick?: (page: any) => void;
  onSectionClick?: (pageId: string, section: any) => void;
  onContainerClick?: (pageId: string, sectionId: string, container: any) => void;
  onBlockClick?: (pageId: string, sectionId: string, containerId: string, block: any) => void;
}

export interface TreeNodeProps {
  icon: React.ElementType;
  label: string;
  level: number;
  isExpanded?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  children?: React.ReactNode;
  badge?: string;           // For showing counts like "3 sections"
  subtitle?: string;        // For showing additional info
}

// ===== TREE NODE COMPONENT (SINGLE DEFINITION) =====
const TreeNode: React.FC<TreeNodeProps> = ({
  icon,
  label,
  level,
  isExpanded = false,
  isSelected = false,
  hasChildren = false,
  onToggle,
  onClick,
  children,
  badge,
  subtitle
}) => {
  return (
    <div className="tree-node">
      <div 
        className={`tree-node__header tree-node__header--level-${level} ${
          isSelected ? 'tree-node__header--selected' : ''
        }`}
        onClick={onClick}
        style={{ paddingLeft: `${level * 20 + 12}px` }}
      >
        {hasChildren && (
          <button
            className={`tree-node__expand ${isExpanded ? 'tree-node__expand--open' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggle?.();
            }}
          >
            <Icon color='secondary'><ChevronRightIcon/></Icon>

            <div className="tree-node__icon">
          <Icon color="accent">
            {icon ? React.createElement(icon) : <QuestionMarkCircleIcon />}
          </Icon>
        </div>
        
        <div className="tree-node__content">
          <Label size="sm" weight="medium" className="tree-node__label">
            {label}
          </Label>
          {subtitle && (
            <Body size="xs" color="secondary" className="tree-node__subtitle">
              {subtitle}
            </Body>
          )}
        </div>
        
        {badge && (
          <div className="tree-node__badge">
            <Body size="xs" color="tertiary">
              {badge}
            </Body>
          </div>
        )}
          </button>
        )}
        
       
      </div>

      {hasChildren && isExpanded && (
        <div className="tree-node__children">
          {children}
        </div>
      )}
    </div>
  );
};


// ===== MAIN PAGE TREE COMPONENT =====
export const PageTree: React.FC<PageTreeProps> = ({
  pages,
  selectedBlock,
  selectedContainer,
  selectedBackground,
  selectedPage,
  onPageClick,
  onSectionClick,
  onContainerClick,
  onBlockClick
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['page-0']));

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const isExpanded = (nodeId: string) => expandedNodes.has(nodeId);

  if (!pages || pages.length === 0) {
    return (
      <div className="page-tree">
        <div className="page-tree__empty">
          <Icon><DocumentIcon/></Icon>
          <Body size="sm" color="secondary">No page structure found</Body>
        </div>
      </div>
    );
  }

  return (
    <div className="page-tree">
      {pages.map((page, pageIndex) => {
        const pageId = `page-${pageIndex}`;
        // UPDATED: Use templates instead of sections
        const pageHasChildren = page.templates && page.templates.length > 0;
        
        return (
          <TreeNode
            key={pageId}
            icon={TvIcon}
            label={page.name || page.slug || 'Desktop'}
            level={0}
            isExpanded={isExpanded(pageId)}
            hasChildren={pageHasChildren}
            badge={`${page.templates?.length || 0} templates`}
            onToggle={() => toggleNode(pageId)}
            onClick={() => onPageClick?.(page)}
          >
            {/* Page Templates (formerly sections) */}
            {page.templates?.map((template: any, templateIndex: number) => {
              const templateId = `${pageId}-template-${templateIndex}`;
              // UPDATED: Use patterns instead of containers
              const templateHasChildren = template.patterns && template.patterns.length > 0;
              const isTemplateSelected = selectedBackground?.section?.id === template.id;
              
              return (
                <TreeNode
                  key={templateId}
                  icon={template.type === 'hero' ? StarIcon : Square2StackIcon}
                  label={template.name || template.type || 'Template'}
                  level={1}
                  isExpanded={isExpanded(templateId)}
                  isSelected={isTemplateSelected}
                  hasChildren={templateHasChildren}
                  badge={`${template.patterns?.length || 0} patterns`}
                  subtitle={template.type}
                  onToggle={() => toggleNode(templateId)}
                  onClick={() => onSectionClick?.(page.id, template)}
                >
                  {/* Template Patterns (formerly containers) */}
                  {template.patterns?.map((pattern: any, patternIndex: number) => {
                    const patternId = `${templateId}-pattern-${patternIndex}`;
                    const patternHasChildren = pattern.blocks && pattern.blocks.length > 0;
                    const isPatternSelected = selectedContainer?.container?.id === pattern.id;
                    
                    return (
                      <TreeNode
                        key={patternId}
                        icon={RectangleGroupIcon}
                        label={pattern.name || pattern.type || 'Pattern'}
                        level={2}
                        isExpanded={isExpanded(patternId)}
                        isSelected={isPatternSelected}
                        hasChildren={patternHasChildren}
                        badge={`${pattern.blocks?.length || 0} blocks`}
                        subtitle={pattern.type}
                        onToggle={() => toggleNode(patternId)}
                        onClick={() => onContainerClick?.(page.id, template.id, pattern)}
                      >
                        {/* Pattern Blocks */}
                        {pattern.blocks?.map((block: any, blockIndex: number) => {
                          const blockId = `${patternId}-block-${blockIndex}`;
                          const isBlockSelected = selectedBlock?.block?.id === block.id;
                          
                          return (
                            <TreeNode
                              key={blockId}
                              icon={block.type === 'heading' ? H1Icon : DocumentIcon}
                              label={block.type === 'heading' ? 'Heading' : 'Text'}
                              level={3}
                              isSelected={isBlockSelected}
                              hasChildren={false}
                              subtitle={block.content ? `"${block.content.substring(0, 30)}..."` : undefined}
                              onClick={() => onBlockClick?.(page.id, template.id, pattern.id, block)}
                            />
                          );
                        })}
                      </TreeNode>
                    );
                  })}
                </TreeNode>
              );
            })}
          </TreeNode>
        );
      })}
    </div>
  );
};